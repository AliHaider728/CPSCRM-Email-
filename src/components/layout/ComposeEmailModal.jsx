import React, { useState, useEffect } from "react";
import { Mail, Send, Copy, CheckCircle2, Info, Paperclip, X, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Spinner } from "../ui/Spinner.jsx";
import { useSendEmail, useListClients, useListTeamMembers } from "../../lib/api.js";

export function ComposeEmailModal({
  isOpen, onClose,
  defaultClientId = "",
  defaultToEmail = "",
  defaultToName = "",
  defaultSubject = "",
}) {
  const [to, setTo]           = useState(defaultToEmail);
  const [toName, setToName]   = useState(defaultToName);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody]       = useState("");
  const [clientId, setClientId] = useState(defaultClientId);
  const [showBcc, setShowBcc]   = useState(true);
  const [bccCopied, setBccCopied] = useState(false);
  const [showClientDrop, setShowClientDrop] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const { data: clientsData } = useListClients({});
  const { data: teamData }    = useListTeamMembers();
  const { mutate: sendEmail, isPending: isSending } = useSendEmail?.() || { mutate: () => {}, isPending: false };

  const currentMember = teamData?.members?.[0];
  const bccAddress = currentMember?.bccAddress || `activity+${currentMember?.id || "user"}@ourcrm.com`;

  useEffect(() => {
    if (isOpen) {
      setTo(defaultToEmail); setToName(defaultToName);
      setSubject(defaultSubject); setClientId(defaultClientId);
      setBody(""); setAttachments([]);
    }
  }, [isOpen, defaultToEmail, defaultToName, defaultSubject, defaultClientId]);

  const copyBcc = () => {
    navigator.clipboard.writeText(bccAddress);
    setBccCopied(true);
    setTimeout(() => setBccCopied(false), 2000);
  };

  const selectedClient = clientsData?.clients?.find((c) => c.id === clientId);
  const isValid = to.trim() && subject.trim() && body.trim();

  const handleSend = () => {
    if (!isValid) return;
    sendEmail(
      { data: { to, toName, subject, body, clientId: clientId || undefined, bcc: bccAddress } },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" className="max-w-2xl p-0">
      {/* Dark header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-semibold">New Email</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {/* To */}
        <div className="flex items-center gap-3 px-6 py-3.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-12 shrink-0">To</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            type="email"
            className="flex-1 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-transparent"
          />
          {/* Link client dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowClientDrop((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedClient ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {selectedClient ? selectedClient.name : "Link client"}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showClientDrop && (
              <div className="absolute right-0 top-9 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 border-b">
                  <p className="text-xs font-semibold text-slate-500 px-2 py-1">Link to client</p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {clientsData?.clients?.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setClientId(c.id); if (!to) setTo(c.email || ""); if (!toName) setToName(c.name); setShowClientDrop(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.email || "No email"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="flex items-center gap-3 px-6 py-3.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-12 shrink-0">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="flex-1 text-sm font-medium outline-none text-slate-900 placeholder:text-slate-400 bg-transparent"
          />
        </div>

        {/* BCC */}
        <div className="flex items-center gap-3 px-6 py-3">
          <button
            onClick={() => setShowBcc((v) => !v)}
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-12 shrink-0 hover:text-blue-600 transition-colors"
          >
            BCC
          </button>
          {showBcc && (
            <div className="flex items-center gap-2 flex-1">
              <code className="flex-1 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-emerald-700 font-mono truncate">
                {bccAddress}
              </code>
              <button onClick={copyBcc} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                {bccCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                <div className="absolute right-0 bottom-6 w-56 bg-slate-900 text-white text-xs p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Adding this BCC automatically logs the email under the correct client in the activity timeline.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            className="w-full min-h-[200px] resize-none text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent leading-relaxed"
            autoFocus
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="px-6 py-3 flex flex-wrap gap-2">
            {attachments.map((file, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-700">
                <Paperclip className="w-3 h-3 text-slate-400" />
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <label className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
              <Paperclip className="w-4 h-4" />
              <input type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) setAttachments((p) => [...p, ...Array.from(e.target.files)]); }} />
            </label>
            {selectedClient && (
              <Badge color="primary">Linked: {selectedClient.name}</Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{body.length} chars</span>
            <Button variant="ghost" onClick={onClose} size="sm">Discard</Button>
            <Button onClick={handleSend} disabled={!isValid || isSending} size="sm">
              {isSending ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              Send
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
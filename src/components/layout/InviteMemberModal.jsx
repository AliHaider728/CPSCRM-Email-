import React, { useState } from "react";
import { UserPlus, Mail, Shield, Users, Info, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Spinner } from "../ui/Spinner.jsx";

const ROLES = [
  { id: "account_manager", label: "Account Manager", desc: "Manages client relationships, sends and receives emails", icon: Users,  color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
  { id: "admin",           label: "Admin",           desc: "Full access including team management and settings",  icon: Shield, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { id: "viewer",          label: "Viewer",          desc: "Read-only access to client timelines and reports",    icon: Info,   color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200" },
];

export function InviteMemberModal({ isOpen, onClose, onSuccess }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]   = useState("account_manager");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); onSuccess?.(); }, 1000);
  };

  const handleClose = () => { setName(""); setEmail(""); setRole("account_manager"); setSuccess(false); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Team Member">
      {success ? (
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Invite sent!</h3>
          <p className="text-sm text-slate-500 mb-1">An invitation email has been sent to</p>
          <p className="text-sm font-semibold text-slate-900 mb-6">{email}</p>
          <Button onClick={handleClose} className="w-full">Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Work Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" className="pl-10" required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Role</label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                    role === r.id ? `${r.bg} ${r.border}` : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${role === r.id ? r.bg : "bg-slate-100"}`}>
                    <r.icon className={`w-4 h-4 ${role === r.id ? r.color : "text-slate-400"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${role === r.id ? "text-slate-900" : "text-slate-700"}`}>{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                  </div>
                  {role === r.id && <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${r.color}`} />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              After accepting, <strong>{name || "this member"}</strong> will need to connect their Outlook account to start syncing emails.
            </p>
          </div>

          <div className="pt-2 flex gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={!name || !email || loading} className="flex-1">
              {loading ? <Spinner className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              Send Invite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
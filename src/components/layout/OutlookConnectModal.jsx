import React, { useState } from "react";
import { Mail, Shield, CheckCircle2, ExternalLink, AlertCircle, ChevronRight, Lock, Eye, RefreshCw, X } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Spinner } from "../ui/Spinner.jsx";

const PERMS = [
  { icon: Mail,      label: "Read sent emails",  desc: "Sync outbound emails to client timelines", color: "text-blue-600",   bg: "bg-blue-50" },
  { icon: Eye,       label: "Read inbox",         desc: "Capture replies even without BCC",         color: "text-purple-600", bg: "bg-purple-50" },
  { icon: RefreshCw, label: "Offline access",     desc: "Background sync without re-authenticating",color: "text-emerald-600",bg: "bg-emerald-50" },
  { icon: Lock,      label: "No write access",    desc: "We never send emails on your behalf",      color: "text-slate-600",  bg: "bg-slate-50" },
];

export function OutlookConnectModal({ isOpen, onClose, memberId, memberName, isConnected = false }) {
  const [step, setStep] = useState("overview"); // overview | permissions | connecting | success | error

  const handleConnect = () => {
    setStep("connecting");
    setTimeout(() => setStep("success"), 2200);
  };

  const handleClose = () => { setStep("overview"); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" className="max-w-md p-0">
      {/* Overview */}
      {step === "overview" && (
        <div>
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white rounded-t-2xl">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">Connect Outlook</h2>
              <p className="text-blue-100 text-sm">Syncing for <strong className="text-white">{memberName}</strong></p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect your Microsoft Outlook account to automatically log all sent emails and capture replies in client activity timelines.
            </p>
            {isConnected && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Already connected</p>
                  <p className="text-xs text-emerald-700">You can reconnect to refresh your token</p>
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={handleClose} className="flex-1">Cancel</Button>
              <Button onClick={() => setStep("permissions")} className="flex-1">
                {isConnected ? "Reconnect" : "Get Started"} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions */}
      {step === "permissions" && (
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Permissions required</h2>
          </div>
          <p className="text-sm text-slate-500">We'll request these Microsoft Graph API scopes:</p>
          <div className="space-y-2">
            {PERMS.map((p) => (
              <div key={p.label} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className={`w-8 h-8 rounded-lg ${p.bg} flex items-center justify-center shrink-0`}>
                  <p.icon className={`w-4 h-4 ${p.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{p.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">You'll be redirected to Microsoft's login page. Your credentials are never stored by NexusCRM.</p>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" onClick={() => setStep("overview")} className="flex-1">Back</Button>
            <Button onClick={handleConnect} className="flex-1">
              <ExternalLink className="w-4 h-4" /> Connect with Microsoft
            </Button>
          </div>
        </div>
      )}

      {/* Connecting */}
      {step === "connecting" && (
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Spinner className="w-8 h-8" color="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Connecting to Microsoft...</h3>
          <p className="text-sm text-slate-500">Authenticating and requesting permissions.</p>
        </div>
      )}

      {/* Success */}
      {step === "success" && (
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Outlook connected!</h3>
          <p className="text-sm text-slate-500 mb-6">
            Emails for <strong>{memberName}</strong> will now sync automatically.
          </p>
          <Button onClick={handleClose} className="w-full">Done</Button>
        </div>
      )}

      {/* Error */}
      {step === "error" && (
        <div className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Connection failed</h3>
          <p className="text-sm text-slate-500 mb-6">Something went wrong. Please try again.</p>
          <div className="flex gap-3 w-full">
            <Button variant="ghost" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button onClick={() => setStep("permissions")} className="flex-1">Try again</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
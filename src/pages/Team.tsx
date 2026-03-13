import React, { useState } from "react";
import { motion } from "framer-motion";
import { useListTeamMembers, useTriggerOutlookSync } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Copy, RefreshCw, CheckCircle2, XCircle, Mail, Users as UsersIcon, Loader2 } from "lucide-react";
import { getInitials, formatSmartDate } from "@/lib/utils";

export default function Team() {
  const { data, isLoading } = useListTeamMembers();
  const members = data?.members || [];
  
  const { mutate: syncOutlook, isPending: isSyncing } = useTriggerOutlookSync();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyBcc = (id: string, bcc: string) => {
    navigator.clipboard.writeText(bcc);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSync = (memberId: string) => {
    syncOutlook({ data: { memberId } });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Team Coverage</h1>
          <p className="text-slate-500 mt-1">Manage team members, Outlook sync, and BCC settings.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">Invite Member</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-t-4 border-t-slate-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center text-xl font-display font-bold text-slate-700">
                        {member.avatarInitials || getInitials(member.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                        <p className="text-sm text-slate-500">{member.role || "Account Manager"} • {member.email}</p>
                      </div>
                    </div>
                    {member.outlookConnected ? (
                      <Badge variant="success" className="gap-1.5 py-1 px-3 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-slate-100 text-slate-600">
                        <XCircle className="w-3.5 h-3.5" /> Disconnected
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <UsersIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-display text-slate-900 leading-none">{member.clientCount || 0}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Clients</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-display text-slate-900 leading-none">{member.emailCount || 0}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Emails</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Unique BCC Address</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2.5 bg-slate-900 text-emerald-400 rounded-lg text-xs break-all selection:bg-emerald-500/30">
                          {member.bccAddress || `activity+${member.id}@ourcrm.com`}
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="shrink-0 h-10 w-10 border-slate-200 bg-white shadow-sm"
                          onClick={() => copyBcc(member.id, member.bccAddress || '')}
                        >
                          {copiedId === member.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        {member.lastSyncAt ? `Last sync: ${formatSmartDate(member.lastSyncAt)}` : "Never synced"}
                      </span>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleSync(member.id)}
                        disabled={isSyncing}
                        className="text-xs font-semibold bg-slate-100 hover:bg-slate-200"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> 
                        {member.outlookConnected ? "Force Sync" : "Connect Outlook"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { useListEmails } from "@/lib/api";
import { Card } from "@/components/ui/Card.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Search, Filter, Mail, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { formatSmartDate } from "@/lib/utils";

export default function Emails() {
  const { data, isLoading } = useListEmails();
  const emails = data?.emails || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Email Tracking</h1>
          <p className="text-slate-500 mt-1">View and track all synced Outlook communications.</p>
        </div>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search emails, subjects, or clients..." className="pl-10 shadow-sm" />
        </div>
        <Button variant="outline" className="bg-white">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : emails.length === 0 ? (
        <Card className="p-20 text-center flex flex-col items-center justify-center border-dashed">
          <Mail className="w-16 h-16 text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Inbox Empty</h3>
          <p className="text-slate-500 max-w-md">
            Connect your Outlook account or use your personal BCC address to start logging emails automatically.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {emails.map((email, i) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group overflow-hidden">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                  {/* Fixed: w-1.5 with explicit height */}
                  <div
                    className={`w-full sm:w-1.5 h-1.5 sm:h-full ${
                      email.direction === "outbound" ? "bg-blue-500" : "bg-emerald-500"
                    }`}
                  />
                  <div className="p-5 flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Fixed: w-[250px] instead of min-w-62.5 */}
                    <div className="flex items-center gap-4 w-full sm:w-62.5">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                        {email.direction === "outbound" ? (
                          <ArrowUpRight className="w-5 h-5 text-blue-600" />
                        ) : (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 truncate">
                          {email.direction === "outbound"
                            ? `To: ${email.toName || email.toEmail}`
                            : `From: ${email.fromName || email.fromEmail}`}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {formatSmartDate(email.sentAt || email.receivedAt || email.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 mb-1 truncate group-hover:text-primary transition-colors">
                        {email.subject}
                      </h4>
                      <p className="text-sm text-slate-500 truncate">{email.bodyPreview}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {email.clientName && (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                          {email.clientName}
                        </Badge>
                      )}
                      {email.openCount && email.openCount > 0 && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Opened
                        </Badge>
                      )}
                      {email.clickCount && email.clickCount > 0 && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Clicked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
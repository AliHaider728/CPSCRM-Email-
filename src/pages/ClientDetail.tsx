import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  useGetClient,
  useGetClientTimeline,
  useAddNote,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import {
  ArrowLeft, Building2, Mail, Phone, Calendar,
  ArrowUpRight, ArrowDownLeft, StickyNote,
  MousePointerClick, Send, Loader2,
} from "lucide-react";
import { formatSmartDate, getInitials } from "@/lib/utils";

export default function ClientDetail() {
  const params = useParams();
  const clientId = params.id || "";
  const [noteContent, setNoteContent] = useState("");

  const { data: client, isLoading: isClientLoading } = useGetClient(clientId);
  const { data: timelineData, isLoading: isTimelineLoading, refetch: refetchTimeline } =
    useGetClientTimeline(clientId, { type: "all" });

  const { mutate: addNote, isPending: isAddingNote } = useAddNote();

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote(
      { data: { clientId, content: noteContent } },
      {
        onSuccess: () => {
          setNoteContent("");
          refetchTimeline();
        },
      }
    );
  };

  if (isClientLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) return <div>Client not found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <Link href="/clients">
          <Button variant="ghost" className="mb-2 -ml-4 text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Fixed: bg-gradient-to-br instead of bg-linear-to-br */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white font-display font-bold text-2xl flex items-center justify-center shadow-lg">
              {getInitials(client.name)}
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">{client.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-slate-800 text-white">{client.pcnNumber}</Badge>
                {client.surgeryName && (
                  <span className="text-slate-500 font-medium">{client.surgeryName}</span>
                )}
              </div>
            </div>
          </div>
          <Button className="shadow-lg">
            <Mail className="w-4 h-4 mr-2" /> Email Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium">{client.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-medium">{client.phone || "No phone provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-medium">
                  Added {new Date(client.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Account Manager</CardTitle>
            </CardHeader>
            <CardContent>
              {client.accountManagerName ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                    {getInitials(client.accountManagerName)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{client.accountManagerName}</p>
                    <p className="text-xs text-slate-500">Primary Contact</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center border border-dashed">
                  No account manager assigned
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <StickyNote className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Log a note or internal update..."
                    // Fixed: min-h-[100px] instead of min-h-25
                    className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none outline-none"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!noteContent.trim() || isAddingNote}
                      className="rounded-lg shadow-md"
                    >
                      {isAddingNote ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><Send className="w-3.5 h-3.5 mr-2" /> Log Note</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pl-2">
            <h3 className="font-display font-bold text-xl text-slate-900 mb-6 flex items-center">
              Activity Timeline
              <Badge variant="secondary" className="ml-3 font-sans bg-slate-200 text-slate-700">
                {timelineData?.total || 0} Events
              </Badge>
            </h3>

            {isTimelineLoading ? (
              <div className="py-10 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : timelineData?.entries && timelineData.entries.length > 0 ? (
              <div className="relative border-l-2 border-slate-200 pl-8 space-y-8 pb-10">
                {timelineData.entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    {/* Timeline Dot - Fixed: -left-[43px] instead of -left-10.75 */}
                    <div
                      className="absolute -left-[43px] top-1 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor:
                          entry.type === "email_sent" ? "#eff6ff" :
                          entry.type === "email_received" ? "#ecfdf5" :
                          entry.type === "engagement" ? "#f5f3ff" : "#fefce8",
                        color:
                          entry.type === "email_sent" ? "#2563eb" :
                          entry.type === "email_received" ? "#059669" :
                          entry.type === "engagement" ? "#7c3aed" : "#d97706",
                      }}
                    >
                      {entry.type === "email_sent" && <ArrowUpRight className="w-4 h-4" />}
                      {entry.type === "email_received" && <ArrowDownLeft className="w-4 h-4" />}
                      {entry.type === "engagement" && <MousePointerClick className="w-4 h-4" />}
                      {entry.type === "note" && <StickyNote className="w-4 h-4" />}
                    </div>

                    <Card className="border-transparent shadow-md hover:border-border/80 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900">
                                {entry.type === "email_sent" ? "You sent an email" :
                                 entry.type === "email_received" ? `${entry.fromName || entry.fromEmail} replied` :
                                 entry.type === "engagement" ? "Client Engagement" :
                                 "Note Added"}
                              </span>
                              {entry.type === "email_sent" && entry.openCount && entry.openCount > 0 && (
                                <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200 ml-2">
                                  Opened
                                </Badge>
                              )}
                            </div>
                            {entry.subject && (
                              <p className="text-sm font-semibold text-slate-700">Subject: {entry.subject}</p>
                            )}
                          </div>
                          <span className="text-xs font-medium text-slate-400 whitespace-nowrap bg-slate-100 px-2.5 py-1 rounded-full">
                            {formatSmartDate(entry.occurredAt)}
                          </span>
                        </div>

                        <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                          {entry.content || entry.preview}
                        </div>

                        {(entry.type === "email_sent" || entry.type === "email_received") && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-400">Logged via Outlook Sync</span>
                            <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                              View Full Email
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No activity logged yet.</p>
                <p className="text-sm text-slate-400 mt-1">Send an email or add a note to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
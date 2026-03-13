import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Mail, MousePointerClick, Users, RefreshCw, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { useGetStatsOverview } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { formatRelative, getInitials } from "@/lib/utils";

export default function Dashboard() {
  const { data: stats, isLoading, isError } = useGetStatsOverview();

  const statCards = [
    { title: "Emails Sent", value: stats?.totalEmailsSent || 0, icon: ArrowUpRight, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Emails Received", value: stats?.totalEmailsReceived || 0, icon: ArrowDownLeft, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Avg. Open Rate", value: `${stats?.openRate || 0}%`, icon: Mail, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Avg. Click Rate", value: `${stats?.clickRate || 0}%`, icon: MousePointerClick, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="font-medium animate-pulse">Loading dashboard insights...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-3xl border border-red-100">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-900 mb-2">Could not load dashboard</h3>
        <p className="text-red-600 mb-6">Backend API might be unavailable. Ensure the server is running.</p>
        <Button onClick={() => window.location.reload()} variant="destructive">Retry Connection</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Welcome back, John!</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your client communications today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/clients">
            <Button variant="outline" className="shadow-sm bg-white">View Clients</Button>
          </Link>
          <Button className="shadow-lg shadow-primary/20"><Mail className="w-4 h-4 mr-2" /> Compose Email</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold font-display text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">Latest engagements across all accounts</p>
              </div>
              <Link href="/emails"><Button variant="ghost" size="sm" className="text-primary">View All</Button></Link>
            </CardHeader>
            <CardContent className="p-0">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="divide-y">
                  {stats.recentActivity.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.05) }}
                      className="p-6 flex gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="mt-1">
                        {activity.type === 'email_sent' && <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><ArrowUpRight className="w-4 h-4" /></div>}
                        {activity.type === 'email_received' && <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full"><ArrowDownLeft className="w-4 h-4" /></div>}
                        {activity.type === 'engagement' && <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><MousePointerClick className="w-4 h-4" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-slate-900 truncate">
                            {activity.type === 'email_sent' ? `To: ${activity.subject}` : activity.subject || 'Activity Update'}
                          </p>
                          <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{formatRelative(activity.occurredAt)}</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-1 mb-2">{activity.preview || activity.content}</p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">Client ID: {activity.clientId}</Badge>
                          {activity.openCount && activity.openCount > 0 && (
                            <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200 bg-purple-50">
                              Opened {activity.openCount}x
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p>No recent activity found. Sync Outlook to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-6">
          <Card className="bg-linear-to-br from-primary to-indigo-600 text-white border-none shadow-xl shadow-primary/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-display font-bold mb-2">Outlook Sync Active</h3>
              <p className="text-indigo-100 text-sm mb-6">Your inbox is currently syncing automatically. BCC tracking is active.</p>
              <div className="flex items-center justify-between bg-black/20 rounded-xl p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Users className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-indigo-600 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 uppercase tracking-wide font-semibold">Active Members</p>
                    <p className="font-bold text-lg">{stats?.teamMembersActive || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 bg-slate-50 border-slate-200 hover:border-primary/30 hover:bg-primary/5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">Add New Client</div>
                  <div className="text-xs text-slate-500">Create a PCN / Surgery</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 bg-slate-50 border-slate-200 hover:border-primary/30 hover:bg-primary/5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">Force Sync</div>
                  <div className="text-xs text-slate-500">Manually sync Outlook</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
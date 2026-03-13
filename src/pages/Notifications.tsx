import React from "react";
import { motion } from "framer-motion";
import { useListNotifications, useMarkNotificationRead } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Bell, MousePointerClick, MailOpen, Download, ArrowDownLeft, Check, Loader2 } from "lucide-react";
import { formatRelative } from "@/lib/utils";

export default function Notifications() {
  const { data, isLoading, refetch } = useListNotifications();
  const notifications = data?.notifications || [];
  const { mutate: markRead } = useMarkNotificationRead();

  const handleMarkRead = (id: string) => {
    markRead({ notificationId: id }, { onSuccess: () => refetch() });
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'email_opened': return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><MailOpen className="w-5 h-5" /></div>;
      case 'link_clicked': return <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><MousePointerClick className="w-5 h-5" /></div>;
      case 'file_downloaded': return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Download className="w-5 h-5" /></div>;
      case 'reply_received': return <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><ArrowDownLeft className="w-5 h-5" /></div>;
      default: return <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><Bell className="w-5 h-5" /></div>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">Real-time alerts for email engagements and replies.</p>
        </div>
        <Button variant="outline" className="bg-white">Mark All Read</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : notifications.length === 0 ? (
        <Card className="p-20 text-center border-dashed">
          <Bell className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">All Caught Up</h3>
          <p className="text-slate-500">You don't have any new notifications.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`overflow-hidden transition-all ${!notif.isRead ? 'bg-primary/5 border-primary/20 shadow-md' : 'bg-white shadow-sm hover:shadow-md'}`}>
                <div className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start sm:items-center">
                  <div className=" shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-base truncate ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-4 mt-1">{formatRelative(notif.createdAt)}</span>
                    </div>
                    <p className={`text-sm ${!notif.isRead ? 'text-slate-700' : 'text-slate-500'} mb-2`}>{notif.message}</p>
                    {notif.clientName && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                        {notif.clientName}
                      </span>
                    )}
                  </div>
                  {!notif.isRead && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMarkRead(notif.id)}
                      className=" shrink-0 text-primary hover:bg-primary/10 hover:text-primary rounded-full w-8 h-8"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Bell, X } from "lucide-react";
import { useListNotifications } from "../../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";

function useNotificationPolling({ intervalMs = 30000, onNew } = {}) {
  const queryClient = useQueryClient();
  const { data } = useListNotifications();
  const prevCount = useRef(null);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  useEffect(() => {
    const id = setInterval(refetch, intervalMs);
    const onVisible = () => { if (document.visibilityState === "visible") refetch(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVisible); };
  }, [intervalMs, refetch]);

  useEffect(() => {
    const list = data?.notifications ?? [];
    const count = list.filter((n) => !n.isRead).length;
    if (prevCount.current !== null && count > prevCount.current) {
      const latest = list.find((n) => !n.isRead);
      onNew?.(count - prevCount.current, latest?.title ?? "New notification");
    }
    prevCount.current = count;
  }, [data, onNew]);
}

export function NotificationToast() {
  const [toasts, setToasts] = useState([]);

  useNotificationPolling({
    intervalMs: 30000,
    onNew: (count, title) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((p) => [...p, { id, title, count }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 6000);
    },
  });

  const dismiss = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          style={{ animation: "slideUp 0.2s ease" }}
        >
          <div className="h-0.5 bg-blue-500" style={{ animation: "shrink 6s linear forwards" }} />
          <div className="flex items-start gap-3 p-4">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{toast.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{toast.count} new alert{toast.count > 1 ? "s" : ""}</p>
              <Link href="/notifications">
                <span className="text-xs font-semibold text-blue-600 mt-1 block hover:underline cursor-pointer">
                  View notifications →
                </span>
              </Link>
            </div>
            <button onClick={() => dismiss(toast.id)} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shrink  { from { width:100%; } to { width:0%; } }
      `}</style>
    </div>
  );
}
import React, { useState } from "react";
import { Link, useLocation } from "wouter";

// Icons as inline SVG components (no lucide-react needed, but if installed use it)
// We'll use lucide-react since it's JSX-compatible
import {
  LayoutDashboard, Users, Mail, UsersRound, Bell, Search, Menu, X,
} from "lucide-react";

import { useListNotifications } from "../../lib/api.js";
import { NotificationToast } from "./NotificationToast.jsx";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users,           label: "Clients",   href: "/clients" },
  { icon: Mail,            label: "Emails",    href: "/emails" },
  { icon: UsersRound,      label: "Team",      href: "/team" },
];

export function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const { data: notifData } = useListNotifications();
  const unreadCount = notifData?.notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col",
          "transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center mr-3">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Nexus<span className="text-blue-400 font-light">CRM</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-6 py-8 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Main Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const active =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer group",
                    active
                      ? "bg-blue-500/15 text-blue-400 font-medium"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 mr-3",
                      active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  {item.label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              JS
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">John Smith</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center flex-1 gap-4">
            <button
              className="p-2 text-slate-500 hover:text-slate-900 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients, emails, team..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-blue-500/50 rounded-xl text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/notifications">
              <div className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                )}
              </div>
            </Link>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-600">
              JS
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <NotificationToast />
    </div>
  );
}
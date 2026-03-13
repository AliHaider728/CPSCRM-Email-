import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Mail, UsersRound, Bell, 
  Search, Menu, X, Plus
} from "lucide-react";
import { useListNotifications } from "@/lib/api";

interface AppLayoutProps {
  children: React.ReactNode;
}


export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Clients", href: "/clients" },
    { icon: Mail, label: "Emails", href: "/emails" },
    { icon: UsersRound, label: "Team", href: "/team" },
  ];

  const { data: notifData } = useListNotifications({ unreadOnly: true, limit: 1 });
  const unreadCount = notifData?.unreadCount || 0;

  return (
    <div className="min-h-screen bg-background flex text-slate-900 font-sans">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-fg))] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-8 font-display text-2xl font-bold tracking-tight border-b border-white/10">
          <div className="w-8 h-8 rounded-xl bg-[hsl(var(--sidebar-accent))] flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <Mail className="w-5 h-5 text-white" />
          </div>
          Nexus<span className="text-blue-400 font-light">CRM</span>
        </div>

        <div className="px-6 py-8 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group cursor-pointer",
                    isActive 
                      ? "bg-blue-500/15 text-blue-400 font-medium" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}>
                    <item.icon className={cn("w-5 h-5 mr-3 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              JS
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">John Smith</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Abstract background subtle texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
        {/* Header */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0">
          <div className="flex items-center flex-1">
            <button 
              className="p-2 mr-4 text-slate-500 hover:text-slate-900 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-md w-full hidden sm:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search clients, emails, team..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border-2 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl text-sm transition-all duration-300 outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-200 rounded text-slate-500">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-200 rounded text-slate-500">K</kbd>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/notifications">
              <div className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive border-2 border-background rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                )}
              </div>
            </Link>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-600">
              JS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-8 z-0 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

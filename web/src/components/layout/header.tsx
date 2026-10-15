"use client";

import { Bell, Moon, Sun, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "Dashboard", subtitle: "Kern County Lead Intelligence" },
    "/leads": { title: "Lead Feed", subtitle: "Browse and filter all leads" },
    "/analytics": { title: "Analytics", subtitle: "Performance metrics and insights" },
    "/export": { title: "Export", subtitle: "Download leads as CSV" },
    "/settings": { title: "Settings", subtitle: "Configure your lead engine" },
  };

  const pageInfo = pageTitles[pathname] || { title: "Kern Lead Engine", subtitle: "Real Estate Lead Intelligence" };

  const notifications = [
    { id: 1, text: "New hot lead: Maria Garcia — Score 92", time: "2 min ago", hot: true },
    { id: 2, text: "3 new tax-delinquent leads imported", time: "15 min ago", hot: false },
    { id: 3, text: "Pre-foreclosure filed: 1234 Oak Ave", time: "1 hr ago", hot: true },
    { id: 4, text: "Daily scan completed — 47 new leads", time: "3 hrs ago", hot: false },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div>
        <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
        <p className="text-xs text-muted-foreground">{pageInfo.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card shadow-2xl">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 border-b border-border/50 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.hot ? "bg-red-500" : "bg-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-primary hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:inline">Admin</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
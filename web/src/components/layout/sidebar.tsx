"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Download,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/leads", icon: Users, label: "Lead Feed" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/export", icon: Download, label: "Export" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-card/80 backdrop-blur-xl border border-border md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-border bg-card/95 backdrop-blur-xl transition-transform duration-300 md:z-40 md:bg-card/80",
          // Mobile: slide in/out
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop: collapsed or expanded
          collapsed ? "md:w-[72px]" : "md:w-[260px]",
          "w-[280px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="text-lg font-bold gradient-text">Kern Leads</span>
            )}
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Collapse button on desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:block"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Search */}
        {(!collapsed || mobileOpen) && (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Search leads...</span>
              <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono hidden sm:inline">⌘K</kbd>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                {isActive && (!collapsed || mobileOpen) && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Live indicator */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="text-xs text-muted-foreground">
                <span className="text-emerald-400 font-medium">Live</span> — scanning
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
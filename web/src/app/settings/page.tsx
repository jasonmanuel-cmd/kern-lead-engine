"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Settings,
  Database,
  Key,
  Bell,
  Shield,
  Clock,
  Save,
  Check,
  Globe,
  Mail,
  Phone,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "data", label: "Data Sources", icon: Database },
    { id: "api", label: "API Keys", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] transition-all">
        <Header />
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Configure your lead engine</p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar tabs */}
            <div className="w-56 shrink-0 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">County</label>
                        <input
                          type="text"
                          defaultValue="Kern County, CA"
                          className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Timezone</label>
                        <select className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <option>America/Los_Angeles (PST)</option>
                          <option>America/New_York (EST)</option>
                          <option>America/Chicago (CST)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Min Score for Export</label>
                        <input
                          type="number"
                          defaultValue={40}
                          className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Scan Frequency</label>
                        <select className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <option>Daily at 6:00 AM</option>
                          <option>Twice daily</option>
                          <option>Weekly</option>
                          <option>Manual only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-4">Scoring Weights</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Pre-Foreclosure", value: 45 },
                        { label: "Tax Delinquent", value: 35 },
                        { label: "Probate", value: 30 },
                        { label: "Lien", value: 20 },
                        { label: "Fresh (≤30 days)", value: 15 },
                        { label: "Recent (≤90 days)", value: 8 },
                        { label: "Multiple Signals (bonus)", value: 10 },
                      ].map((w) => (
                        <div key={w.label} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{w.label}</span>
                          <input
                            type="number"
                            defaultValue={w.value}
                            className="h-8 w-20 rounded-lg border border-border bg-muted/50 px-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className="space-y-4">
                  {[
                    { name: "Kern County Recorder", status: "Connected", type: "Manual Export", lastSync: "Oct 15, 2026", records: 82 },
                    { name: "Treasurer-Tax Collector", status: "Connected", type: "PDF Download", lastSync: "Oct 13, 2026", records: 11281 },
                    { name: "Superior Court", status: "Not Connected", type: "Licensed Feed", lastSync: "—", records: 0 },
                    { name: "Assessor/GIS", status: "Connected", type: "ArcGIS Open Data", lastSync: "Oct 15, 2026", records: 424125 },
                  ].map((source) => (
                    <div key={source.name} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${source.status === "Connected" ? "bg-emerald-500" : "bg-red-500"}`} />
                          <div>
                            <p className="text-sm font-medium">{source.name}</p>
                            <p className="text-xs text-muted-foreground">{source.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{source.records.toLocaleString()} records</p>
                          <p className="text-xs text-muted-foreground">Last sync: {source.lastSync}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "api" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-4">API Keys</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Skip Trace API Key", placeholder: "sk-...", icon: Key },
                        { label: "BatchData API Key", placeholder: "bd-...", icon: Key },
                        { label: "PrimeTracers API Key", placeholder: "pt-...", icon: Key },
                      ].map((key) => (
                        <div key={key.label}>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{key.label}</label>
                          <input
                            type="password"
                            placeholder={key.placeholder}
                            className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      {[
                        { label: "New hot lead (80+ score)", enabled: true },
                        { label: "Daily scan completed", enabled: true },
                        { label: "New pre-foreclosure filed", enabled: true },
                        { label: "Tax delinquent list updated", enabled: false },
                        { label: "Skip trace completed", enabled: true },
                        { label: "Weekly summary report", enabled: false },
                      ].map((notif) => (
                        <div key={notif.label} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{notif.label}</span>
                          <button
                            className={`relative h-6 w-11 rounded-full transition-colors ${notif.enabled ? "bg-primary" : "bg-muted"}`}
                          >
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${notif.enabled ? "left-5.5 translate-x-0.5" : "left-0.5"}`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                        <div>
                          <p className="text-sm font-medium">Two-Factor Authentication</p>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                          Enable
                        </button>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                        <div>
                          <p className="text-sm font-medium">Session Timeout</p>
                          <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                        </div>
                        <select className="h-8 rounded-lg border border-border bg-card px-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                          <option>Never</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                        <div>
                          <p className="text-sm font-medium">IP Whitelist</p>
                          <p className="text-xs text-muted-foreground">Restrict access to specific IPs</p>
                        </div>
                        <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
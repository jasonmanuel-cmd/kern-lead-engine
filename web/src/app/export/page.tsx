"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { generateLeads, type Lead } from "@/lib/mock-data";
import {
  Download,
  FileText,
  Filter,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Zap,
  Target,
  ChevronDown,
} from "lucide-react";

export default function ExportPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [minScore, setMinScore] = useState(40);
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("30");
  const [format, setFormat] = useState("csv");
  const [exported, setExported] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLeads(generateLeads(80));
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (lead.score < minScore) return false;
    if (selectedSignals.length > 0 && !lead.events.some((e) => selectedSignals.includes(e.type))) return false;
    return true;
  });

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSignal = (sig: string) => {
    setSelectedSignals((prev) =>
      prev.includes(sig) ? prev.filter((s) => s !== sig) : [...prev, sig]
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] transition-all">
        <Header />
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Export Leads</h1>
            <p className="text-sm text-muted-foreground mt-1">Download your leads as CSV or copy to clipboard</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Config Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4"
            >
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold mb-4">Export Configuration</h3>

                {/* Min Score */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Minimum Score</label>
                  <div className="flex gap-2">
                    {[0, 40, 60, 80].map((s) => (
                      <button
                        key={s}
                        onClick={() => setMinScore(s)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                          minScore === s
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s === 0 ? "All" : `${s}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Signal Filter */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Signal Types</label>
                  <div className="space-y-2">
                    {[
                      { key: "pre_foreclosure", label: "Pre-Foreclosure", color: "text-red-400" },
                      { key: "tax_delinquent", label: "Tax Delinquent", color: "text-amber-400" },
                      { key: "probate", label: "Probate", color: "text-purple-400" },
                      { key: "lien", label: "Lien", color: "text-blue-400" },
                    ].map((sig) => (
                      <label key={sig.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSignals.includes(sig.key)}
                          onChange={() => toggleSignal(sig.key)}
                          className="h-4 w-4 rounded border-border bg-muted accent-primary"
                        />
                        <span className={`text-sm ${sig.color}`}>{sig.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Date Range</label>
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                      <option value="all">All time</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Format */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Format</label>
                  <div className="flex gap-2">
                    {["csv", "json"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium uppercase transition-colors ${
                          format === f
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {exported ? (
                    <>
                      <Check className="h-4 w-4" />
                      Exported!
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export {filteredLeads.length} Leads
                    </>
                  )}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold mb-3">Export Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total matching</span>
                    <span className="font-medium">{filteredLeads.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">With phone</span>
                    <span className="font-medium">{filteredLeads.filter((l) => l.phone).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">With email</span>
                    <span className="font-medium">{filteredLeads.filter((l) => l.email).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hot (80+)</span>
                    <span className="font-medium text-emerald-400">{filteredLeads.filter((l) => l.score >= 80).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Score</span>
                    <span className="font-medium">
                      {filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((a, b) => a + b.score, 0) / filteredLeads.length) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Preview Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Preview ({filteredLeads.length} leads)</h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Owner</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Property</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">City</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">APN</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Score</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Signals</th>
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.slice(0, 20).map((lead) => (
                        <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-3 font-medium text-foreground">{lead.ownerName}</td>
                          <td className="py-2 px-3 text-muted-foreground">{lead.propertyAddress}</td>
                          <td className="py-2 px-3 text-muted-foreground">{lead.city}</td>
                          <td className="py-2 px-3 font-mono text-muted-foreground">{lead.apn}</td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${lead.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : lead.score >= 60 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                              {lead.score}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex gap-1">
                              {[...new Set(lead.events.map((e) => e.type))].map((sig) => (
                                <span key={sig} className="text-[10px] text-muted-foreground">
                                  {sig === "pre_foreclosure" ? "PF" : sig === "tax_delinquent" ? "TD" : sig === "probate" ? "PB" : "LN"}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-muted-foreground">{lead.phone || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLeads.length > 20 && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Showing 20 of {filteredLeads.length} leads. Export to see all.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
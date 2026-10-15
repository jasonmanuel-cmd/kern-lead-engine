"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LeadCard } from "@/components/ui/lead-card";
import { ScoreBadge } from "@/components/ui/score-badge";
import { generateLeads, SIGNAL_LABELS, SIGNAL_COLORS } from "@/lib/mock-data";
import type { Lead } from "@/lib/mock-data";
import {
  Search,
  Filter,
  Download,
  SlidersHorizontal,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  X,
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("score");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLeads(generateLeads(60));
  }, []);

  const toggleSignal = (sig: string) => {
    setSelectedSignals((prev) =>
      prev.includes(sig) ? prev.filter((s) => s !== sig) : [...prev, sig]
    );
  };

  const filteredLeads = leads
    .filter((lead) => {
      if (minScore > 0 && lead.score < minScore) return false;
      if (selectedSignals.length > 0 && !lead.events.some((e) => selectedSignals.includes(e.type))) return false;
      if (search && !lead.ownerName.toLowerCase().includes(search.toLowerCase()) && !lead.propertyAddress.toLowerCase().includes(search.toLowerCase()) && !lead.city.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "city") return a.city.localeCompare(b.city);
      return 0;
    });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] transition-all">
        <Header />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Lead Feed</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredLeads.length} leads · Sorted by {sortBy}
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by owner, address, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(selectedSignals.length > 0 || minScore > 0) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {selectedSignals.length + (minScore > 0 ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="score">Sort by Score</option>
                <option value="date">Sort by Date</option>
                <option value="city">Sort by City</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Signal Type</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(SIGNAL_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => toggleSignal(key)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedSignals.includes(key)
                            ? SIGNAL_COLORS[key]
                            : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Min Score</p>
                  <div className="flex gap-2">
                    {[0, 40, 60, 80].map((s) => (
                      <button
                        key={s}
                        onClick={() => setMinScore(s)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
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
                {(selectedSignals.length > 0 || minScore > 0 || search) && (
                  <button
                    onClick={() => {
                      setSelectedSignals([]);
                      setMinScore(0);
                      setSearch("");
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-auto"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Lead list */}
          <div className="space-y-3">
            {filteredLeads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
            {filteredLeads.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16">
                <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No leads match your filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
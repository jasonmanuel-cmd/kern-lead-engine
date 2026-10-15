"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { LeadCard } from "@/components/ui/lead-card";
import { ScoreBadge } from "@/components/ui/score-badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { generateLeads, type Lead } from "@/lib/mock-data";
import {
  Users,
  TrendingUp,
  Target,
  Zap,
  RefreshCw,
  Filter,
  Download,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const leadsOverTime = [
  { date: "Oct 1", leads: 12, hot: 3 },
  { date: "Oct 2", leads: 18, hot: 5 },
  { date: "Oct 3", leads: 25, hot: 7 },
  { date: "Oct 4", leads: 22, hot: 6 },
  { date: "Oct 5", leads: 30, hot: 9 },
  { date: "Oct 6", leads: 28, hot: 8 },
  { date: "Oct 7", leads: 35, hot: 11 },
  { date: "Oct 8", leads: 42, hot: 14 },
  { date: "Oct 9", leads: 38, hot: 12 },
  { date: "Oct 10", leads: 45, hot: 15 },
  { date: "Oct 11", leads: 52, hot: 18 },
  { date: "Oct 12", leads: 48, hot: 16 },
  { date: "Oct 13", leads: 55, hot: 20 },
  { date: "Oct 14", leads: 61, hot: 22 },
  { date: "Oct 15", leads: 58, hot: 19 },
];

const scoreDistribution = [
  { range: "90-100", count: 24, fill: "#10b981" },
  { range: "80-89", count: 41, fill: "#34d399" },
  { range: "70-79", count: 58, fill: "#fbbf24" },
  { range: "60-69", count: 72, fill: "#f59e0b" },
  { range: "50-59", count: 89, fill: "#fb923c" },
  { range: "40-49", count: 63, fill: "#f97316" },
  { range: "<40", count: 31, fill: "#ef4444" },
];

const signalBreakdown = [
  { name: "Pre-Foreclosure", value: 156, color: "#ef4444" },
  { name: "Tax Delinquent", value: 234, color: "#f59e0b" },
  { name: "Probate", value: 89, color: "#a855f7" },
  { name: "Lien", value: 67, color: "#3b82f6" },
];

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [newLeadIds, setNewLeadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLeads(generateLeads(50));
  }, []);

  const simulateScan = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => {
      const newLeads = generateLeads(3);
      const newIds = new Set(newLeads.map((l) => l.id));
      setNewLeadIds(newIds);
      setLeads((prev) => [...newLeads, ...prev].slice(0, 80));
      setIsScanning(false);
      setTimeout(() => setNewLeadIds(new Set()), 5000);
    }, 2000);
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (minScore > 0 && lead.score < minScore) return false;
    if (filter !== "all" && !lead.events.some((e) => e.type === filter)) return false;
    if (search && !lead.ownerName.toLowerCase().includes(search.toLowerCase()) && !lead.propertyAddress.toLowerCase().includes(search.toLowerCase()) && !lead.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const hotLeads = leads.filter((l) => l.score >= 80).length;
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((a, b) => a + b.score, 0) / leads.length) : 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-[260px] transition-all">
        <Header />
        <main className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={leads.length}
              change={12.5}
              icon={<Users className="h-5 w-5" />}
              gradient="from-violet-500 to-purple-600"
              delay={0}
            />
            <StatCard
              title="Hot Leads (80+)"
              value={hotLeads}
              change={8.3}
              icon={<Zap className="h-5 w-5" />}
              gradient="from-emerald-500 to-green-600"
              delay={0.1}
            />
            <StatCard
              title="Avg Score"
              value={avgScore}
              change={3.2}
              icon={<TrendingUp className="h-5 w-5" />}
              gradient="from-amber-500 to-orange-600"
              delay={0.2}
            />
            <StatCard
              title="New Today"
              value={12}
              change={25.0}
              icon={<Target className="h-5 w-5" />}
              gradient="from-cyan-500 to-blue-600"
              delay={0.3}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Leads Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-2 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold">Leads Over Time</h3>
                  <p className="text-xs text-muted-foreground">Daily lead volume — last 15 days</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                    <span className="text-muted-foreground">Total</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Hot (80+)</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={leadsOverTime}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorHot" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#8b5cf6" fill="url(#colorLeads)" strokeWidth={2} />
                  <Area type="monotone" dataKey="hot" stroke="#10b981" fill="url(#colorHot)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Signal Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-sm font-semibold mb-1">Signal Breakdown</h3>
              <p className="text-xs text-muted-foreground mb-4">Lead sources by type</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={signalBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {signalBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {signalBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Score Distribution</h3>
                <p className="text-xs text-muted-foreground">Lead quality breakdown</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoreDistribution} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="range" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(139, 92, 246, 0.05)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lead Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Live Lead Feed</h2>
                <p className="text-xs text-muted-foreground">
                  {filteredLeads.length} leads · Updated just now
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 w-full sm:w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-9 appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">All Signals</option>
                    <option value="pre_foreclosure">Pre-Foreclosure</option>
                    <option value="tax_delinquent">Tax Delinquent</option>
                    <option value="probate">Probate</option>
                    <option value="lien">Lien</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Min Score */}
                <div className="relative">
                  <select
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="h-9 appearance-none rounded-lg border border-border bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value={0}>All Scores</option>
                    <option value={40}>40+</option>
                    <option value={60}>60+</option>
                    <option value={80}>80+</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Scan button */}
                <button
                  onClick={simulateScan}
                  disabled={isScanning}
                  className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
                  {isScanning ? "Scanning..." : "Run Scan"}
                </button>

                {/* Export */}
                <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-muted transition-colors">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Lead list */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredLeads.map((lead, index) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    index={index}
                    isNew={newLeadIds.has(lead.id)}
                  />
                ))}
              </AnimatePresence>

              {filteredLeads.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16">
                  <Search className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No leads match your filters</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
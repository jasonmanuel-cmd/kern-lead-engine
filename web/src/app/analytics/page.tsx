"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
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
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Zap,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const leadsOverTime = [
  { date: "Oct 1", leads: 12, hot: 3, converted: 1 },
  { date: "Oct 2", leads: 18, hot: 5, converted: 2 },
  { date: "Oct 3", leads: 25, hot: 7, converted: 2 },
  { date: "Oct 4", leads: 22, hot: 6, converted: 3 },
  { date: "Oct 5", leads: 30, hot: 9, converted: 4 },
  { date: "Oct 6", leads: 28, hot: 8, converted: 3 },
  { date: "Oct 7", leads: 35, hot: 11, converted: 5 },
  { date: "Oct 8", leads: 42, hot: 14, converted: 6 },
  { date: "Oct 9", leads: 38, hot: 12, converted: 5 },
  { date: "Oct 10", leads: 45, hot: 15, converted: 7 },
  { date: "Oct 11", leads: 52, hot: 18, converted: 8 },
  { date: "Oct 12", leads: 48, hot: 16, converted: 6 },
  { date: "Oct 13", leads: 55, hot: 20, converted: 9 },
  { date: "Oct 14", leads: 61, hot: 22, converted: 10 },
  { date: "Oct 15", leads: 58, hot: 19, converted: 8 },
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

const cityBreakdown = [
  { city: "Bakersfield", leads: 187, hot: 62 },
  { city: "Delano", leads: 45, hot: 12 },
  { city: "Ridgecrest", leads: 23, hot: 8 },
  { city: "Tehachapi", leads: 18, hot: 5 },
  { city: "Shafter", leads: 31, hot: 9 },
  { city: "Wasco", leads: 22, hot: 7 },
  { city: "Taft", leads: 15, hot: 4 },
  { city: "Arvin", leads: 12, hot: 3 },
];

const conversionFunnel = [
  { stage: "Total Leads", value: 378, fill: "#8b5cf6" },
  { stage: "Qualified (40+)", value: 289, fill: "#a78bfa" },
  { stage: "Hot (80+)", value: 94, fill: "#c4b5fd" },
  { stage: "Contacted", value: 67, fill: "#ddd6fe" },
  { stage: "Converted", value: 23, fill: "#ede9fe" },
];

const tooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] transition-all">
        <Header />
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Performance metrics and insights</p>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Leads", value: "378", change: "+12.5%", up: true, icon: Users, color: "from-violet-500 to-purple-600" },
              { label: "Conversion Rate", value: "6.1%", change: "+2.3%", up: true, icon: Target, color: "from-emerald-500 to-green-600" },
              { label: "Avg. Score", value: "62.4", change: "+3.2", up: true, icon: TrendingUp, color: "from-amber-500 to-orange-600" },
              { label: "Revenue Pipeline", value: "$48.2K", change: "+18.7%", up: true, icon: DollarSign, color: "from-cyan-500 to-blue-600" },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${kpi.color} text-white`}>
                    <kpi.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold">{kpi.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  {kpi.up ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Leads & Conversions Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-sm font-semibold mb-1">Leads & Conversions</h3>
              <p className="text-xs text-muted-foreground mb-4">Daily volume over 15 days</p>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={leadsOverTime}>
                  <defs>
                    <linearGradient id="colorLeads2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="leads" stroke="#8b5cf6" fill="url(#colorLeads2)" strokeWidth={2} name="Total Leads" />
                  <Area type="monotone" dataKey="converted" stroke="#10b981" fill="url(#colorConv)" strokeWidth={2} name="Converted" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Conversion Funnel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-sm font-semibold mb-1">Conversion Funnel</h3>
              <p className="text-xs text-muted-foreground mb-4">Lead pipeline stages</p>
              <div className="space-y-3">
                {conversionFunnel.map((stage, i) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{stage.stage}</span>
                      <span className="font-medium text-foreground">{stage.value}</span>
                    </div>
                    <div className="h-8 rounded-lg bg-muted/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stage.value / conversionFunnel[0].value) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-lg flex items-center px-3"
                        style={{ backgroundColor: stage.fill }}
                      >
                        <span className="text-xs font-medium text-white/90">
                          {Math.round((stage.value / conversionFunnel[0].value) * 100)}%
                        </span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Score Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-sm font-semibold mb-1">Score Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">Lead quality breakdown</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={scoreDistribution} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="range" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(139, 92, 246, 0.05)" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* City Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-sm font-semibold mb-1">Leads by City</h3>
              <p className="text-xs text-muted-foreground mb-4">Geographic distribution</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cityBreakdown} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="city" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} width={90} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(139, 92, 246, 0.05)" }} />
                  <Bar dataKey="leads" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Total" />
                  <Bar dataKey="hot" fill="#10b981" radius={[0, 6, 6, 0]} name="Hot (80+)" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Signal Breakdown Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h3 className="text-sm font-semibold mb-1">Signal Breakdown</h3>
            <p className="text-xs text-muted-foreground mb-4">Lead sources by distress type</p>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={260} className="lg:w-1/2">
                <PieChart>
                  <Pie
                    data={signalBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {signalBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 lg:w-1/2">
                {signalBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">{item.value}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({((item.value / signalBreakdown.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
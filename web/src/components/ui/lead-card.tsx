"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "./score-badge";
import { SIGNAL_COLORS, SIGNAL_LABELS } from "@/lib/mock-data";
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  DollarSign,
  Calendar,
  ChevronRight,
  Zap,
  TrendingUp,
} from "lucide-react";
import type { Lead } from "@/lib/mock-data";

interface LeadCardProps {
  lead: Lead;
  index: number;
  isNew?: boolean;
}

export function LeadCard({ lead, index, isNew = false }: LeadCardProps) {
  const signalTypes = [...new Set(lead.events.map((e) => e.type))];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        isNew && "ring-2 ring-emerald-500/50 shadow-emerald-500/10"
      )}
    >
      {/* New lead pulse */}
      {isNew && (
        <div className="absolute right-3 top-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
        </div>
      )}

      {/* Top row: owner + score */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {lead.ownerName}
            </h3>
            {lead.score >= 90 && (
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {lead.propertyAddress}, {lead.city}, {lead.state} {lead.zip}
            </span>
          </div>
        </div>
        <ScoreBadge score={lead.score} />
      </div>

      {/* Signal badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {signalTypes.map((sig) => (
          <span
            key={sig}
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
              SIGNAL_COLORS[sig]
            )}
          >
            {SIGNAL_LABELS[sig]}
          </span>
        ))}
        {lead.events.length > 1 && (
          <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {lead.events.length} signals
          </span>
        )}
      </div>

      {/* Details grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {lead.apn && (
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">APN</p>
            <p className="mt-0.5 text-xs font-mono font-medium text-foreground">{lead.apn}</p>
          </div>
        )}
        {lead.assessedValue && (
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Assessed</p>
            <p className="mt-0.5 text-xs font-medium text-foreground">
              ${lead.assessedValue.toLocaleString()}
            </p>
          </div>
        )}
        {lead.sqft && (
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sq Ft</p>
            <p className="mt-0.5 text-xs font-medium text-foreground">{lead.sqft.toLocaleString()}</p>
          </div>
        )}
        {lead.acres && (
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Acres</p>
            <p className="mt-0.5 text-xs font-medium text-foreground">{lead.acres}</p>
          </div>
        )}
      </div>

      {/* Contact info */}
      {(lead.phone || lead.email) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {lead.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {lead.phone}
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {lead.email}
            </div>
          )}
        </div>
      )}

      {/* Reasons */}
      <div className="mt-3 space-y-1">
        {lead.reasons.map((reason, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-primary" />
            {reason}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {lead.events.map((e) => e.date).sort().reverse()[0]}
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View Details
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
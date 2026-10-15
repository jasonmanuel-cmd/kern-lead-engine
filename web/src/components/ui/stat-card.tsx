"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const duration = 1200;
    const start = ref.current;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = value;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatCard({
  title,
  value,
  suffix,
  prefix,
  change,
  changeLabel,
  icon,
  gradient,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Background gradient */}
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            {icon}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight">
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </p>
        </div>

        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            {change > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            ) : change < 0 ? (
              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                change > 0 ? "text-emerald-400" : change < 0 ? "text-red-400" : "text-muted-foreground"
              )}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel || "vs last week"}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
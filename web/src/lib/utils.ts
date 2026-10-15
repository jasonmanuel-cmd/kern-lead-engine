import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "from-emerald-500 to-green-400";
  if (score >= 60) return "from-amber-500 to-yellow-400";
  if (score >= 40) return "from-orange-500 to-amber-400";
  return "from-red-500 to-orange-400";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  if (score >= 40) return "Cool";
  return "Cold";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (score >= 40) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}
"use client";

import { cn } from "@/lib/utils";
import { getScoreBg, getScoreLabel } from "@/lib/utils";

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        getScoreBg(score),
        sizeClasses[size]
      )}
    >
      <span className="font-bold">{score}</span>
      <span className="opacity-70">{getScoreLabel(score)}</span>
    </div>
  );
}
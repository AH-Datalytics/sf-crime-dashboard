"use client";
import { useCfsData } from "@/lib/hooks/use-cfs";
import { computeYTDComparison, computeAvgResponseTime, aggregateByPriority } from "@/lib/measures/cfs-measures";
import { formatMinutes } from "@/lib/chart-utils";

export function CfsKPIRow() {
  const { filtered, isLoading } = useCfsData();

  if (isLoading || filtered.length === 0) {
    return (
      <div className="bg-[#01396C] rounded-lg p-6 text-white/40 text-center text-sm font-mono">Loading…</div>
    );
  }

  const { ytdCurrent, ytdPrior, pctChange } = computeYTDComparison(filtered);
  const avgResponse = computeAvgResponseTime(filtered);
  const byPriority = aggregateByPriority(filtered);
  const priorityA = byPriority.find((p) => p.priority === "A");

  const isNeutral = Math.abs(pctChange) < 2;
  const isIncrease = pctChange >= 2;

  return (
    <div className="bg-[#01396C] rounded-lg text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Calls YTD</p>
          <p className="text-3xl font-serif font-bold tabular-nums mt-1">{ytdCurrent.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-0.5">vs {ytdPrior.toLocaleString()} prior year</p>
          <p className={`text-xs font-medium mt-0.5 ${isNeutral ? "text-white/50" : isIncrease ? "text-red-300" : "text-blue-300"}`}>
            {isNeutral ? "—" : isIncrease ? "▲" : "▼"} {Math.abs(pctChange).toFixed(1)}%
          </p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Avg Response Time</p>
          <p className="text-3xl font-serif font-bold mt-1">{avgResponse > 0 ? formatMinutes(avgResponse) : "—"}</p>
          <p className="text-xs text-white/40 mt-0.5">received → on-scene</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Priority A Calls</p>
          <p className="text-3xl font-serif font-bold tabular-nums mt-1">{priorityA?.count.toLocaleString() ?? "—"}</p>
          <p className="text-xs text-white/40 mt-0.5">life-threatening</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Priority A Avg Response</p>
          <p className="text-3xl font-serif font-bold mt-1">
            {priorityA && priorityA.avgMinutes > 0 ? formatMinutes(priorityA.avgMinutes) : "—"}
          </p>
          <p className="text-xs text-white/40 mt-0.5">highest priority</p>
        </div>
      </div>
    </div>
  );
}

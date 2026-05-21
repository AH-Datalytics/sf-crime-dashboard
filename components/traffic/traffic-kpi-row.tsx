"use client";
import { useTrafficData } from "@/lib/hooks/use-traffic";
import { computeYTDComparison, aggregateBySeverity } from "@/lib/measures/traffic-measures";

export function TrafficKPIRow() {
  const { filtered, isLoading } = useTrafficData();

  if (isLoading || filtered.length === 0) {
    return <div className="bg-[#01396C] rounded-lg p-6 text-white/40 text-center text-sm font-mono">Loading…</div>;
  }

  const { ytdCurrent, ytdPrior, pctChange } = computeYTDComparison(filtered);
  const bySeverity = aggregateBySeverity(filtered);
  const fatal = bySeverity.find((s) => s.severity === "Fatal")?.count ?? 0;
  const severe = bySeverity.find((s) => s.severity === "Injury (Severe)")?.count ?? 0;

  const isNeutral = Math.abs(pctChange) < 2;
  const isIncrease = pctChange >= 2;

  return (
    <div className="bg-[#01396C] rounded-lg text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Total Collisions YTD</p>
          <p className="text-3xl font-serif font-bold tabular-nums mt-1">{ytdCurrent.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-0.5">vs {ytdPrior.toLocaleString()} prior year</p>
          <p className={`text-xs font-medium mt-0.5 ${isNeutral ? "text-white/50" : isIncrease ? "text-red-300" : "text-blue-300"}`}>
            {isNeutral ? "—" : isIncrease ? "▲" : "▼"} {Math.abs(pctChange).toFixed(1)}%
          </p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Fatal YTD</p>
          <p className="text-3xl font-serif font-bold tabular-nums mt-1">{fatal.toLocaleString()}</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Severe Injury YTD</p>
          <p className="text-3xl font-serif font-bold tabular-nums mt-1">{severe.toLocaleString()}</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Severity Breakdown</p>
          <div className="mt-1 space-y-0.5">
            {bySeverity.slice(0, 3).map((s) => (
              <p key={s.severity} className="text-xs text-white/70 tabular-nums">
                {s.severity.replace("Injury (", "").replace(")", "")}: <span className="text-white font-mono">{s.count.toLocaleString()}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

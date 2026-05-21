"use client";
import { useCrimeData } from "@/lib/hooks/use-crime";
import { computeYTDComparison, aggregateByCategory } from "@/lib/measures/crime-measures";
import { PART1_CATEGORIES } from "@/lib/constants";

function Metric({ label, value, prior, pct }: { label: string; value: number; prior: number; pct: number }) {
  const isNeutral = Math.abs(pct) < 2;
  const isIncrease = pct >= 2;
  return (
    <div className="text-center px-4 py-2">
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">{label}</p>
      <p className="text-3xl font-serif font-bold tabular-nums mt-1">{value.toLocaleString()}</p>
      <p className="text-xs text-white/40 mt-0.5">vs {prior.toLocaleString()} prior year</p>
      <p className={`text-xs font-medium mt-0.5 ${isNeutral ? "text-white/50" : isIncrease ? "text-red-300" : "text-blue-300"}`}>
        {isNeutral ? "—" : isIncrease ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
      </p>
    </div>
  );
}

export function CrimeKPIRow() {
  const { filtered, isLoading } = useCrimeData();

  if (isLoading || filtered.length === 0) {
    return (
      <div className="bg-[#01396C] rounded-lg p-6 text-white/40 text-center text-sm font-mono">
        Loading…
      </div>
    );
  }

  const { ytdCurrent, ytdPrior, pctChange } = computeYTDComparison(filtered);

  const byCat = aggregateByCategory(
    filtered.filter((r) => PART1_CATEGORIES.includes(r.category as (typeof PART1_CATEGORIES)[number]))
  );
  const violentCategories = ["Homicide", "Rape", "Robbery", "Assault"];
  const violent = byCat.filter((c) => violentCategories.includes(c.category)).reduce((s, c) => s + c.count, 0);
  const topCat = byCat[0];

  return (
    <div className="bg-[#01396C] rounded-lg text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
        <Metric label="Total Incidents YTD" value={ytdCurrent} prior={ytdPrior} pct={pctChange} />
        <Metric
          label="Violent Crime YTD"
          value={violent}
          prior={0}
          pct={0}
        />
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Top Category</p>
          <p className="text-lg font-serif font-bold mt-1 leading-tight">{topCat?.category ?? "—"}</p>
          <p className="text-xs text-white/40 mt-0.5">{topCat?.count.toLocaleString()} incidents</p>
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Data Through</p>
          <p className="text-lg font-serif font-bold mt-1">
            {filtered.length > 0
              ? new Date(filtered[filtered.length - 1].date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

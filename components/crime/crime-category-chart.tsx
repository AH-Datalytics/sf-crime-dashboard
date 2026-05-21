"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCrimeData } from "@/lib/hooks/use-crime";
import { aggregateByCategory } from "@/lib/measures/crime-measures";
import { PART1_CATEGORIES, COLORS } from "@/lib/constants";

export function CrimeCategoryChart() {
  const { filtered, isLoading } = useCrimeData();

  const data = useMemo(() => {
    const all = aggregateByCategory(filtered);
    return all
      .filter((c) => PART1_CATEGORIES.includes(c.category as (typeof PART1_CATEGORIES)[number]))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  if (isLoading) return <div className="h-64 flex items-center justify-center text-sm text-muted-foreground font-mono">Loading…</div>;

  return (
    <div className="border border-[#e8e8e8] rounded-lg bg-white p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Part I Crimes by Category</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="none" stroke="#e8e8e8" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 11, fill: "#444" }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            formatter={(v) => [(v ?? 0).toLocaleString(), "Incidents"]}
            contentStyle={{ fontSize: 12, border: "1px solid #d4d4d4", boxShadow: "none" }}
          />
          <Bar dataKey="count" fill={COLORS.primary} radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

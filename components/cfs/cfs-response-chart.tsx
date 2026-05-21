"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCfsData } from "@/lib/hooks/use-cfs";
import { aggregateByPriority } from "@/lib/measures/cfs-measures";
import { COLORS } from "@/lib/constants";

export function CfsResponseChart() {
  const { filtered, isLoading } = useCfsData();

  const data = useMemo(
    () =>
      aggregateByPriority(filtered)
        .filter((p) => p.avgMinutes > 0)
        .map((p) => ({ priority: `Priority ${p.priority}`, avgMinutes: Math.round(p.avgMinutes), count: p.count })),
    [filtered]
  );

  if (isLoading) return <div className="h-64 flex items-center justify-center text-sm text-muted-foreground font-mono">Loading…</div>;

  return (
    <div className="border border-[#e8e8e8] rounded-lg bg-white p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Avg Response Time by Priority (minutes)</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="none" stroke="#e8e8e8" vertical={false} />
          <XAxis dataKey="priority" tick={{ fontSize: 11, fill: "#555" }} axisLine={{ stroke: "#d4d4d4" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip formatter={(v) => [`${v ?? 0} min`, "Avg Response"]} contentStyle={{ fontSize: 12, border: "1px solid #d4d4d4", boxShadow: "none" }} />
          <Bar dataKey="avgMinutes" fill={COLORS.primaryLight} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

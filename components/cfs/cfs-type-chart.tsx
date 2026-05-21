"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCfsData } from "@/lib/hooks/use-cfs";
import { COLORS } from "@/lib/constants";

export function CfsTypeChart() {
  const { filtered, isLoading } = useCfsData();

  const data = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      map.set(r.callType, (map.get(r.callType) ?? 0) + r.count);
    }
    return Array.from(map.entries())
      .map(([callType, count]) => ({ callType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [filtered]);

  if (isLoading) return <div className="h-64 flex items-center justify-center text-sm text-muted-foreground font-mono">Loading…</div>;

  return (
    <div className="border border-[#e8e8e8] rounded-lg bg-white p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Top Call Types</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="none" stroke="#e8e8e8" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="callType" tick={{ fontSize: 10, fill: "#444" }} axisLine={false} tickLine={false} width={160} />
          <Tooltip formatter={(v) => [(v ?? 0).toLocaleString(), "Calls"]} contentStyle={{ fontSize: 12, border: "1px solid #d4d4d4", boxShadow: "none" }} />
          <Bar dataKey="count" fill={COLORS.primary} radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

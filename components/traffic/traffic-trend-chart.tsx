"use client";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTrafficData } from "@/lib/hooks/use-traffic";
import { aggregateMonthly } from "@/lib/measures/traffic-measures";
import { formatDate, labelFormatter } from "@/lib/chart-utils";
import { COLORS } from "@/lib/constants";

export function TrafficTrendChart() {
  const { filtered, isLoading } = useTrafficData();
  const monthly = useMemo(() => aggregateMonthly(filtered), [filtered]);

  if (isLoading) return <div className="h-64 flex items-center justify-center text-sm text-muted-foreground font-mono">Loading…</div>;

  return (
    <div className="border border-[#e8e8e8] rounded-lg bg-white p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Monthly Collision Trend</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={monthly} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="none" stroke="#e8e8e8" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: "#999" }} axisLine={{ stroke: "#d4d4d4" }} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip formatter={(v) => [(v ?? 0).toLocaleString(), "Collisions"]} labelFormatter={labelFormatter} contentStyle={{ fontSize: 12, border: "1px solid #d4d4d4", boxShadow: "none" }} />
          <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

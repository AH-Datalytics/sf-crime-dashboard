"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTrafficData } from "@/lib/hooks/use-traffic";
import { aggregateByDistrict } from "@/lib/measures/traffic-measures";
import { COLORS } from "@/lib/constants";

export function TrafficNeighborhoodChart() {
  const { filtered, isLoading } = useTrafficData();
  const data = useMemo(() => aggregateByDistrict(filtered).slice(0, 12), [filtered]);

  if (isLoading) return <div className="h-64 flex items-center justify-center text-sm text-muted-foreground font-mono">Loading…</div>;

  return (
    <div className="border border-[#e8e8e8] rounded-lg bg-white p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Collisions by Police District</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 24, left: 0 }}>
          <CartesianGrid strokeDasharray="none" stroke="#e8e8e8" vertical={false} />
          <XAxis dataKey="district" tick={{ fontSize: 10, fill: "#555" }} axisLine={{ stroke: "#d4d4d4" }} tickLine={false} angle={-30} textAnchor="end" />
          <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip formatter={(v) => [(v ?? 0).toLocaleString(), "Collisions"]} contentStyle={{ fontSize: 12, border: "1px solid #d4d4d4", boxShadow: "none" }} />
          <Bar dataKey="count" fill={COLORS.primaryLight} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTrafficData } from "@/lib/hooks/use-traffic";
import { aggregateBySeverity } from "@/lib/measures/traffic-measures";

const SEVERITY_COLORS: Record<string, string> = {
  "Fatal": "#e2151a",
  "Injury (Severe)": "#e8bb29",
  "Injury (Other Visible)": "#0e6dcb",
  "Injury (Complaint of Pain)": "#3da2eb",
};

export function TrafficSeverityChart() {
  const { filtered, isLoading } = useTrafficData();
  const data = useMemo(() => aggregateBySeverity(filtered), [filtered]);

  if (isLoading) return <div className="h-64 flex items-center justify-center text-sm text-muted-foreground font-mono">Loading…</div>;

  return (
    <div className="border border-[#e8e8e8] rounded-lg bg-white p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Collisions by Severity</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="none" stroke="#e8e8e8" vertical={false} />
          <XAxis dataKey="severity" tick={{ fontSize: 10, fill: "#555" }} axisLine={{ stroke: "#d4d4d4" }} tickLine={false} angle={-20} textAnchor="end" />
          <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip formatter={(v) => [(v ?? 0).toLocaleString(), "Collisions"]} contentStyle={{ fontSize: 12, border: "1px solid #d4d4d4", boxShadow: "none" }} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] ?? "#0e6dcb"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

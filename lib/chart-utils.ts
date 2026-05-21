export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function labelFormatter(label: unknown): string {
  return typeof label === "string" ? formatDate(label) : String(label ?? "");
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatPct(n: number, decimals = 1): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(decimals)}%`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function computeAdaptiveTicks(dates: string[], maxTicks = 12): string[] {
  if (dates.length <= maxTicks) return dates;
  const step = Math.ceil(dates.length / maxTicks);
  return dates.filter((_, i) => i % step === 0);
}

export function groupByMonth(records: { date: string; count: number }[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const month = r.date.slice(0, 7); // YYYY-MM
    map.set(month, (map.get(month) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

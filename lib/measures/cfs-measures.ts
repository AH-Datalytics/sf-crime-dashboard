import type { CfsRecord } from "@/lib/types";

export function filterCfs(
  records: CfsRecord[],
  opts: { priority?: string | null; year?: number | null }
): CfsRecord[] {
  return records.filter((r) => {
    if (opts.priority && r.priority !== opts.priority) return false;
    if (opts.year && new Date(r.date).getFullYear() !== opts.year) return false;
    return true;
  });
}

export function computeTotalYTD(records: CfsRecord[], year: number): number {
  const now = new Date();
  const cutoff = year === now.getFullYear() ? now : new Date(`${year}-12-31`);
  const start = new Date(`${year}-01-01`);
  return records
    .filter((r) => {
      const d = new Date(r.date);
      return d >= start && d <= cutoff;
    })
    .reduce((s, r) => s + r.count, 0);
}

export function computeYTDComparison(records: CfsRecord[]) {
  const currentYear = new Date().getFullYear();
  const priorYear = currentYear - 1;
  const ytdCurrent = computeTotalYTD(records, currentYear);
  const ytdPrior = computeTotalYTD(records, priorYear);
  const pctChange = ytdPrior > 0 ? ((ytdCurrent - ytdPrior) / ytdPrior) * 100 : 0;
  return { ytdCurrent, ytdPrior, pctChange };
}

export function computeAvgResponseTime(records: CfsRecord[]): number {
  const valid = records.filter((r) => r.avgResponseMinutes !== null && r.avgResponseMinutes > 0);
  if (valid.length === 0) return 0;
  const weighted = valid.reduce((s, r) => s + (r.avgResponseMinutes ?? 0) * r.count, 0);
  const totalCount = valid.reduce((s, r) => s + r.count, 0);
  return totalCount > 0 ? weighted / totalCount : 0;
}

export function aggregateByPriority(records: CfsRecord[]): { priority: string; count: number; avgMinutes: number }[] {
  const map = new Map<string, { count: number; weightedMinutes: number }>();
  for (const r of records) {
    const key = r.priority || "Unknown";
    const existing = map.get(key) ?? { count: 0, weightedMinutes: 0 };
    existing.count += r.count;
    if (r.avgResponseMinutes !== null) {
      existing.weightedMinutes += r.avgResponseMinutes * r.count;
    }
    map.set(key, existing);
  }
  return Array.from(map.entries())
    .map(([priority, { count, weightedMinutes }]) => ({
      priority,
      count,
      avgMinutes: count > 0 ? weightedMinutes / count : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateMonthly(records: CfsRecord[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const month = r.date.slice(0, 7);
    map.set(month, (map.get(month) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

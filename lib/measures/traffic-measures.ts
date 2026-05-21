import type { TrafficRecord } from "@/lib/types";

export function filterTraffic(
  records: TrafficRecord[],
  opts: { severity?: string | null; district?: string | null; year?: number | null }
): TrafficRecord[] {
  return records.filter((r) => {
    if (opts.severity && r.severity !== opts.severity) return false;
    if (opts.district && r.district !== opts.district) return false;
    if (opts.year && new Date(r.date).getFullYear() !== opts.year) return false;
    return true;
  });
}

export function computeYTD(records: TrafficRecord[], year: number): number {
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

export function computeYTDComparison(records: TrafficRecord[]) {
  const currentYear = new Date().getFullYear();
  const priorYear = currentYear - 1;
  const ytdCurrent = computeYTD(records, currentYear);
  const ytdPrior = computeYTD(records, priorYear);
  const pctChange = ytdPrior > 0 ? ((ytdCurrent - ytdPrior) / ytdPrior) * 100 : 0;
  return { ytdCurrent, ytdPrior, pctChange };
}

export function aggregateBySeverity(records: TrafficRecord[]): { severity: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const key = r.severity || "Unknown";
    map.set(key, (map.get(key) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .map(([severity, count]) => ({ severity, count }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateByDistrict(records: TrafficRecord[]): { district: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const key = r.district || "Unknown";
    map.set(key, (map.get(key) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateMonthly(records: TrafficRecord[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const month = r.date.slice(0, 7);
    map.set(month, (map.get(month) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

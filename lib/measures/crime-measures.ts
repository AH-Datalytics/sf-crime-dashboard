import type { CrimeRecord } from "@/lib/types";

export function filterCrime(
  records: CrimeRecord[],
  opts: { district?: string | null; category?: string | null; year?: number | null }
): CrimeRecord[] {
  return records.filter((r) => {
    if (opts.district && r.district !== opts.district) return false;
    if (opts.category && r.category !== opts.category) return false;
    if (opts.year && new Date(r.date).getFullYear() !== opts.year) return false;
    return true;
  });
}

export function computeYTD(records: CrimeRecord[], year: number): number {
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

export function computeYTDComparison(records: CrimeRecord[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const priorYear = currentYear - 1;
  const ytdCurrent = computeYTD(records, currentYear);
  const ytdPrior = computeYTD(records, priorYear);
  const pctChange = ytdPrior > 0 ? ((ytdCurrent - ytdPrior) / ytdPrior) * 100 : 0;
  return { ytdCurrent, ytdPrior, pctChange };
}

export function aggregateByCategory(records: CrimeRecord[]): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) map.set(r.category, (map.get(r.category) ?? 0) + r.count);
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateByDistrict(records: CrimeRecord[]): { district: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const key = r.district || "Unknown";
    map.set(key, (map.get(key) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateMonthly(records: CrimeRecord[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const month = r.date.slice(0, 7);
    map.set(month, (map.get(month) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

export function buildYTDTable(
  records: CrimeRecord[],
  categories: string[]
): { category: string; ytdCurrent: number; ytdPrior: number; pctChange: number }[] {
  const currentYear = new Date().getFullYear();
  return categories.map((cat) => {
    const filtered = records.filter((r) => r.category === cat);
    const ytdCurrent = computeYTD(filtered, currentYear);
    const ytdPrior = computeYTD(filtered, currentYear - 1);
    const pctChange = ytdPrior > 0 ? ((ytdCurrent - ytdPrior) / ytdPrior) * 100 : 0;
    return { category: cat, ytdCurrent, ytdPrior, pctChange };
  });
}

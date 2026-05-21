import { createWriteStream, mkdirSync } from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import type { MapPayload, MapPoint } from "../lib/types";

const DATASET_ID = "wg3w-h783";
const BASE_URL = `https://data.sfgov.org/resource/${DATASET_ID}.json`;
const PAGE_SIZE = 50_000;

function ninetyDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 90);
  return d.toISOString().slice(0, 10);
}

interface SocrataRow {
  row_id?: string;
  incident_date?: string;
  incident_category?: string;
  latitude?: string;
  longitude?: string;
}

async function fetchPage(offset: number, startDate: string): Promise<SocrataRow[]> {
  const where = `incident_date >= '${startDate}T00:00:00.000' AND latitude IS NOT NULL`;
  const url = `${BASE_URL}?$limit=${PAGE_SIZE}&$offset=${offset}&$where=${encodeURIComponent(where)}&$select=row_id,incident_date,incident_category,latitude,longitude&$order=incident_date`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Socrata error ${res.status}`);
  return res.json();
}

async function main() {
  console.log("ETL Map: starting...");
  const startDate = ninetyDaysAgo();
  const rows: SocrataRow[] = [];
  let offset = 0;
  while (true) {
    console.log(`  Fetching map offset ${offset}...`);
    const page = await fetchPage(offset, startDate);
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  console.log(`  Total map rows: ${rows.length}`);

  const points: MapPoint[] = rows
    .filter((r) => r.latitude && r.longitude)
    .map((r) => ({
      id: r.row_id ?? `${r.incident_date}-${Math.random()}`,
      date: (r.incident_date ?? "").slice(0, 10),
      category: (r.incident_category ?? "Unknown").trim(),
      lat: parseFloat(r.latitude!),
      lng: parseFloat(r.longitude!),
    }))
    .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

  const payload: MapPayload = { points, updatedAt: new Date().toISOString() };
  mkdirSync("data/generated", { recursive: true });
  const dest = "data/generated/map-data.json.gz";
  await pipeline(Readable.from([JSON.stringify(payload)]), createGzip(), createWriteStream(dest));
  console.log(`  Written: ${dest} (${points.length} points)`);
}

main().catch((e) => { console.error(e); process.exit(1); });

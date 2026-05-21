import { createWriteStream, mkdirSync } from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import type { CrimePayload, CrimeRecord } from "../lib/types";

const DATASET_ID = "wg3w-h783";
const BASE_URL = `https://data.sfgov.org/resource/${DATASET_ID}.json`;
const PAGE_SIZE = 50_000;
const START_DATE = "2022-01-01";

interface SocrataRow {
  incident_date?: string;
  incident_datetime?: string;
  incident_category?: string;
  police_district?: string;
  analysis_neighborhood?: string;
}

async function fetchPage(offset: number): Promise<SocrataRow[]> {
  const where = `incident_date >= '${START_DATE}T00:00:00.000'`;
  const url = `${BASE_URL}?$limit=${PAGE_SIZE}&$offset=${offset}&$where=${encodeURIComponent(where)}&$select=incident_date,incident_category,police_district,analysis_neighborhood&$order=incident_date`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Socrata error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAll(): Promise<SocrataRow[]> {
  const rows: SocrataRow[] = [];
  let offset = 0;
  while (true) {
    console.log(`  Fetching crime offset ${offset}...`);
    const page = await fetchPage(offset);
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return rows;
}

function aggregate(rows: SocrataRow[]): CrimeRecord[] {
  const map = new Map<string, CrimeRecord>();
  for (const row of rows) {
    const date = (row.incident_date ?? "").slice(0, 10);
    if (!date) continue;
    const category = (row.incident_category ?? "Unknown").trim();
    const district = (row.police_district ?? "Unknown").trim();
    const neighborhood = (row.analysis_neighborhood ?? "Unknown").trim();
    const key = `${date}|${category}|${district}|${neighborhood}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, { date, category, district, neighborhood, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

async function main() {
  console.log("ETL Crime: starting...");
  const rows = await fetchAll();
  console.log(`  Total rows: ${rows.length}`);
  const records = aggregate(rows);
  console.log(`  Aggregated records: ${records.length}`);

  const payload: CrimePayload = { records, updatedAt: new Date().toISOString() };
  const json = JSON.stringify(payload);

  mkdirSync("data/generated", { recursive: true });
  const dest = "data/generated/crime-data.json.gz";
  await pipeline(
    Readable.from([json]),
    createGzip(),
    createWriteStream(dest)
  );
  console.log(`  Written: ${dest}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

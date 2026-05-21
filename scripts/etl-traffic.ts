import { createWriteStream, mkdirSync } from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import type { TrafficPayload, TrafficRecord } from "../lib/types";

const DATASET_ID = "ubvf-ztfx";
const BASE_URL = `https://data.sfgov.org/resource/${DATASET_ID}.json`;
const PAGE_SIZE = 50_000;
const START_DATE = "2022-01-01";

interface SocrataRow {
  collision_datetime?: string;
  collision_severity?: string;
  police_district?: string;
  analysis_neighborhood?: string;
}

async function fetchPage(offset: number): Promise<SocrataRow[]> {
  const where = `collision_datetime >= '${START_DATE}T00:00:00.000'`;
  const url = `${BASE_URL}?$limit=${PAGE_SIZE}&$offset=${offset}&$where=${encodeURIComponent(where)}&$select=collision_datetime,collision_severity,police_district,analysis_neighborhood&$order=collision_datetime`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Socrata error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log("ETL Traffic: starting...");
  const rows: SocrataRow[] = [];
  let offset = 0;
  while (true) {
    console.log(`  Fetching traffic offset ${offset}...`);
    const page = await fetchPage(offset);
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  console.log(`  Total rows: ${rows.length}`);

  const map = new Map<string, TrafficRecord>();
  for (const row of rows) {
    const date = (row.collision_datetime ?? "").slice(0, 10);
    if (!date) continue;
    const severity = (row.collision_severity ?? "Unknown").trim();
    const district = (row.police_district ?? "Unknown").trim();
    const neighborhood = (row.analysis_neighborhood ?? "Unknown").trim();
    const key = `${date}|${severity}|${district}|${neighborhood}`;
    const existing = map.get(key);
    if (existing) { existing.count += 1; }
    else { map.set(key, { date, severity, district, neighborhood, count: 1 }); }
  }

  const records = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  const payload: TrafficPayload = { records, updatedAt: new Date().toISOString() };
  mkdirSync("data/generated", { recursive: true });
  const dest = "data/generated/traffic-data.json.gz";
  await pipeline(Readable.from([JSON.stringify(payload)]), createGzip(), createWriteStream(dest));
  console.log(`  Written: ${dest}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

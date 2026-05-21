import { createWriteStream, mkdirSync } from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import type { CfsPayload, CfsRecord } from "../lib/types";

const DATASET_ID = "gnap-fj3t";
const BASE_URL = `https://data.sfgov.org/resource/${DATASET_ID}.json`;
const PAGE_SIZE = 50_000;
const START_DATE = "2022-01-01";

interface SocrataRow {
  received_datetime?: string;
  onscene_datetime?: string;
  dispatch_datetime?: string;
  call_type_final_desc?: string;
  priority_final?: string;
}

function minutesBetween(a?: string, b?: string): number | null {
  if (!a || !b) return null;
  const diff = new Date(b).getTime() - new Date(a).getTime();
  if (diff < 0 || diff > 24 * 60 * 60 * 1000) return null; // skip clearly bad data
  return diff / 60_000;
}

async function fetchPage(offset: number): Promise<SocrataRow[]> {
  const where = `received_datetime >= '${START_DATE}T00:00:00.000'`;
  const url = `${BASE_URL}?$limit=${PAGE_SIZE}&$offset=${offset}&$where=${encodeURIComponent(where)}&$select=received_datetime,dispatch_datetime,onscene_datetime,call_type_final_desc,priority_final&$order=received_datetime`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Socrata error ${res.status}`);
  return res.json();
}

async function main() {
  console.log("ETL CFS: starting...");
  const rows: SocrataRow[] = [];
  let offset = 0;
  while (true) {
    console.log(`  Fetching CFS offset ${offset}...`);
    const page = await fetchPage(offset);
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  console.log(`  Total rows: ${rows.length}`);

  // Aggregate: key = date|priority|callType
  const map = new Map<string, { count: number; sumResponse: number; countResponse: number; sumDispatch: number; countDispatch: number }>();
  for (const row of rows) {
    const date = (row.received_datetime ?? "").slice(0, 10);
    if (!date) continue;
    const callType = (row.call_type_final_desc ?? "Unknown").trim().slice(0, 60);
    const priority = (row.priority_final ?? "Unknown").trim();
    const key = `${date}|${priority}|${callType}`;
    const existing = map.get(key) ?? { count: 0, sumResponse: 0, countResponse: 0, sumDispatch: 0, countDispatch: 0 };
    existing.count += 1;
    const responseMin = minutesBetween(row.received_datetime, row.onscene_datetime);
    if (responseMin !== null) { existing.sumResponse += responseMin; existing.countResponse += 1; }
    const dispatchMin = minutesBetween(row.received_datetime, row.dispatch_datetime);
    if (dispatchMin !== null) { existing.sumDispatch += dispatchMin; existing.countDispatch += 1; }
    map.set(key, existing);
  }

  const records: CfsRecord[] = Array.from(map.entries())
    .map(([key, v]) => {
      const [date, priority, callType] = key.split("|");
      return {
        date,
        callType,
        priority,
        count: v.count,
        avgResponseMinutes: v.countResponse > 0 ? v.sumResponse / v.countResponse : null,
        avgDispatchMinutes: v.countDispatch > 0 ? v.sumDispatch / v.countDispatch : null,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const payload: CfsPayload = { records, updatedAt: new Date().toISOString() };
  mkdirSync("data/generated", { recursive: true });
  const dest = "data/generated/cfs-data.json.gz";
  await pipeline(Readable.from([JSON.stringify(payload)]), createGzip(), createWriteStream(dest));
  console.log(`  Written: ${dest}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

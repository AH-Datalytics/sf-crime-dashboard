# SF Public Safety Dashboard

San Francisco public safety dashboard built by AH Datalytics. Next.js + React 19 + TypeScript. Deployed on Vercel.

## Quick Commands

```bash
npm run dev                          # Dev server on :3000
npm run build                        # Production build
npx tsx scripts/etl-crime.ts        # Refresh crime data (~10 min)
npx tsx scripts/etl-cfs.ts          # Refresh CFS data
npx tsx scripts/etl-traffic.ts      # Refresh traffic data
npx tsx scripts/etl-map.ts          # Refresh map data (last 90 days)
npx tsx scripts/refresh-data.ts     # Run all 4 ETLs
```

## Architecture

**Data flow:** Socrata API → ETL scripts → `data/generated/*.json.gz` → API routes → SWR hooks → Zustand stores → React components

### 3 Domains

| Domain | Route | ETL Script | Data File | Source |
|--------|-------|------------|-----------|--------|
| Crime | `/crime` | `etl-crime.ts` | `crime-data.json.gz` | SODA `wg3w-h783` |
| CFS | `/cfs` | `etl-cfs.ts` | `cfs-data.json.gz` | SODA `gnap-fj3t` |
| Traffic | `/traffic` | `etl-traffic.ts` | `traffic-data.json.gz` | SODA `ubvf-ztfx` |
| Map | `/map` | `etl-map.ts` | `map-data.json.gz` | SODA `wg3w-h783` (last 90d) |

### Per-Domain Pattern

```
scripts/etl-{domain}.ts                 → ETL
src/app/api/{domain}-data/route.ts      → API (gzip serve)
lib/types.ts                            → TypeScript interfaces
lib/stores/{domain}-store.ts            → Zustand filters
lib/hooks/use-{domain}.ts               → SWR + filter application
lib/measures/{domain}-measures.ts       → Pure computation
components/{domain}/                    → filter-bar, kpi-row, charts
app/{domain}/page.tsx                   → Page
```

## Data Sources

- Crime dataset: `wg3w-h783` — 2022-present, ~500k rows, aggregated to 315k records
- CFS dataset: `gnap-fj3t` — 2022-present (note: no location data)
- Traffic dataset: `ubvf-ztfx` — 2022-present, ~12k rows
- Map dataset: same as crime, last 90 days only, ~20k incident points

## Design System

Colors: primary `#01396C` (navy), background `#faf9f6`, increase `#c62828` (red ▲), decrease `#1565c0` (blue ▼)
Fonts: Libre Baskerville (serif) / Roboto Condensed (sans) / IBM Plex Mono (mono)

## Deployment

Push to `main` → Vercel auto-deploys. GitHub Actions runs ETL daily at 2 AM PT and commits updated data files.

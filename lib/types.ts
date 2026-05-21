// ─── Crime ───────────────────────────────────────────────────────────────────

export interface CrimeRecord {
  date: string;           // YYYY-MM-DD
  category: string;
  district: string;
  neighborhood: string;
  count: number;
}

export interface CrimePayload {
  records: CrimeRecord[];
  updatedAt: string;
}

// ─── Calls for Service ────────────────────────────────────────────────────────

export interface CfsRecord {
  date: string;           // YYYY-MM-DD
  callType: string;
  priority: string;
  count: number;
  avgResponseMinutes: number | null;
  avgDispatchMinutes: number | null;
}

export interface CfsPayload {
  records: CfsRecord[];
  updatedAt: string;
}

// ─── Traffic ─────────────────────────────────────────────────────────────────

export interface TrafficRecord {
  date: string;           // YYYY-MM-DD
  severity: string;
  district: string;
  neighborhood: string;
  count: number;
}

export interface TrafficPayload {
  records: TrafficRecord[];
  updatedAt: string;
}

// ─── Map ─────────────────────────────────────────────────────────────────────

export interface MapPoint {
  id: string;
  date: string;
  category: string;
  lat: number;
  lng: number;
}

export interface MapPayload {
  points: MapPoint[];
  updatedAt: string;
}

// ─── Overview ────────────────────────────────────────────────────────────────

export interface DomainSummary {
  totalYTD: number;
  priorYTD: number;
  pctChange: number;
  lastUpdated: string;
}

export const SOCRATA_BASE = "https://data.sfgov.org/resource";

export const DATASETS = {
  crime: `${SOCRATA_BASE}/wg3w-h783.json`,
  cfs: `${SOCRATA_BASE}/gnap-fj3t.json`,
  traffic: `${SOCRATA_BASE}/ubvf-ztfx.json`,
} as const;

export const COLORS = {
  primary: "#01396C",
  primaryLight: "#1565c0",
  background: "#faf9f6",
  surface: "#ffffff",
  muted: "#f5f5f0",
  border: "#e8e8e8",
  borderStrong: "#d4d4d4",
  increase: "#c62828",
  decrease: "#1565c0",
  neutral: "#666666",
  chart: ["#01396C", "#1565c0", "#c62828", "#65bc7b", "#7a5c00", "#9c27b0", "#ff6f00", "#0097a7"],
} as const;

export const PART1_CATEGORIES = [
  "Homicide",
  "Rape",
  "Robbery",
  "Assault",
  "Burglary",
  "Larceny Theft",
  "Motor Vehicle Theft",
  "Arson",
] as const;

export const ALL_CRIME_CATEGORIES = [
  "Arson", "Assault", "Burglary", "Drug Offense", "Drug Violation",
  "Fraud", "Homicide", "Larceny Theft", "Malicious Mischief",
  "Motor Vehicle Theft", "Other Offenses", "Rape", "Robbery",
  "Sex Offense", "Vandalism", "Weapons Offense",
] as const;

export const TRAFFIC_SEVERITIES = [
  "Fatal",
  "Injury (Severe)",
  "Injury (Other Visible)",
  "Injury (Complaint of Pain)",
] as const;

export const CFS_PRIORITIES = ["A", "B", "C", "E"] as const;

export const POLICE_DISTRICTS = [
  "Bayview",
  "Central",
  "Ingleside",
  "Mission",
  "Northern",
  "Park",
  "Richmond",
  "Southern",
  "Taraval",
  "Tenderloin",
] as const;

export const SWR_CONFIG = {
  revalidateOnFocus: false,
  dedupingInterval: 900_000, // 15 min
} as const;

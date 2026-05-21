"use client";
import useSWR from "swr";
import { useMemo } from "react";
import type { TrafficPayload } from "@/lib/types";
import { useTrafficStore } from "@/lib/stores/traffic-store";
import { filterTraffic } from "@/lib/measures/traffic-measures";
import { SWR_CONFIG } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTrafficData() {
  const { data, isLoading, error } = useSWR<TrafficPayload>("/api/traffic-data", fetcher, SWR_CONFIG);
  const { severity, district, year } = useTrafficStore();

  const filtered = useMemo(() => {
    if (!data?.records) return [];
    return filterTraffic(data.records, { severity, district, year });
  }, [data, severity, district, year]);

  return { data, filtered, isLoading, error };
}

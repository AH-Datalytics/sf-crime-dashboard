"use client";
import useSWR from "swr";
import { useMemo } from "react";
import type { CrimePayload } from "@/lib/types";
import { useCrimeStore } from "@/lib/stores/crime-store";
import { filterCrime } from "@/lib/measures/crime-measures";
import { SWR_CONFIG } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCrimeData() {
  const { data, isLoading, error } = useSWR<CrimePayload>("/api/crime-data", fetcher, SWR_CONFIG);
  const { district, category, year } = useCrimeStore();

  const filtered = useMemo(() => {
    if (!data?.records) return [];
    return filterCrime(data.records, { district, category, year });
  }, [data, district, category, year]);

  return { data, filtered, isLoading, error };
}

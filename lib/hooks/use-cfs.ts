"use client";
import useSWR from "swr";
import { useMemo } from "react";
import type { CfsPayload } from "@/lib/types";
import { useCfsStore } from "@/lib/stores/cfs-store";
import { filterCfs } from "@/lib/measures/cfs-measures";
import { SWR_CONFIG } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCfsData() {
  const { data, isLoading, error } = useSWR<CfsPayload>("/api/cfs-data", fetcher, SWR_CONFIG);
  const { priority, year } = useCfsStore();

  const filtered = useMemo(() => {
    if (!data?.records) return [];
    return filterCfs(data.records, { priority, year });
  }, [data, priority, year]);

  return { data, filtered, isLoading, error };
}

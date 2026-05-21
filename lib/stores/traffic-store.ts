"use client";
import { create } from "zustand";

interface TrafficFilters {
  severity: string | null;
  district: string | null;
  year: number | null;
}

interface TrafficStore extends TrafficFilters {
  setSeverity: (v: string | null) => void;
  setDistrict: (v: string | null) => void;
  setYear: (v: number | null) => void;
  resetFilters: () => void;
}

const DEFAULT: TrafficFilters = { severity: null, district: null, year: null };

export const useTrafficStore = create<TrafficStore>((set) => ({
  ...DEFAULT,
  setSeverity: (v) => set({ severity: v }),
  setDistrict: (v) => set({ district: v }),
  setYear: (v) => set({ year: v }),
  resetFilters: () => set(DEFAULT),
}));

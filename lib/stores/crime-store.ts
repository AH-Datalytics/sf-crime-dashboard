"use client";
import { create } from "zustand";

interface CrimeFilters {
  district: string | null;
  category: string | null;
  year: number | null;
}

interface CrimeStore extends CrimeFilters {
  setDistrict: (v: string | null) => void;
  setCategory: (v: string | null) => void;
  setYear: (v: number | null) => void;
  resetFilters: () => void;
}

const DEFAULT: CrimeFilters = { district: null, category: null, year: null };

export const useCrimeStore = create<CrimeStore>((set) => ({
  ...DEFAULT,
  setDistrict: (v) => set({ district: v }),
  setCategory: (v) => set({ category: v }),
  setYear: (v) => set({ year: v }),
  resetFilters: () => set(DEFAULT),
}));

"use client";
import { create } from "zustand";

interface CfsFilters {
  priority: string | null;
  year: number | null;
}

interface CfsStore extends CfsFilters {
  setPriority: (v: string | null) => void;
  setYear: (v: number | null) => void;
  resetFilters: () => void;
}

const DEFAULT: CfsFilters = { priority: null, year: null };

export const useCfsStore = create<CfsStore>((set) => ({
  ...DEFAULT,
  setPriority: (v) => set({ priority: v }),
  setYear: (v) => set({ year: v }),
  resetFilters: () => set(DEFAULT),
}));

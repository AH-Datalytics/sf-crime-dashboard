"use client";
import { useCfsStore } from "@/lib/stores/cfs-store";

export function CfsFilterBar() {
  const { priority, setPriority, year, setYear, resetFilters } = useCfsStore();
  const hasFilters = priority || year;
  const priorities = ["A", "B", "C", "E"];
  const years = [2022, 2023, 2024, 2025, 2026];

  return (
    <div className="sticky top-12 z-50 bg-white border-b border-[#e8e8e8] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Priority</label>
          <select
            value={priority ?? ""}
            onChange={(e) => setPriority(e.target.value || null)}
            className="text-sm border border-[#e8e8e8] rounded px-2 py-1.5 bg-white min-w-[110px]"
          >
            <option value="">All Priorities</option>
            {priorities.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Year</label>
          <select
            value={year ?? ""}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
            className="text-sm border border-[#e8e8e8] rounded px-2 py-1.5 bg-white min-w-[90px]"
          >
            <option value="">All Years</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        {hasFilters && (
          <button onClick={resetFilters} className="ml-auto text-sm text-[#01396C] hover:underline">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

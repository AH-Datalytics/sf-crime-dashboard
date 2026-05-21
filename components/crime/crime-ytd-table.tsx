"use client";
import { useMemo } from "react";
import { useCrimeData } from "@/lib/hooks/use-crime";
import { buildYTDTable } from "@/lib/measures/crime-measures";
import { PART1_CATEGORIES } from "@/lib/constants";

export function CrimeYTDTable() {
  const { data, isLoading } = useCrimeData();

  const rows = useMemo(() => {
    if (!data?.records) return [];
    return buildYTDTable(data.records, [...PART1_CATEGORIES]);
  }, [data]);

  if (isLoading) return null;
  const currentYear = new Date().getFullYear();

  return (
    <div className="border border-[#e8e8e8] rounded-lg bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e8e8e8]">
        <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
          Year-to-Date Comparison — Part I Crimes
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8e8e8] bg-[#faf9f6]">
              <th className="text-left px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">Category</th>
              <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">YTD {currentYear}</th>
              <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">YTD {currentYear - 1}</th>
              <th className="text-right px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isNeutral = Math.abs(row.pctChange) < 2;
              const isIncrease = row.pctChange >= 2;
              return (
                <tr key={row.category} className={i % 2 === 0 ? "bg-white" : "bg-[#faf9f6]"}>
                  <td className="px-4 py-2 font-sans">{row.category}</td>
                  <td className="px-4 py-2 text-right font-mono tabular-nums">{row.ytdCurrent.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-mono tabular-nums text-gray-400">{row.ytdPrior.toLocaleString()}</td>
                  <td className={`px-4 py-2 text-right font-mono tabular-nums font-medium ${isNeutral ? "text-gray-400" : isIncrease ? "text-red-600" : "text-blue-600"}`}>
                    {isNeutral ? "—" : (isIncrease ? "▲ +" : "▼ ")}{isNeutral ? "" : `${Math.abs(row.pctChange).toFixed(1)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

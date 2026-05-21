"use client";
import dynamic from "next/dynamic";

const CrimeMap = dynamic(
  () => import("./crime-map").then((m) => m.CrimeMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] bg-[#f5f5f0] rounded-lg border border-[#e8e8e8] flex items-center justify-center text-sm font-mono text-gray-400">
        Loading map…
      </div>
    ),
  }
);

export function CrimeMapClient() {
  return <CrimeMap />;
}

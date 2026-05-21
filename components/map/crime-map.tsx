"use client";
import { useEffect, useRef, useMemo, useState } from "react";
import useSWR from "swr";
import type { MapPayload } from "@/lib/types";
import { SWR_CONFIG, PART1_CATEGORIES, COLORS } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CATEGORY_COLORS: Record<string, string> = {
  "Homicide": "#c62828",
  "Rape": "#ad1457",
  "Robbery": "#e65100",
  "Assault": "#f57c00",
  "Burglary": "#1565c0",
  "Larceny Theft": "#1976d2",
  "Motor Vehicle Theft": "#0288d1",
  "Arson": "#6a1a6a",
};

export function CrimeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);
  const { data, isLoading } = useSWR<MapPayload>("/api/map-data", fetcher, SWR_CONFIG);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const points = useMemo(() => {
    if (!data?.points) return [];
    if (!selectedCategory) return data.points;
    return data.points.filter((p) => p.category === selectedCategory);
  }, [data, selectedCategory]);

  useEffect(() => {
    if (!mapRef.current || leafletRef.current || typeof window === "undefined") return;
    import("leaflet").then((L) => {
      // Fix default icon paths in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [37.7749, -122.4194],
        zoom: 12,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);
      leafletRef.current = map;
    });
    return () => {
      leafletRef.current?.remove();
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletRef.current || typeof window === "undefined") return;
    import("leaflet").then((L) => {
      const map = leafletRef.current!;
      // Remove existing circle layers
      map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) map.removeLayer(layer);
      });
      const MAX_POINTS = 5000;
      const sample = points.length > MAX_POINTS
        ? points.filter((_, i) => i % Math.ceil(points.length / MAX_POINTS) === 0)
        : points;
      for (const pt of sample) {
        const color = CATEGORY_COLORS[pt.category] ?? COLORS.primary;
        L.circleMarker([pt.lat, pt.lng], {
          radius: 4,
          fillColor: color,
          color: "transparent",
          fillOpacity: 0.6,
          weight: 0,
        })
          .bindTooltip(`${pt.category}<br/>${pt.date}`, { className: "text-xs" })
          .addTo(map);
      }
    });
  }, [points]);

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
            selectedCategory === null
              ? "bg-[#01396C] text-white border-[#01396C]"
              : "bg-white text-gray-600 border-[#e8e8e8] hover:border-[#01396C]"
          }`}
        >
          All
        </button>
        {PART1_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
              selectedCategory === cat
                ? "text-white border-transparent"
                : "bg-white text-gray-600 border-[#e8e8e8] hover:border-[#01396C]"
            }`}
            style={selectedCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat] ?? COLORS.primary, borderColor: CATEGORY_COLORS[cat] ?? COLORS.primary } : {}}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="text-xs font-mono text-gray-400">
        {isLoading ? "Loading…" : `Showing ${Math.min(points.length, 5000).toLocaleString()} of ${points.length.toLocaleString()} incidents (last 90 days)`}
      </div>
      <div ref={mapRef} className="h-[520px] rounded-lg border border-[#e8e8e8] z-0" />
    </div>
  );
}

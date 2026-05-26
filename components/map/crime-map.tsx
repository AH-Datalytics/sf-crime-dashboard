"use client";
import { useEffect, useRef, useMemo, useState } from "react";
import useSWR from "swr";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import type { MapPayload } from "@/lib/types";
import { SWR_CONFIG, PART1_CATEGORIES, COLORS } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CATEGORY_COLORS: Record<string, string> = {
  "Homicide": "#e2151a",
  "Rape": "#bb8732",
  "Robbery": "#e8bb29",
  "Assault": "#f57c00",
  "Burglary": "#0a1433",
  "Larceny Theft": "#2e7d32",
  "Motor Vehicle Theft": "#0e6dcb",
  "Arson": "#7b1fa2",
};

const MAX_POINTS = 5000;

export function CrimeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { data, isLoading } = useSWR<MapPayload>("/api/map-data", fetcher, SWR_CONFIG);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const points = useMemo(() => {
    if (!data?.points) return [];
    return selectedCategory
      ? data.points.filter((p) => p.category === selectedCategory)
      : data.points;
  }, [data, selectedCategory]);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((mapRef.current as any)._leaflet_id) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, { center: [37.7749, -122.4194], zoom: 12 });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const markers = L.layerGroup().addTo(map);
      leafletRef.current = map;
      markersRef.current = markers;
      setMapReady(true);
    });
    return () => {
      cancelled = true;
      leafletRef.current?.remove();
      leafletRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Re-render points whenever map is ready or filtered points change
  useEffect(() => {
    if (!mapReady || !markersRef.current) return;
    import("leaflet").then((L) => {
      if (!markersRef.current) return;
      markersRef.current.clearLayers();
      const sample =
        points.length > MAX_POINTS
          ? points.filter((_, i) => i % Math.ceil(points.length / MAX_POINTS) === 0)
          : points;
      for (const pt of sample) {
        L.circleMarker([pt.lat, pt.lng], {
          radius: 4,
          fillColor: CATEGORY_COLORS[pt.category] ?? COLORS.primary,
          color: "transparent",
          fillOpacity: 0.6,
          weight: 0,
        })
          .bindTooltip(`${pt.category}<br/>${pt.date}`, { className: "text-xs" })
          .addTo(markersRef.current!);
      }
    });
  }, [points, mapReady]);

  const displayCount = Math.min(points.length, MAX_POINTS).toLocaleString();
  const totalCount = points.length.toLocaleString();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
            selectedCategory === null
              ? "bg-[#0e6dcb] text-white border-[#0e6dcb]"
              : "bg-white text-gray-600 border-[#e8e8e8] hover:border-[#0e6dcb]"
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
                : "bg-white text-gray-600 border-[#e8e8e8] hover:border-[#0e6dcb]"
            }`}
            style={
              selectedCategory === cat
                ? { backgroundColor: CATEGORY_COLORS[cat] ?? COLORS.primary, borderColor: CATEGORY_COLORS[cat] ?? COLORS.primary }
                : {}
            }
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="border border-[#e8e8e8] rounded-lg bg-white px-4 py-3">
        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2">Category</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {PART1_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span
                className="inline-block rounded-full flex-shrink-0"
                style={{ width: 10, height: 10, backgroundColor: CATEGORY_COLORS[cat] ?? COLORS.primary, opacity: 0.85 }}
              />
              <span className="text-xs font-sans text-gray-600">{cat}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs font-mono text-gray-400">
        {isLoading ? "Loading…" : `Showing ${displayCount} of ${totalCount} incidents (last 90 days)`}
      </div>
      <div ref={mapRef} className="h-[520px] rounded-lg border border-[#e8e8e8] z-0" />
    </div>
  );
}

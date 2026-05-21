import { CrimeMapClient } from "@/components/map/crime-map-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Map — SF Public Safety" };

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="font-serif text-xl font-bold text-foreground">Incident Map</h1>
        <p className="text-sm text-muted-foreground font-sans mt-0.5">
          Crime incidents from the last 90 days with known coordinates. Filter by Part I category.
        </p>
      </div>
      <CrimeMapClient />
    </div>
  );
}

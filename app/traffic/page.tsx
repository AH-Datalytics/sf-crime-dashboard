import { TrafficFilterBar } from "@/components/traffic/traffic-filter-bar";
import { TrafficKPIRow } from "@/components/traffic/traffic-kpi-row";
import { TrafficTrendChart } from "@/components/traffic/traffic-trend-chart";
import { TrafficSeverityChart } from "@/components/traffic/traffic-severity-chart";
import { TrafficNeighborhoodChart } from "@/components/traffic/traffic-neighborhood-chart";

export const metadata = { title: "Traffic — SF Public Safety" };

export default function TrafficPage() {
  return (
    <>
      <TrafficFilterBar />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground">Traffic Collisions</h1>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            SFPD traffic collision reports, 2022–present. Source: DataSF.
          </p>
        </div>
        <TrafficKPIRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficTrendChart />
          <TrafficSeverityChart />
        </div>
        <TrafficNeighborhoodChart />
      </div>
    </>
  );
}

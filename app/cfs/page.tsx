import { CfsFilterBar } from "@/components/cfs/cfs-filter-bar";
import { CfsKPIRow } from "@/components/cfs/cfs-kpi-row";
import { CfsTrendChart } from "@/components/cfs/cfs-trend-chart";
import { CfsResponseChart } from "@/components/cfs/cfs-response-chart";
import { CfsTypeChart } from "@/components/cfs/cfs-type-chart";

export const metadata = { title: "Calls for Service — SF Public Safety" };

export default function CfsPage() {
  return (
    <>
      <CfsFilterBar />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground">Calls for Service</h1>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            SFPD dispatch calls, 2022–present. Response times computed from received → on-scene timestamps. Source: DataSF.
          </p>
        </div>
        <CfsKPIRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CfsTrendChart />
          <CfsResponseChart />
        </div>
        <CfsTypeChart />
      </div>
    </>
  );
}

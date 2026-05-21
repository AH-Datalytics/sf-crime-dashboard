import { CrimeFilterBar } from "@/components/crime/crime-filter-bar";
import { CrimeKPIRow } from "@/components/crime/crime-kpi-row";
import { CrimeTrendChart } from "@/components/crime/crime-trend-chart";
import { CrimeCategoryChart } from "@/components/crime/crime-category-chart";
import { CrimeDistrictChart } from "@/components/crime/crime-district-chart";
import { CrimeYTDTable } from "@/components/crime/crime-ytd-table";

export const metadata = { title: "Crime — SF Public Safety" };

export default function CrimePage() {
  return (
    <>
      <CrimeFilterBar />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground">Crime</h1>
          <p className="text-sm text-muted-foreground font-sans mt-0.5">
            All reported incidents from SFPD, 2022–present. Source: DataSF.
          </p>
        </div>
        <CrimeKPIRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CrimeTrendChart />
          <CrimeCategoryChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CrimeDistrictChart />
          <CrimeYTDTable />
        </div>
      </div>
    </>
  );
}

"use client";
import Link from "next/link";
import { useCrimeData } from "@/lib/hooks/use-crime";
import { useTrafficData } from "@/lib/hooks/use-traffic";
import { useCfsData } from "@/lib/hooks/use-cfs";
import { computeYTDComparison as crimeYTD } from "@/lib/measures/crime-measures";
import { computeYTDComparison as trafficYTD } from "@/lib/measures/traffic-measures";
import { computeYTDComparison as cfsYTD } from "@/lib/measures/cfs-measures";

function DomainCard({
  href,
  title,
  description,
  ytd,
  prior,
  pct,
  unit,
  isLoading,
}: {
  href: string;
  title: string;
  description: string;
  ytd: number;
  prior: number;
  pct: number;
  unit: string;
  isLoading: boolean;
}) {
  const isNeutral = Math.abs(pct) < 2;
  const isIncrease = pct >= 2;

  return (
    <Link
      href={href}
      className="block border border-[#e8e8e8] rounded-lg bg-white p-5 hover:border-[#01396C] hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif font-bold text-base text-foreground group-hover:text-[#01396C] transition-colors">{title}</p>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">{description}</p>
        </div>
        <span className="text-xs font-mono text-[#01396C]">View →</span>
      </div>
      {isLoading ? (
        <div className="mt-4 h-10 bg-[#faf9f6] rounded animate-pulse" />
      ) : (
        <div className="mt-4 flex items-end gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">YTD {new Date().getFullYear()}</p>
            <p className="text-2xl font-serif font-bold tabular-nums mt-0.5">{ytd.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-mono">{unit}</p>
          </div>
          <div className="pb-1">
            <p className={`text-sm font-medium font-mono ${isNeutral ? "text-gray-400" : isIncrease ? "text-red-600" : "text-blue-600"}`}>
              {isNeutral ? "—" : isIncrease ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 font-mono">vs prior year</p>
          </div>
        </div>
      )}
    </Link>
  );
}

export default function OverviewPage() {
  const { filtered: crimeFiltered, isLoading: crimeLoading } = useCrimeData();
  const { filtered: trafficFiltered, isLoading: trafficLoading } = useTrafficData();
  const { filtered: cfsFiltered, isLoading: cfsLoading } = useCfsData();

  const crime = crimeFiltered.length > 0 ? crimeYTD(crimeFiltered) : { ytdCurrent: 0, ytdPrior: 0, pctChange: 0 };
  const traffic = trafficFiltered.length > 0 ? trafficYTD(trafficFiltered) : { ytdCurrent: 0, ytdPrior: 0, pctChange: 0 };
  const cfs = cfsFiltered.length > 0 ? cfsYTD(cfsFiltered) : { ytdCurrent: 0, ytdPrior: 0, pctChange: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">San Francisco Public Safety</h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Crime incidents, calls for service, and traffic collisions — powered by{" "}
          <a href="https://data.sfgov.org" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">
            DataSF
          </a>
          . Data updated daily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DomainCard
          href="/crime"
          title="Crime"
          description="All reported incidents from SFPD, 2022–present"
          ytd={crime.ytdCurrent}
          prior={crime.ytdPrior}
          pct={crime.pctChange}
          unit="incidents"
          isLoading={crimeLoading}
        />
        <DomainCard
          href="/cfs"
          title="Calls for Service"
          description="SFPD dispatch calls and response times"
          ytd={cfs.ytdCurrent}
          prior={cfs.ytdPrior}
          pct={cfs.pctChange}
          unit="calls"
          isLoading={cfsLoading}
        />
        <DomainCard
          href="/traffic"
          title="Traffic Collisions"
          description="All reported collisions by severity and location"
          ytd={traffic.ytdCurrent}
          prior={traffic.ytdPrior}
          pct={traffic.pctChange}
          unit="collisions"
          isLoading={trafficLoading}
        />
      </div>

      <div className="border border-[#e8e8e8] rounded-lg bg-white p-5">
        <Link href="/map" className="flex items-center justify-between group">
          <div>
            <p className="font-serif font-bold text-base group-hover:text-[#01396C] transition-colors">Incident Map</p>
            <p className="text-sm text-muted-foreground font-sans mt-0.5">
              Browse the last 90 days of crime incidents plotted on an interactive map of San Francisco.
            </p>
          </div>
          <span className="text-xs font-mono text-[#01396C] whitespace-nowrap ml-4">Open map →</span>
        </Link>
      </div>

      <div className="text-xs text-muted-foreground font-mono border-t border-[#e8e8e8] pt-4">
        Source: San Francisco Police Department via DataSF open data portal. Counts reflect reported incidents and may differ from official press releases. Data subject to change.
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/crime", label: "Crime" },
  { href: "/map", label: "Map" },
  { href: "/cfs", label: "Calls for Service" },
  { href: "/traffic", label: "Traffic" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-[1100] bg-[#01396C] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-12">
        <Link href="/" className="font-serif font-bold text-sm tracking-wide whitespace-nowrap">
          SF Public Safety
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-sans font-medium whitespace-nowrap transition-colors",
                pathname === item.href
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

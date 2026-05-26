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
    <header className="sticky top-0 z-[1100] shadow-md" style={{ backgroundColor: "#0a1433" }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-12 text-white">
        <Link href="/" className="font-sans font-bold text-sm tracking-wide whitespace-nowrap" style={{ color: "#e8bb29" }}>
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
      <div style={{ height: "3px", backgroundColor: "#e8bb29" }} />
    </header>
  );
}

import type { Metadata } from "next";
import { Libre_Baskerville, Roboto_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";

const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

const sans = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "San Francisco Crime Dashboard",
  description: "San Francisco public safety data — crime, calls for service, and traffic. Built by AH Datalytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground font-mono">
          Data source: DataSF / SFPD &mdash; Built by{" "}
          <a href="https://ahdatalytics.com" className="underline hover:text-foreground">
            AH Datalytics
          </a>
        </footer>
      </body>
    </html>
  );
}

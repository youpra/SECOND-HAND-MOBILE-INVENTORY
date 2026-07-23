import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "RITCHIE STREET — Second Hand Mobiles Chennai",
  description: "Buy verified second-hand smartphones or get your mobile repaired at Ritchie Street, Chennai. Live inventory with real prices and battery health.",
  keywords: ["second hand mobile Chennai", "used phones", "mobile repair", "Ritchie Street"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--c-bg)", color: "var(--c-text-1)" }}>
        <Header />
        <main style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

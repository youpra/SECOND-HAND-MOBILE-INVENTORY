import React from "react";
import Link from "next/link";
import { getSiteCategories, getSiteSettings } from "@/lib/payload-data";
import { IconRenderer } from "./IconRenderer";
import { MessageSquare, Shield, Menu } from "lucide-react";

export async function Header() {
  const categories = await getSiteCategories();
  const settings = await getSiteSettings();

  const whatsappLink = `https://wa.me/${settings.whatsappNumber?.replace(/[^0-9]/g, "")}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              SecondHand
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                {" "}
                Mobiles
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              All Inventory
            </Link>
            {categories.slice(0, 4).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.slug}`}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <IconRenderer name={cat.icon} className="h-4 w-4 text-red-500" />
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Shield className="h-3.5 w-3.5 text-red-500" />
            Admin Panel
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 transition-all hover:scale-105"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chat on WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}

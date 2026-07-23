import React from "react";
import Link from "next/link";
import { getSiteCategories, getSiteSettings } from "@/lib/payload-data";
import { MessageSquare, Shield, Clock, MapPin } from "lucide-react";

export async function Footer() {
  const categories = await getSiteCategories();
  const settings = await getSiteSettings();

  const whatsappLink = `https://wa.me/${settings.whatsappNumber?.replace(/[^0-9]/g, "")}`;

  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <span className="text-lg font-extrabold tracking-tight text-white">
              SecondHand
              <span className="text-red-500">
                {" "}
                Mobiles
              </span>
            </span>
            <p className="text-sm text-slate-500 leading-relaxed">
              Find verified pre-owned smartphones and premium mobile repair services. Check availability
              instantly and contact us directly to purchase.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    href={`/?category=${cat.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support and Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <MessageSquare className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-emerald-400 font-medium"
                >
                  WhatsApp Inquiry
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span>Open: 10 AM - 9 PM Daily</span>
              </li>
            </ul>
          </div>

          {/* Store Locations / Future note */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Inventory Assurance
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Our inventory is updated in real-time. Avoid unnecessary WhatsApp back-and-forth by checking Availability tags.
            </p>
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg p-3">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span>Genuinely checked devices only.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} SecondHand Mobiles & Repairing. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:text-slate-300">
              Admin Login
            </Link>
            <span className="text-slate-800">|</span>
            <span className="text-slate-600">Production Inventory System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

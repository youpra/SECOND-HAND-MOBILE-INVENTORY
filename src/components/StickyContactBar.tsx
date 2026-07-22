"use client";

import React, { useState } from "react";
import { MessageSquare, Phone, Copy, Share2, Link as LinkIcon, Check } from "lucide-react";

interface StickyContactBarProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    color?: string;
    storage?: string;
  };
  settings: {
    whatsappNumber: string;
    contactPhoneNumber: string;
  };
}

export function StickyContactBar({ product, settings }: StickyContactBarProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate WhatsApp message with context details
  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in buying the ${product.title} (${product.storage || ""}, ${
      product.color || ""
    }) listed for $${product.price} on your inventory website. Is it still available?`
  );
  
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber?.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`;

  // Log contact clicks
  const logContactClick = (type: "whatsapp" | "call") => {
    fetch(`/api/products/${product.id}/contacts?type=${type}`, {
      method: "POST",
    }).catch((err) => console.error("Contact analytics log failed:", err));
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(settings.contactPhoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/products/${product.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/products/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this pre-owned ${product.title} for $${product.price}!`,
          url: link,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      {/* Sticky Sidebar widget for Desktop */}
      <div className="hidden lg:flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm sticky top-24 w-full">
        <h3 className="font-extrabold text-white text-lg">Interested in this item?</h3>
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
          Contact the seller directly. Availability status is updated instantly in our database.
        </p>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logContactClick("whatsapp")}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-500 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <MessageSquare className="h-4.5 w-4.5" />
          Chat on WhatsApp
        </a>

        {/* Call Button */}
        <a
          href={`tel:${settings.contactPhoneNumber}`}
          onClick={() => logContactClick("call")}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.99]"
        >
          <Phone className="h-4.5 w-4.5 text-indigo-400" />
          Direct Voice Call
        </a>

        {/* Actions grid */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-slate-850">
          <button
            onClick={handleCopyPhone}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-slate-850/60 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
          >
            {copiedPhone ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Phone
              </>
            )}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-slate-850/60 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Product
          </button>
        </div>

        <button
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-slate-850/60 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
        >
          {copiedLink ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Product Link Copied
            </>
          ) : (
            <>
              <LinkIcon className="h-3.5 w-3.5" />
              Copy Product Link
            </>
          )}
        </button>
      </div>

      {/* Floating Bottom Contact Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-850 bg-slate-950/95 backdrop-blur-md px-4 py-3 shadow-2xl flex items-center gap-3">
        {/* WhatsApp Icon/CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logContactClick("whatsapp")}
          className="flex-grow flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-all"
        >
          <MessageSquare className="h-4.5 w-4.5" />
          WhatsApp
        </a>

        {/* Voice Call CTA */}
        <a
          href={`tel:${settings.contactPhoneNumber}`}
          onClick={() => logContactClick("call")}
          className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-300 hover:text-white"
        >
          <Phone className="h-5 w-5 text-indigo-400" />
        </a>

        {/* Share CTA */}
        <button
          onClick={handleShare}
          className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-300 hover:text-white"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}

"use client";
import React, { useState } from "react";
import { MessageSquare, Copy, Share2, Link as LinkIcon, Check, Phone } from "lucide-react";

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

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in buying the ${product.title} (${product.storage || ""}, ${product.color || ""}) listed for ₹${product.price}. Is it still available?`
  );
  const waNumber = settings.whatsappNumber?.replace(/[^0-9]/g, "") || "917695892772";
  const whatsappUrl = `https://wa.me/${waNumber}?text=${whatsappMsg}`;

  const logContact = (type: "whatsapp" | "call") => {
    fetch(`/api/products/${product.id}/contacts?type=${type}`, { method: "POST" }).catch(() => {});
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(settings.contactPhoneNumber || "7695892772");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/products/${product.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/products/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, text: `Check out this ${product.title} for ₹${product.price}`, url: link });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const btnBase: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
    cursor: "pointer", border: "1px solid var(--border-light)",
    background: "var(--off-white)", color: "var(--gray-2)",
    transition: "background 0.15s, color 0.15s",
    fontFamily: "inherit",
  };

  return (
    <>
      {/* ── Desktop sidebar widget ── */}
      <div style={{
        display: "none",
        flexDirection: "column", gap: 12,
        background: "#fff",
        border: "1px solid var(--border-light)",
        borderRadius: 12, padding: 20,
        position: "sticky", top: 96,
      }} className="scb-desktop">

        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--dark)", marginBottom: 4 }}>
            Interested in this item?
          </div>
          <p style={{ fontSize: 12, color: "var(--gray-2)", lineHeight: 1.6 }}>
            Contact the seller directly. Availability is updated instantly.
          </p>
        </div>

        {/* WhatsApp CTA */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          onClick={() => logContact("whatsapp")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px", borderRadius: 8,
            background: "#16a34a", color: "#fff",
            fontSize: 13, fontWeight: 800, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(22,163,74,0.2)",
          }}>
          <MessageSquare size={16} />
          Chat on WhatsApp
        </a>

        {/* Secondary actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={handleCopyPhone} style={btnBase}>
            {copiedPhone ? <><Check size={13} color="#15803d" /> Copied!</> : <><Copy size={13} /> Copy Phone</>}
          </button>
          <button onClick={handleShare} style={btnBase}>
            <Share2 size={13} /> Share
          </button>
        </div>

        <button onClick={handleCopyLink} style={{ ...btnBase, width: "100%" }}>
          {copiedLink ? <><Check size={13} color="#15803d" /> Link Copied!</> : <><LinkIcon size={13} /> Copy Product Link</>}
        </button>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
        background: "#fff",
        borderTop: "1px solid var(--border-light)",
        padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      }} className="scb-mobile">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          onClick={() => logContact("whatsapp")}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px", borderRadius: 8,
            background: "#16a34a", color: "#fff",
            fontSize: 13, fontWeight: 800, textDecoration: "none",
          }}>
          <MessageSquare size={15} />
          WhatsApp
        </a>
        <button onClick={handleShare} style={{
          width: 46, height: 46, borderRadius: 8, flexShrink: 0,
          background: "var(--off-white)", border: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--gray-2)",
        }}>
          <Share2 size={18} />
        </button>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .scb-desktop { display: flex !important; }
          .scb-mobile  { display: none !important; }
        }
      `}</style>
    </>
  );
}

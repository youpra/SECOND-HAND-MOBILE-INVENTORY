"use client";
import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";

interface ProductCardProps {
  product: any;
}

function getYtThumb(ytUrl: string): string | null {
  const m = String(ytUrl || "").match(/^.*(youtu\.be\/|v\/|shorts\/|watch\?v=|&v=)([^#&?]{11})/);
  return m ? `https://i.ytimg.com/vi/${m[2]}/hqdefault.jpg` : null;
}

function resolveImg(product: any): string {
  const img = product.mainImage;
  if (img) {
    const fn = typeof img === "object" ? img.filename : null;
    if (fn) return `/media/${fn}`;
    const u = typeof img === "object" ? img.url : img;
    if (u) return String(u).replace("/api/media/file/", "/media/");
  }
  return getYtThumb(product.youtubeShortsUrl) || "/media/logo.png";
}

const STATUS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  available:      { label: "Available",    color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  reserved:       { label: "Reserved",     color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  sold:           { label: "Sold",         color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  "out-of-stock": { label: "Out of Stock", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  repairing:      { label: "Repairing",    color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  "coming-soon":  { label: "Coming Soon",  color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
};

const CONDITION_LABEL: Record<string, string> = {
  "like-new": "Like\nNew", excellent: "Excel\nlent", good: "Good", fair: "Fair",
};

export function ProductCard({ product }: ProductCardProps) {
  const isSold  = product.status === "sold";
  const isGone  = isSold || product.status === "out-of-stock";
  const s       = STATUS[product.status] ?? { label: "—", color: "#999", bg: "#f9f9f9", border: "#eee" };
  const brand   = typeof product.brand === "object" ? product.brand?.name : "—";
  const condKey = product.condition as string;
  const condLabel = CONDITION_LABEL[condKey] || product.condition || "";
  const img     = resolveImg(product);
  const discount = product.originalLaunchPrice > product.price
    ? Math.round(((product.originalLaunchPrice - product.price) / product.originalLaunchPrice) * 100)
    : null;

  const card = (
    <article className="pc" style={{
      background: "#fff",
      border: "1px solid var(--border-light)",
      borderRadius: 10,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxShadow: "var(--shadow-card)",
    }}>

      {/* ── Image block ── */}
      <div style={{ position: "relative", aspectRatio: "9/16", background: "#f5f5f5", overflow: "hidden", flexShrink: 0 }}>

        {/* Gone overlay */}
        {isGone && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(255,255,255,0.6)" }} />
        )}

        {/* Status badge top-left */}
        <span style={{
          position: "absolute", top: 8, left: 8, zIndex: 20,
          fontSize: 9, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase",
          padding: "2px 7px", borderRadius: 4,
          color: s.color, background: s.bg, border: `1px solid ${s.border}`,
        }}>{s.label}</span>

        {/* Discount badge top-left below status when available */}
        {discount && !isGone && (
          <span style={{
            position: "absolute", top: 30, left: 8, zIndex: 20,
            fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4,
            color: "#fff", background: "var(--red)",
          }}>-{discount}%</span>
        )}

        {/* Gold circular condition badge top-right */}
        {condLabel && !isGone && (
          <div className="badge-condition">
            {condLabel.split("\n").map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
          </div>
        )}

        {/* Sold stamp */}
        {isGone && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", zIndex: 20,
            padding: "5px 14px", borderRadius: 6,
            background: "rgba(255,255,255,0.96)", border: "1px solid #e5e7eb",
            color: "#374151", fontSize: 10, fontWeight: 800,
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>{isSold ? "SOLD" : "UNAVAILABLE"}</div>
        )}

        <img
          className="pc-img"
          src={img}
          alt={product.title}
          loading="lazy"
          style={{
            width: "100%", height: "100%",
            objectFit: "contain", padding: 8,
            filter: isGone ? "grayscale(0.6) opacity(0.55)" : "none",
          }}
        />
      </div>

      {/* ── Info block ── */}
      <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 5, flexGrow: 1 }}>
        {/* Brand */}
        <span style={{
          fontSize: 10, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.07em", color: "var(--gray-3)",
        }}>{brand}</span>

        {/* Title */}
        <h3 style={{
          fontSize: 12, fontWeight: 700, lineHeight: 1.35,
          color: "var(--dark)",
          display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{product.title}</h3>

        {/* Price */}
        <div style={{ marginBottom: 4 }}>
          {product.originalLaunchPrice > product.price && (
            <div style={{ fontSize: 10, textDecoration: "line-through", color: "var(--gray-2)" }}>
              ₹{Number(product.originalLaunchPrice).toLocaleString("en-IN")}
            </div>
          )}
          <div style={{ fontSize: 16, fontWeight: 900, color: "var(--dark)", letterSpacing: "-0.02em" }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>
        </div>

        {/* More Info button */}
        {!isSold ? (
          <div className="btn-moreinfo" style={{ marginTop: "auto" }}>
            <Info size={11} />
            More Info
          </div>
        ) : (
          <div style={{
            marginTop: "auto", padding: "9px",
            background: "#f9fafb", borderRadius: 6,
            textAlign: "center", fontSize: 11, fontWeight: 700,
            color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase",
          }}>Sold Out</div>
        )}
      </div>
    </article>
  );

  if (isSold) return <div style={{ height: "100%" }}>{card}</div>;
  return (
    <Link href={`/products/${product.slug}`} style={{ display: "block", height: "100%", textDecoration: "none" }}>
      {card}
    </Link>
  );
}

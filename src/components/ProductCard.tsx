"use client";
import React from "react";

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

const CONDITION: Record<string, string> = {
  "like-new": "Like New", excellent: "Excellent", good: "Good", fair: "Fair",
};

export function ProductCard({ product }: ProductCardProps) {
  const isSold   = product.status === "sold";
  const isGone   = isSold || product.status === "out-of-stock";
  const s        = STATUS[product.status] ?? { label: "—", color: "#999", bg: "#f9f9f9", border: "#eee" };
  const brand    = typeof product.brand === "object" ? product.brand?.name : "—";
  const cond     = CONDITION[product.condition] || product.condition || "";
  const img      = resolveImg(product);
  const discount = product.originalLaunchPrice > product.price
    ? Math.round(((product.originalLaunchPrice - product.price) / product.originalLaunchPrice) * 100)
    : null;

  const card = (
    <article
      style={{
        background: "#fff",
        border: "1px solid var(--c-border)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: isSold ? "not-allowed" : "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
        position: "relative",
      }}
      onMouseEnter={e => {
        if (isGone) return;
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* ── Image block ── */}
      <div style={{ position: "relative", aspectRatio: "9/16", background: "#f8f8f8", overflow: "hidden", flexShrink: 0 }}>
        {/* Dim overlay when unavailable */}
        {isGone && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(255,255,255,0.65)", backdropFilter: "blur(1px)" }} />
        )}

        {/* Status badge */}
        <span style={{
          position: "absolute", top: 8, left: 8, zIndex: 20,
          fontSize: 9, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
          padding: "2px 7px", borderRadius: 4,
          color: s.color, background: s.bg, border: `1px solid ${s.border}`,
        }}>{s.label}</span>

        {/* Discount badge */}
        {discount && !isGone && (
          <span style={{
            position: "absolute", top: 8, right: 8, zIndex: 20,
            fontSize: 9, fontWeight: 800, letterSpacing: "0.04em",
            padding: "2px 7px", borderRadius: 4,
            color: "#fff", background: "var(--c-red)",
          }}>-{discount}%</span>
        )}

        {/* Sold stamp */}
        {isGone && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", zIndex: 20,
            padding: "5px 14px", borderRadius: 6,
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e5e7eb",
            color: "#374151", fontSize: 10, fontWeight: 800,
            letterSpacing: "0.12em", textTransform: "uppercase",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>{isSold ? "SOLD" : "UNAVAILABLE"}</div>
        )}

        <img
          src={img}
          alt={product.title}
          loading="lazy"
          style={{
            width: "100%", height: "100%",
            objectFit: "contain",
            padding: "6px",
            filter: isGone ? "grayscale(0.7) opacity(0.6)" : "none",
            transition: "transform 0.35s ease",
          }}
          onMouseEnter={e => { if (!isGone) (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
        />
      </div>

      {/* ── Info block ── */}
      <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 5, flexGrow: 1 }}>
        {/* Brand + Condition */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-red)" }}>
            {brand}
          </span>
          {cond && (
            <span style={{
              fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
              padding: "1px 6px", borderRadius: 3,
              background: "var(--c-elevated)", border: "1px solid var(--c-border)",
              color: "var(--c-text-2)",
            }}>{cond}</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 12, fontWeight: 700, lineHeight: 1.35,
          color: "var(--c-text-1)",
          display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{product.title}</h3>

        {/* Specs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 2 }}>
          {product.storage && <SpecTag>{product.storage}</SpecTag>}
          {product.ram && <SpecTag>{product.ram} RAM</SpecTag>}
          {product.batteryHealth && <SpecTag green>⚡ {product.batteryHealth}% BH</SpecTag>}
        </div>

        {/* Price row */}
        <div style={{
          marginTop: "auto", paddingTop: 8,
          borderTop: "1px solid var(--c-border-s)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        }}>
          <div>
            {product.originalLaunchPrice > product.price && (
              <div style={{ fontSize: 10, textDecoration: "line-through", color: "var(--c-text-3)", lineHeight: 1 }}>
                ₹{Number(product.originalLaunchPrice).toLocaleString("en-IN")}
              </div>
            )}
            <div style={{ fontSize: 15, fontWeight: 900, color: "var(--c-text-1)", lineHeight: 1.2 }}>
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>
          </div>
          {!isGone && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: "var(--c-red)", textDecoration: "none",
              letterSpacing: "0.02em",
            }}>View →</span>
          )}
        </div>
      </div>
    </article>
  );

  if (isSold) return <div style={{ height: "100%" }}>{card}</div>;
  return (
    <a href={`/products/${product.slug}`} style={{ display: "block", height: "100%", textDecoration: "none" }}>
      {card}
    </a>
  );
}

function SpecTag({ children, green }: { children: React.ReactNode; green?: boolean }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, letterSpacing: "0.02em",
      padding: "2px 6px", borderRadius: 3,
      background: green ? "#f0fdf4" : "var(--c-elevated)",
      border: green ? "1px solid #bbf7d0" : "1px solid var(--c-border)",
      color: green ? "#15803d" : "var(--c-text-2)",
    }}>{children}</span>
  );
}

import React from "react";
import Link from "next/link";
import { getSiteBrands } from "@/lib/payload-data";
import { Search, User, MessageSquare, Youtube, Send } from "lucide-react";

export async function Header() {
  const brands = await getSiteBrands();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>

      {/* ── Row 1: Logo + Search + Actions ── */}
      <div style={{ background: "var(--dark)", borderBottom: "1px solid var(--border-dark)" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 16px", height: 54,
          display: "flex", alignItems: "center", gap: 10,
        }}>

          {/* Logo */}
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 8,
            textDecoration: "none", flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32, background: "var(--gold)",
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 15, color: "var(--dark)",
            }}>R</div>
            <span style={{ fontSize: 14, fontWeight: 800, color: "var(--white)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
              Ritchie Street
            </span>
          </Link>

          {/* Search — hidden on <480px via CSS class */}
          <form action="/" method="GET" className="search-wrap hdr-search" style={{ flex: 1, minWidth: 0, maxWidth: 400 }}>
            <input
              className="search-input"
              type="text" name="search"
              placeholder="Search phones..."
              autoComplete="off"
            />
            <button className="search-btn" type="submit" aria-label="Search">
              <Search size={13} color="var(--dark)" />
            </button>
          </form>

          {/* Spacer — pushes actions right on xs when search hidden */}
          <div style={{ flexGrow: 1 }} />

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Link href="/admin" aria-label="Admin"
              style={{ color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center" }}>
              <User size={18} />
            </Link>
            <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 12px", borderRadius: 6,
                background: "#16a34a", color: "#fff",
                fontSize: 12, fontWeight: 700,
                textDecoration: "none", whiteSpace: "nowrap",
              }}>
              <MessageSquare size={13} />
              <span className="hdr-contact-label">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Row 2: Brand nav tabs + social links ── */}
      <div style={{
        background: "var(--dark-2)",
        borderBottom: "1px solid var(--border-dark)",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 16px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          minWidth: "max-content",
        }}>
          {/* Brand tabs — always scrollable */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" className="nav-tab active">All Phones</Link>
            {brands.slice(0, 6).map((b: any) => (
              <Link key={b.id} href={`/?brand=${b.slug}`} className="nav-tab">
                {b.name}
              </Link>
            ))}
          </div>

          {/* Social links — hidden on mobile */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }} className="hide-mobile">
            <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer" className="social-nav">
              <MessageSquare size={12} color="#22c55e" />WhatsApp Catalog
            </a>
            <a href="https://www.youtube.com/@RITCHIE-STREET-CHANNEL" target="_blank" rel="noopener noreferrer" className="social-nav">
              <Youtube size={12} color="#dc2626" />YouTube
            </a>
            <a href="https://t.me/VJt6D3tw_K9jYjQ9" target="_blank" rel="noopener noreferrer" className="social-nav">
              <Send size={12} color="#38bdf8" />Telegram
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

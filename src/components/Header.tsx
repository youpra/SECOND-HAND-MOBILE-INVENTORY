import React from "react";
import Link from "next/link";
import { getSiteBrands } from "@/lib/payload-data";
import { Search, User, MessageSquare, Youtube, Send } from "lucide-react";

export async function Header() {
  const brands = await getSiteBrands();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%" }}>

      {/* ── Row 1: Logo + Search + WhatsApp ── */}
      <div style={{ background: "var(--dark)", borderBottom: "1px solid var(--border-dark)", width: "100%" }}>
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
              fontWeight: 900, fontSize: 15, color: "var(--dark)", flexShrink: 0,
            }}>R</div>
            <span style={{
              fontSize: 14, fontWeight: 800, color: "var(--white)",
              letterSpacing: "-0.01em", whiteSpace: "nowrap",
            }}>Ritchie Street</span>
          </Link>

          {/* Search bar — flex:1 grows to fill space, hidden on xs via CSS */}
          <form action="/" method="GET" className="hdr-search" style={{
            position: "relative", flex: 1, minWidth: 0,
          }}>
            <input
              style={{
                width: "100%", padding: "8px 38px 8px 12px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid var(--border-dark)",
                borderRadius: 6, color: "var(--white)",
                fontSize: 13, fontFamily: "inherit", outline: "none",
              }}
              type="text" name="search"
              placeholder="Search phones..."
              autoComplete="off"
            />
            <button type="submit" aria-label="Search" style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              padding: "0 12px", background: "var(--gold)",
              border: "none", borderRadius: "0 6px 6px 0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Search size={13} color="var(--dark)" />
            </button>
          </form>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
            <Link href="/admin" aria-label="Admin" style={{
              color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center",
            }}>
              <User size={18} />
            </Link>
            <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "7px 12px", borderRadius: 6,
                background: "#16a34a", color: "#fff",
                fontSize: 12, fontWeight: 700,
                textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
              }}>
              <MessageSquare size={13} />
              <span className="hdr-contact-label">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Row 2: Brand tabs (scrollable) ── */}
      <div style={{
        background: "var(--dark-2)",
        borderBottom: "1px solid var(--border-dark)",
        width: "100%",
        /* The row itself scrolls horizontally — content inside is wider than viewport */
        overflowX: "auto",
        overflowY: "visible",
        WebkitOverflowScrolling: "touch",
      }}>
        {/* This inner div must NOT exceed 100vw — let it be flex and scroll */}
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 16px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* Brand tabs — naturally wider than mobile, parent scrolls */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Link href="/" className="nav-tab active">All Phones</Link>
            {brands.slice(0, 6).map((b: any) => (
              <Link key={b.id} href={`/?brand=${b.slug}`} className="nav-tab">
                {b.name}
              </Link>
            ))}
          </div>

          {/* Social links — hidden on mobile */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0, marginLeft: 16 }} className="hide-mobile">
            <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer" className="social-nav">
              <MessageSquare size={12} color="#22c55e" />WhatsApp
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

import React from "react";
import Link from "next/link";
import { getSiteBrands, getSiteSettings } from "@/lib/payload-data";
import { Search, User, MessageSquare, Youtube, Send } from "lucide-react";

export async function Header() {
  const brands = await getSiteBrands();
  const settings = await getSiteSettings();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>

      {/* ── Row 1: Logo + Search + Actions ── */}
      <div style={{ background: "var(--dark)", borderBottom: "1px solid var(--border-dark)" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 20px", height: 58,
          display: "flex", alignItems: "center", gap: 16,
        }}>

          {/* Logo box */}
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 8,
            textDecoration: "none", flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34,
              background: "var(--gold)",
              borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 16, color: "var(--dark)",
            }}>R</div>
            <span style={{
              fontSize: 15, fontWeight: 800, color: "var(--white)",
              letterSpacing: "-0.01em",
            }}>Ritchie Street</span>
          </Link>

          {/* Search bar */}
          <div className="search-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              readOnly
              onClick={() => { window.location.href = "/"; }}
            />
            <button className="search-btn" aria-label="Search">
              <Search size={14} color="var(--dark)" />
            </button>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
            <Link href="/admin" style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13,
            }}>
              <User size={18} />
            </Link>
            <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer"
              className="btn-dark">
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* ── Row 2: Brand nav tabs + social links ── */}
      <div style={{
        background: "var(--dark-2)",
        borderBottom: "1px solid var(--border-dark)",
        overflowX: "auto",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 20px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Brand tabs */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" className="nav-tab active">All Phones</Link>
            {brands.slice(0, 5).map((b: any) => (
              <Link key={b.id} href={`/?brand=${b.slug}`} className="nav-tab">
                {b.name}
              </Link>
            ))}
          </div>

          {/* Social nav */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }} className="hide-mobile">
            <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer" className="social-nav">
              <MessageSquare size={13} color="#22c55e" />
              WhatsApp Catalog
            </a>
            <a href="https://www.youtube.com/@RITCHIE-STREET-CHANNEL" target="_blank" rel="noopener noreferrer" className="social-nav">
              <Youtube size={13} color="#dc2626" />
              YouTube
            </a>
            <a href="https://t.me/VJt6D3tw_K9jYjQ9" target="_blank" rel="noopener noreferrer" className="social-nav">
              <Send size={13} color="#38bdf8" />
              Telegram
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

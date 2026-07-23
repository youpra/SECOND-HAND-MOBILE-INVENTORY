import React from "react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/payload-data";
import { MessageSquare, Shield } from "lucide-react";

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "#ffffff",
      borderBottom: "1px solid var(--c-border)",
      boxShadow: "0 1px 0 var(--c-border)",
    }}>
      {/* ── Top red announcement strip ── */}
      <div style={{
        background: "var(--c-red)",
        color: "#fff",
        textAlign: "center",
        fontSize: 11,
        fontWeight: 600,
        padding: "5px 16px",
        letterSpacing: "0.02em",
      }}>
        📍 Near Ritchie Street, Chennai&nbsp;600002&nbsp;&nbsp;·&nbsp;&nbsp;
        📞 7695892772&nbsp;&nbsp;·&nbsp;&nbsp;
        Subscribe on&nbsp;
        <a href="https://www.youtube.com/@RITCHIE-STREET-CHANNEL" target="_blank" rel="noopener noreferrer"
          style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: 2 }}>
          YouTube
        </a>
        &nbsp;for new arrivals!
      </div>

      {/* ── Main nav row ── */}
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 20px",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src="/media/logo.png"
              alt="RITCHIE STREET"
              style={{ height: 38, width: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--c-red)" }}
            />
            <span
              className="live-dot"
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 9, height: 9, borderRadius: "50%",
                background: "var(--c-green)", border: "2px solid #fff",
              }}
            />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--c-text-1)" }}>
              RITCHIE <span style={{ color: "var(--c-red)" }}>STREET</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 500, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Second Hand Mobiles
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
          {[
            { href: "/", label: "All Phones" },
            { href: "https://wa.me/c/917695892772", label: "WhatsApp Catalog", external: true },
            { href: "https://www.youtube.com/@RITCHIE-STREET-CHANNEL", label: "YouTube", external: true },
            { href: "https://t.me/VJt6D3tw_K9jYjQ9", label: "Telegram", external: true },
          ].map(({ href, label, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{
                fontSize: 13, fontWeight: 500, color: "var(--c-text-2)",
                padding: "6px 12px", borderRadius: 6,
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--c-text-1)"; (e.currentTarget as HTMLElement).style.background = "var(--c-elevated)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--c-text-2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link
            href="/admin"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, color: "var(--c-text-2)",
              padding: "7px 14px", borderRadius: 7,
              border: "1px solid var(--c-border)", background: "var(--c-elevated)",
              textDecoration: "none", transition: "all 0.15s",
            }}
          >
            <Shield size={13} color="var(--c-red)" />
            <span style={{ display: "none" }} className="sm-show">Admin</span>
          </Link>

          <a
            href="https://wa.me/c/917695892772"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              fontSize: 13, fontWeight: 700, color: "#fff",
              padding: "8px 16px", borderRadius: 8,
              background: "#16a34a",
              textDecoration: "none",
              boxShadow: "0 2px 10px rgba(22,163,74,0.25)",
              transition: "background 0.15s, transform 0.1s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#15803d"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#16a34a"; }}
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 640px) { .sm-show { display: inline !important; } }
      `}</style>
    </header>
  );
}

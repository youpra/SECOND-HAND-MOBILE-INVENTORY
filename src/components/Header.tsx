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
    }}>
      {/* ── Red announcement strip ── */}
      <div style={{
        background: "var(--c-red)", color: "#fff",
        textAlign: "center", fontSize: 11, fontWeight: 600,
        padding: "5px 16px", letterSpacing: "0.02em",
      }}>
        📍 Near Ritchie Street, Chennai 600002&nbsp;&nbsp;·&nbsp;&nbsp;
        📞 7695892772&nbsp;&nbsp;·&nbsp;&nbsp;
        Subscribe on&nbsp;
        <a href="https://www.youtube.com/@RITCHIE-STREET-CHANNEL"
          target="_blank" rel="noopener noreferrer"
          style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: 2 }}>
          YouTube
        </a>
        &nbsp;for new arrivals!
      </div>

      {/* ── Main nav row ── */}
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 20px", height: 60,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16,
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <img src="/media/logo.png" alt="RITCHIE STREET"
              style={{ height: 38, width: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--c-red)" }} />
            <span className="live-dot" style={{
              position: "absolute", bottom: 0, right: 0,
              width: 9, height: 9, borderRadius: "50%",
              background: "var(--c-green)", border: "2px solid #fff",
              display: "block",
            }} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--c-text-1)" }}>
              RITCHIE <span style={{ color: "var(--c-red)" }}>STREET</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 500, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Second Hand Mobiles
            </div>
          </div>
        </Link>

        {/* Desktop Nav — CSS hover via .nav-link class */}
        <nav className="desktop-nav" style={{ alignItems: "center", gap: 4 }}>
          {[
            { href: "/", label: "All Phones", ext: false },
            { href: "https://wa.me/c/917695892772", label: "WhatsApp Catalog", ext: true },
            { href: "https://www.youtube.com/@RITCHIE-STREET-CHANNEL", label: "YouTube", ext: true },
            { href: "https://t.me/VJt6D3tw_K9jYjQ9", label: "Telegram", ext: true },
          ].map(({ href, label, ext }) => (
            <a key={label} href={href}
              {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="nav-link"
              style={{
                fontSize: 13, fontWeight: 500, color: "var(--c-text-2)",
                padding: "6px 12px", borderRadius: 6,
                textDecoration: "none", display: "inline-block",
              }}>
              {label}
            </a>
          ))}
        </nav>

        {/* Right CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link href="/admin"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, color: "var(--c-text-2)",
              padding: "7px 12px", borderRadius: 7,
              border: "1px solid var(--c-border)", background: "var(--c-elevated)",
              textDecoration: "none",
            }}>
            <Shield size={13} color="var(--c-red)" />
            <span>Admin</span>
          </Link>
          <a href="https://wa.me/c/917695892772"
            target="_blank" rel="noopener noreferrer"
            className="btn-wa">
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}

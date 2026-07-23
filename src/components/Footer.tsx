import React from "react";
import Link from "next/link";
import { getSiteCategories } from "@/lib/payload-data";

export async function Footer() {
  const categories = await getSiteCategories();

  return (
    <footer style={{ background: "var(--dark-2)", borderTop: "1px solid var(--border-dark)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 20px 24px" }}>

        {/* ── 3-column grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 36, marginBottom: 36,
        }}>

          {/* Quick Links */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.9)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Quick Links
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
              {categories.slice(0, 4).map((cat: any) => (
                <li key={cat.id}>
                  <Link href={`/?category=${cat.slug}`} className="footer-a">{cat.name}</Link>
                </li>
              ))}
              <li><a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer" className="footer-a">WhatsApp Catalog</a></li>
              <li><a href="https://www.youtube.com/@RITCHIE-STREET-CHANNEL" target="_blank" rel="noopener noreferrer" className="footer-a">YouTube</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.9)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Contact
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
              <li><a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer" className="footer-a">Contact Us</a></li>
              <li><a href="https://t.me/VJt6D3tw_K9jYjQ9" target="_blank" rel="noopener noreferrer" className="footer-a">Telegram</a></li>
              <li><Link href="/admin" className="footer-a">Privacy Policy</Link></li>
              <li><Link href="/admin" className="footer-a">About</Link></li>
            </ul>
          </div>

          {/* Brand + Social */}
          <div>
            {/* Logo box */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: "var(--gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 18, color: "var(--dark)", flexShrink: 0,
              }}>R</div>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.01em" }}>
                Ritchie<br />Street
              </span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6, lineHeight: 1.65 }}>
              Ritchie Street roitiamia@gmail.com
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 18, lineHeight: 1.65 }}>
              Call today: +917695892772
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { href: "https://www.facebook.com", icon: "f", label: "Facebook" },
                { href: "https://www.instagram.com", icon: "ig", label: "Instagram" },
                { href: "https://www.youtube.com/@RITCHIE-STREET-CHANNEL", icon: "▶", label: "YouTube" },
                { href: "https://t.me/VJt6D3tw_K9jYjQ9", icon: "✈", label: "Telegram" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >{icon}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 20, borderTop: "1px solid var(--border-dark)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8,
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            Ritchie Street · Premium Street
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} RITCHIE STREET. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

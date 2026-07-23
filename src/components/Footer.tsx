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
              <li><Link href="/privacy-policy" className="footer-a">Privacy Policy</Link></li>
              <li><Link href="/about" className="footer-a">About Us</Link></li>
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

            {/* Social icons — only real links */}
            <div style={{ display: "flex", gap: 10 }}>
              <a href="https://www.youtube.com/@RITCHIE-STREET-CHANNEL"
                target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(220,38,38,0.15)",
                  border: "1px solid rgba(220,38,38,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc2626">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
                </svg>
              </a>
              <a href="https://t.me/VJt6D3tw_K9jYjQ9"
                target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(56,189,248,0.12)",
                  border: "1px solid rgba(56,189,248,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19-2.04 9.6c-.15.67-.54.83-1.1.52l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.22-3.08 5.6-5.06c.24-.22-.05-.34-.38-.12L6.4 14.37l-2.96-.92c-.64-.2-.66-.64.14-.95l11.56-4.46c.53-.19 1 .13.8.95z"/>
                </svg>
              </a>
              <a href="https://wa.me/c/917695892772"
                target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(22,163,74,0.12)",
                  border: "1px solid rgba(22,163,74,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.34z"/>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.1 1.52 5.83L0 24l6.35-1.49A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 22c-1.85 0-3.58-.5-5.08-1.37l-.36-.22-3.77.88.9-3.67-.24-.38A10 10 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10z"/>
                </svg>
              </a>
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

import React from "react";
import Link from "next/link";
import { getSiteCategories } from "@/lib/payload-data";
import { MessageSquare, MapPin, Youtube, Send } from "lucide-react";

export async function Footer() {
  const categories = await getSiteCategories();

  return (
    <footer style={{
      background: "#fff",
      borderTop: "1px solid var(--c-border)",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 32,
          marginBottom: 32,
        }}>

          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src="/media/logo.png" alt="RITCHIE STREET"
                style={{ height: 36, width: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--c-red)" }} />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "var(--c-text-1)" }}>
                  RITCHIE <span style={{ color: "var(--c-red)" }}>STREET</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Second Hand Mobiles
                </div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--c-text-2)", lineHeight: 1.6, maxWidth: 220 }}>
              Verified pre-owned smartphones and mobile repair services. Live inventory updated in real-time.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--c-text-1)", marginBottom: 12 }}>
              Quick Links
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {categories.slice(0, 5).map((cat: any) => (
                <li key={cat.id}>
                  <Link href={`/?category=${cat.slug}`}
                    style={{ fontSize: 13, color: "var(--c-text-2)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--c-red)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--c-text-2)")}
                  >{cat.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/admin"
                  style={{ fontSize: 13, color: "var(--c-text-2)", textDecoration: "none" }}
                >Admin Panel</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--c-text-1)", marginBottom: 12 }}>
              Contact
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#15803d", textDecoration: "none", fontWeight: 600 }}>
                  <MessageSquare size={14} />
                  7695892772
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@RITCHIE-STREET-CHANNEL" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-red)", textDecoration: "none", fontWeight: 600 }}>
                  <Youtube size={14} />
                  YouTube Channel
                </a>
              </li>
              <li>
                <a href="https://t.me/VJt6D3tw_K9jYjQ9" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#0369a1", textDecoration: "none", fontWeight: 600 }}>
                  <Send size={14} />
                  Telegram Channel
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <MapPin size={14} color="var(--c-text-3)" style={{ marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "var(--c-text-2)", lineHeight: 1.4 }}>
                  Near Ritchie Street,<br />Chennai — 600002
                </span>
              </li>
            </ul>
          </div>

          {/* Trust badge */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--c-text-1)", marginBottom: 12 }}>
              Why Us?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "✅ Verified condition ratings",
                "🔋 Real battery health reported",
                "💬 Direct WhatsApp inquiry",
                "📦 Live availability status",
                "🔧 Mobile repair services",
              ].map(text => (
                <div key={text} style={{ fontSize: 12, color: "var(--c-text-2)" }}>{text}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 20,
          borderTop: "1px solid var(--c-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}>
          <span style={{ fontSize: 11, color: "var(--c-text-3)" }}>
            © {new Date().getFullYear()} RITCHIE STREET. All rights reserved.
          </span>
          <span style={{ fontSize: 11, color: "var(--c-text-3)" }}>
            Near Ritchie Street, Chennai - 600002
          </span>
        </div>
      </div>
    </footer>
  );
}

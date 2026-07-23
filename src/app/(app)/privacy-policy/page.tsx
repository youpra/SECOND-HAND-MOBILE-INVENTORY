import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RITCHIE STREET",
  description: "Privacy Policy for Ritchie Street — how we collect, use, and protect your information when you use our second-hand mobile phone inventory website.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "When you browse our website, we may automatically collect basic technical information such as your browser type, device type, pages visited, and time spent on pages. This is used solely for improving the website experience.",
      "When you click the WhatsApp inquiry button, you are redirected to WhatsApp. We do not store your WhatsApp number or personal identity on our servers.",
      "We do not require you to create an account or submit any personal information to browse our inventory.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Information",
    content: [
      "Page view and click data is used to understand which products are most popular and to improve the layout and content of the website.",
      "We track how many times a product's WhatsApp or phone button is clicked (an anonymous counter) to understand product interest. No personal data is attached to these counts.",
      "We do not sell, trade, or rent your personal information to any third parties.",
    ],
  },
  {
    id: "cookies",
    title: "3. Cookies",
    content: [
      "Our website may use essential session cookies to ensure the website functions correctly. These are not used for tracking or advertising purposes.",
      "We do not use any third-party advertising cookies or retargeting pixels.",
      "You can disable cookies through your browser settings. This will not affect your ability to browse our inventory.",
    ],
  },
  {
    id: "third-party-links",
    title: "4. Third-Party Links",
    content: [
      "Our website contains links to external services such as WhatsApp, YouTube, and Telegram. When you click these links, you are subject to the privacy policies of those platforms.",
      "We are not responsible for the privacy practices of these third-party services.",
    ],
  },
  {
    id: "data-security",
    title: "5. Data Security",
    content: [
      "Our website is hosted on Vercel and uses HTTPS encryption for all communications. We follow industry-standard security practices.",
      "Product and inventory data is stored in a secure cloud database (Neon PostgreSQL). We do not store sensitive customer information.",
    ],
  },
  {
    id: "whatsapp-communication",
    title: "6. WhatsApp Communication",
    content: [
      "When you contact us through WhatsApp, your conversation is governed by WhatsApp's Privacy Policy. We use your contact information only to respond to your product inquiry.",
      "We do not add you to any broadcast lists or share your WhatsApp number with third parties without your consent.",
      "You may opt out of communication at any time by simply not responding or blocking the number.",
    ],
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content: [
      "You have the right to request what information we hold about you (if any).",
      "You have the right to request deletion of any personal data we may have collected.",
      "To make any such request, contact us via WhatsApp at +91 76958 92772.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.",
      "Continued use of the website after changes constitutes your acceptance of the revised policy.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: [
      "If you have any questions about this Privacy Policy, please contact us:",
      "📍 Near Ritchie Street, Chennai — 600002",
      "💬 WhatsApp: +91 76958 92772 (https://wa.me/c/917695892772)",
      "📺 YouTube: @RITCHIE-STREET-CHANNEL",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "var(--off-white)", flexGrow: 1 }}>

      {/* ── Dark breadcrumb bar ── */}
      <div style={{ background: "var(--dark-2)", borderBottom: "1px solid var(--border-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 20px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* ── Header ── */}
      <section style={{
        background: "var(--dark)",
        padding: "48px 20px 40px",
        borderBottom: "1px solid var(--border-dark)",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "4px 12px", borderRadius: 99,
            background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Legal
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", marginBottom: 10 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 0 }}>
            Effective Date: July 2024 &nbsp;·&nbsp; RITCHIE STREET, Chennai
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
        <div className="pp-layout">

          {/* Table of contents — desktop */}
          <aside style={{
            width: 220, flexShrink: 0,
            position: "sticky", top: 100,
            background: "#fff", borderRadius: 10,
            border: "1px solid var(--border-light)",
            padding: "18px 16px",
          }} className="pp-toc">
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--gray-2)", marginBottom: 12 }}>
              Contents
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {sections.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="pp-toc-link">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div style={{
              background: "#fff", borderRadius: 10,
              border: "1px solid var(--border-light)",
              overflow: "hidden",
            }}>
              {/* Intro */}
              <div style={{ padding: "28px 28px 0" }}>
                <p style={{ fontSize: 14, color: "var(--gray-2)", lineHeight: 1.8, paddingBottom: 24, borderBottom: "1px solid var(--border-light)", marginBottom: 0 }}>
                  This Privacy Policy describes how <strong style={{ color: "var(--dark)" }}>RITCHIE STREET</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) handles information when you use our second-hand mobile phone inventory website at{" "}
                  <a href="https://second-hand-mobile-inventory.vercel.app" style={{ color: "var(--gold)", textDecoration: "none" }}>second-hand-mobile-inventory.vercel.app</a>.
                  We are committed to protecting your privacy and being transparent about what we do.
                </p>
              </div>

              {/* Sections */}
              {sections.map((section, i) => (
                <div key={section.id} id={section.id} style={{
                  padding: "28px",
                  borderBottom: i < sections.length - 1 ? "1px solid var(--border-light)" : "none",
                }}>
                  <h2 style={{
                    fontSize: 16, fontWeight: 800, color: "var(--dark)",
                    letterSpacing: "-0.01em", marginBottom: 14,
                  }}>{section.title}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {section.content.map((para, j) => (
                      <p key={j} style={{ fontSize: 13, color: "var(--gray-2)", lineHeight: 1.8, margin: 0 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div style={{
              marginTop: 24, padding: 20, borderRadius: 10,
              background: "var(--dark)", border: "1px solid var(--border-dark)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  Questions about this policy?
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  Reach out to us directly on WhatsApp — we reply fast.
                </div>
              </div>
              <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: 8,
                  background: "#16a34a", color: "#fff",
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                }}>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

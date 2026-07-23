import React from "react";
import Link from "next/link";
import { MapPin, Phone, MessageSquare, Youtube, Send, ShieldCheck, Zap, Headphones, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | RITCHIE STREET — Second Hand Mobiles Chennai",
  description: "Learn about Ritchie Street — your trusted destination for verified second-hand smartphones and mobile repairs near Ritchie Street, Chennai. Real prices, honest condition ratings.",
};

export default function AboutPage() {
  return (
    <div style={{ background: "var(--off-white)", flexGrow: 1 }}>

      {/* ── Dark breadcrumb bar ── */}
      <div style={{ background: "var(--dark-2)", borderBottom: "1px solid var(--border-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 20px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>About Us</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg, #13120f 0%, #1e1a13 60%, #252219 100%)",
        padding: "60px 20px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: 500, height: 300,
          background: "radial-gradient(ellipse, rgba(201,169,110,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <img src="/media/logo.png" alt="RITCHIE STREET"
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--gold)" }} />
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "4px 14px", borderRadius: 99,
            background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
            marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Established · Chennai
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900,
            color: "#fff", lineHeight: 1.12,
            letterSpacing: "-0.025em", marginBottom: 16,
          }}>
            About <span style={{ color: "var(--gold)" }}>Ritchie Street</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto" }}>
            Your trusted neighbourhood store for verified pre-owned smartphones and professional mobile repairs — right near the heart of Chennai's electronics hub.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section style={{ background: "#fff", padding: "56px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--dark)", letterSpacing: "-0.02em", marginBottom: 20 }}>
            Our Story
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "We are a second-hand mobile phone store based near Ritchie Street, Chennai — India's most famous electronics market. We started with one simple idea: make buying a quality used smartphone as transparent and trustworthy as possible.",
              "Every phone we sell goes through a thorough inspection. We check the battery health, test every function, and honestly document any cosmetic or functional issues before listing it. No surprises after you buy.",
              "We believe you shouldn't have to pay new prices for a phone that's barely been used. Our live inventory shows real prices, real battery health percentages, and real condition ratings — updated in real time.",
              "Got questions? We're just a WhatsApp message away. Our team responds fast and helps you pick the right device for your budget and needs.",
            ].map((text, i) => (
              <p key={i} style={{ fontSize: 14, color: "var(--gray-2)", lineHeight: 1.8 }}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ background: "var(--dark)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", textAlign: "center", letterSpacing: "-0.02em", marginBottom: 8 }}>
            Why Choose Us?
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 44 }}>
            Everything that makes us different
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { Icon: ShieldCheck, title: "Verified Condition",       desc: "Every device is tested and rated honestly — Like New, Excellent, Good, or Fair." },
              { Icon: Zap,         title: "Real Battery Health",      desc: "We report actual battery health % on every phone. No guessing." },
              { Icon: Headphones,  title: "Instant WhatsApp Support", desc: "Chat directly with us on WhatsApp. We reply fast and help you decide." },
              { Icon: Star,        title: "Live Inventory",           desc: "Our website shows live stock — available, reserved, or sold. Always accurate." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ textAlign: "center", padding: "0 12px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 16px",
                  background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={24} color="var(--gold)" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Info ── */}
      <section style={{ background: "#fff", padding: "56px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--dark)", letterSpacing: "-0.02em", marginBottom: 32, textAlign: "center" }}>
            Get in Touch
          </h2>
          <div className="about-contact-grid">
            {[
              {
                Icon: MapPin, color: "var(--gold)",
                label: "Visit Us",
                value: "Near Ritchie Street, Chennai — 600002",
                href: "https://maps.google.com/?q=Ritchie+Street+Chennai",
              },
              {
                Icon: MessageSquare, color: "#22c55e",
                label: "WhatsApp",
                value: "+91 76958 92772",
                href: "https://wa.me/c/917695892772",
              },
              {
                Icon: Youtube, color: "#dc2626",
                label: "YouTube Channel",
                value: "@RITCHIE-STREET-CHANNEL",
                href: "https://www.youtube.com/@RITCHIE-STREET-CHANNEL",
              },
              {
                Icon: Send, color: "#38bdf8",
                label: "Telegram",
                value: "t.me/+VJt6D3tw_K9jYjQ9",
                href: "https://t.me/+VJt6D3tw_K9jYjQ9",
              },
            ].map(({ Icon, color, label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: 20,
                borderRadius: 10, border: "1px solid var(--border-light)",
                background: "var(--off-white)", textDecoration: "none",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                  background: "#fff", border: "1px solid var(--border-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gray-2)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)", lineHeight: 1.4 }}>{value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 28px", borderRadius: 8,
              background: "var(--dark)", color: "var(--gold)",
              fontSize: 13, fontWeight: 800, textDecoration: "none",
              letterSpacing: "0.04em",
            }}>
              Browse All Phones →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

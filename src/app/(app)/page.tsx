import React, { Suspense } from "react";
import { getFilteredProducts, FilterParams } from "@/lib/products";
import { getSiteCategories, getSiteBrands } from "@/lib/payload-data";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/FilterPanel";
import { MessageSquare, ShieldCheck, Zap, Headphones, Smartphone } from "lucide-react";

interface PageProps {
  searchParams: Promise<FilterParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const params   = await searchParams;
  const products = await getFilteredProducts(params);
  const categories = await getSiteCategories();
  const brands     = await getSiteBrands();

  const isFiltered = Object.keys(params).some(k => params[k as keyof FilterParams]);

  return (
    <div style={{ background: "var(--off-white)" }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      {!isFiltered && (
        <section style={{
          background: "linear-gradient(135deg, #13120f 0%, #1e1a13 60%, #252219 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: "10%", top: "50%", transform: "translateY(-50%)",
            width: 380, height: 380, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* hero-inner stacks on mobile via CSS */}
          <div className="hero-inner">
            {/* Left: text */}
            <div style={{ flex: "1 1 auto", maxWidth: 520, zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "4px 12px", borderRadius: 99,
                background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
                marginBottom: 18,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Live Inventory · Chennai
                </span>
              </div>

              <h1 style={{
                fontSize: "clamp(24px, 5vw, 44px)",
                fontWeight: 900, color: "#fff",
                lineHeight: 1.12, letterSpacing: "-0.025em",
                marginBottom: 16,
              }}>
                Experience Luxury<br />
                for Less.<br />
                <span style={{ color: "var(--gold)" }}>Premium Certified<br />Pre-Owned Smartphones.</span>
              </h1>

              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 24, lineHeight: 1.65 }}>
                Verified condition · Real battery health · Instant WhatsApp inquiry.<br />
                Near Ritchie Street, Chennai — 600002
              </p>

              <a href="https://wa.me/c/917695892772" target="_blank" rel="noopener noreferrer"
                className="btn-gold">
                <MessageSquare size={15} />
                ENQUIRE ON WHATSAPP
              </a>
            </div>

            {/* Right: Logo visual — hidden on mobile via hide-mobile */}
            <div style={{
              flexShrink: 0, zIndex: 1,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }} className="hide-mobile">
              <div style={{
                width: 240, height: 240, borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #e8e4dc, #c8c3b8, #a09b90)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 -8px 20px rgba(0,0,0,0.2)",
                border: "3px solid rgba(201,169,110,0.4)",
              }}>
                <img src="/media/logo.png" alt="RITCHIE STREET"
                  style={{ width: 170, height: 170, objectFit: "contain", borderRadius: "50%" }} />
              </div>
              <div style={{ width: 180, height: 14, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,169,110,0.3) 0%, transparent 70%)", marginTop: -6 }} />
              <div style={{ marginTop: 14, textAlign: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
                  RITCHIE <span style={{ color: "var(--gold)" }}>STREET</span>
                </span>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                  Second Hand Mobiles · Chennai
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "36px 0 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>
          <div className="section-title" style={{ color: "var(--dark)" }}>
            Featured Premium Devices
          </div>
          <div className="section-sub">
            Verified second-hand smartphones with real battery health &amp; condition ratings
          </div>

          {/* products-layout: row on desktop, column on mobile */}
          <div className="products-layout">

            {/* Filter sidebar */}
            <Suspense fallback={<div style={{ width: 220, flexShrink: 0 }} />}>
              <FilterPanel categories={categories} brands={brands} />
            </Suspense>

            {/* Grid column */}
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              {/* Count row */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 14, flexWrap: "wrap", gap: 8,
              }}>
                <span style={{ fontSize: 13, color: "var(--gray-2)", fontWeight: 500 }}>
                  {products.length} {products.length === 1 ? "device" : "devices"} listed
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, background: "var(--off-white)",
                  border: "1px solid var(--border-light)", color: "var(--gray-2)",
                }}>Live · Updated now</span>
              </div>

              {products.length === 0 ? (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "48px 16px", borderRadius: 12,
                  background: "var(--off-white)", border: "1px solid var(--border-light)",
                  textAlign: "center",
                }}>
                  <Smartphone size={36} color="#c9a96e" />
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 12, marginBottom: 6, color: "var(--dark)" }}>
                    No devices found
                  </div>
                  <div style={{ fontSize: 13, color: "var(--gray-2)" }}>
                    Try adjusting your filters or check back soon.
                  </div>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      {!isFiltered && (
        <section style={{
          background: "var(--dark)",
          padding: "48px 16px 52px",
          borderTop: "1px solid var(--border-dark)",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="section-title" style={{ color: "#fff" }}>Why Choose Us</div>
            <div className="section-sub" style={{ color: "rgba(255,255,255,0.45)" }}>
              Everything you need to buy with confidence
            </div>
            <div className="why-grid">
              {[
                { Icon: ShieldCheck, title: "Verified Condition",       desc: "We stand quality assessments and test every mobile device before listing." },
                { Icon: Zap,         title: "Battery Health Guarantee", desc: "We report real battery health on all pre-owned smartphones honestly." },
                { Icon: Headphones,  title: "Direct Support",           desc: "We help you seamlessly via WhatsApp with immediate customer support." },
              ].map(({ Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 8px" }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                  }}>
                    <Icon size={26} color="var(--gold)" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 220 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

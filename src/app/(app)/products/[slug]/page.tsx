import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import { getSiteSettings } from "@/lib/payload-data";
import { ProductGallery } from "@/components/ProductGallery";
import { StickyContactBar } from "@/components/StickyContactBar";
import { IconRenderer } from "@/components/IconRenderer";
import { AnalyticsTrigger } from "@/components/AnalyticsTrigger";
import {
  ChevronRight, ShieldCheck, Check, AlertTriangle,
  AlertCircle, MessageSquare, Phone, Zap, Package,
} from "lucide-react";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  try {
    const result = await payload.find({ collection: "products", where: { slug: { equals: slug } }, limit: 1 });
    if (!result.docs.length) return {};
    const p = result.docs[0];
    const title = `${p.title} — ₹${p.price?.toLocaleString("en-IN")} | Ritchie Street`;
    const desc = `Buy used ${p.brand?.name} ${p.model} in ${p.condition} condition for ₹${p.price?.toLocaleString("en-IN")}. Battery: ${p.batteryHealth || "N/A"}%. Near Ritchie Street, Chennai.`;
    return { title, description: desc, openGraph: { title, description: desc, type: "article" } };
  } catch { return {}; }
}

const STATUS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  available:      { label: "Available",    color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  reserved:       { label: "Reserved",     color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  sold:           { label: "Sold",         color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  "out-of-stock": { label: "Out of Stock", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  repairing:      { label: "Repairing",    color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  "coming-soon":  { label: "Coming Soon",  color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
};

const CONDITION: Record<string, string> = {
  "like-new": "Like New", excellent: "Excellent", good: "Good", fair: "Fair",
};

function SpecRow({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  if (!value && value !== 0 && value !== false) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 0", borderBottom: "1px solid var(--border-light)",
    }}>
      <span style={{ fontSize: 13, color: "var(--gray-2)", fontWeight: 500 }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 700,
        color: accent ? "var(--gold)" : "var(--dark)",
      }}>{String(value)}</span>
    </div>
  );
}

function BoxItem({ label, included }: { label: string; included: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        background: included ? "#f0fdf4" : "#f9f9f9",
        border: `1px solid ${included ? "#bbf7d0" : "#e5e7eb"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Check size={11} color={included ? "#15803d" : "#d1d5db"} />
      </div>
      <span style={{ fontSize: 12, color: included ? "var(--dark)" : "var(--gray-2)", fontWeight: included ? 600 : 400 }}>
        {label}
      </span>
    </div>
  );
}

export default async function Page({ params }: ProductPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (!result.docs.length) return notFound();

  const product = result.docs[0];
  const settings = await getSiteSettings();

  const st = STATUS[product.status as string] ?? { label: "Unknown", color: "#999", bg: "#f9f9f9", border: "#eee" };
  const condLabel = CONDITION[product.condition as string] || product.condition || "";

  const savings = product.originalLaunchPrice > product.price
    ? product.originalLaunchPrice - product.price : 0;
  const savingsPct = savings
    ? Math.round((savings / product.originalLaunchPrice) * 100) : 0;

  const isSold = product.status === "sold";

  // Build gallery
  const galleryImages: any[] = [];
  if (product.mainImage) {
    galleryImages.push({ image: product.mainImage });
  } else if (product.youtubeShortsUrl) {
    const m = String(product.youtubeShortsUrl).match(/^.*(youtu\.be\/|v\/|shorts\/|watch\?v=|&v=)([^#&?]{11})/);
    if (m) galleryImages.push({ image: { url: `https://i.ytimg.com/vi/${m[2]}/hqdefault.jpg`, alt: product.title } });
  }
  if (product.gallery?.length) galleryImages.push(...product.gallery);
  if (!galleryImages.length) galleryImages.push({ image: { url: "/media/logo.png", alt: "RITCHIE STREET" } });

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product",
    name: product.title,
    offers: {
      "@type": "Offer", price: product.price, priceCurrency: "INR",
      availability: product.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    brand: { "@type": "Brand", name: typeof product.brand === "object" ? product.brand.name : "Device" },
  };

  return (
    <div style={{ background: "var(--off-white)", flexGrow: 1 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnalyticsTrigger productId={product.id} />

      {/* ── Breadcrumb ─────────────────────────────── */}
      <div style={{ background: "var(--dark-2)", borderBottom: "1px solid var(--border-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 20px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
            <Link href={`/?brand=${product.brand?.slug}`} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              {product.brand?.name}
            </Link>
            <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>{product.model}</span>
          </nav>
        </div>
      </div>

      {/* ── Main product section ─────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 20px" }}>

        {/* Top 2-col layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="pd-grid">

          {/* LEFT — Gallery */}
          <div className="pd-gallery" style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--border-light)", overflow: "hidden", padding: 0 }}>
            <ProductGallery images={galleryImages} />
          </div>

          {/* RIGHT — Info panel */}
          <div className="pd-info" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Status + Year row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 4,
                color: st.color, background: st.bg, border: `1px solid ${st.border}`,
              }}>{st.label}</span>
              {product.yearReleased && (
                <span style={{ fontSize: 11, color: "var(--gray-2)" }}>Released {product.yearReleased}</span>
              )}
            </div>

            {/* Brand */}
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold)" }}>
              {product.brand?.name}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900,
              color: "var(--dark)", lineHeight: 1.15, letterSpacing: "-0.02em",
              margin: 0,
            }}>{product.title}</h1>

            {/* Sold warning */}
            {isSold && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px",
                borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca",
                color: "#dc2626", fontSize: 12, fontWeight: 700,
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                This item has been sold and is no longer available.
              </div>
            )}

            {product.customerNotes && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px",
                borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a",
                color: "#b45309", fontSize: 12,
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                {product.customerNotes}
              </div>
            )}

            {/* Price block */}
            <div style={{
              padding: "16px", borderRadius: 10,
              background: "var(--dark)", border: "1px solid var(--border-dark)",
            }}>
              {product.originalLaunchPrice > product.price && (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "line-through", marginBottom: 4 }}>
                  Launch price: ₹{Number(product.originalLaunchPrice).toLocaleString("en-IN")}
                </div>
              )}
              <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em" }}>
                ₹{Number(product.price).toLocaleString("en-IN")}
              </div>
              {savings > 0 && (
                <div style={{
                  display: "inline-block", marginTop: 10, padding: "3px 10px", borderRadius: 4,
                  background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
                  fontSize: 11, fontWeight: 800, color: "var(--gold)",
                }}>
                  Save ₹{savings.toLocaleString("en-IN")} · {savingsPct}% off retail
                </div>
              )}
            </div>

            {/* Key spec pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {condLabel && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6, background: "var(--gold)", color: "var(--dark)" }}>
                  {condLabel}
                </span>
              )}
              {product.storage && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 6, background: "#fff", border: "1px solid var(--border-light)", color: "var(--dark)" }}>
                  {product.storage}
                </span>
              )}
              {product.ram && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 6, background: "#fff", border: "1px solid var(--border-light)", color: "var(--dark)" }}>
                  {product.ram} RAM
                </span>
              )}
              {product.batteryHealth && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                  background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Zap size={11} /> {product.batteryHealth}% Battery
                </span>
              )}
              {product.is5g && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6, background: "#f0f9ff", border: "1px solid #bae6fd", color: "#0369a1" }}>
                  5G
                </span>
              )}
            </div>

            {/* Contact actions */}
            {!isSold && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a
                  href={`https://wa.me/917695892772?text=Hi! I'm interested in: ${encodeURIComponent(product.title)} (₹${product.price}) - ${typeof window !== "undefined" ? window.location.href : ""}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px", borderRadius: 8,
                    background: "#16a34a", color: "#fff",
                    fontSize: 14, fontWeight: 800, textDecoration: "none",
                    letterSpacing: "0.02em",
                  }}
                >
                  <MessageSquare size={16} />
                  Enquire on WhatsApp
                </a>
                <a
                  href="tel:+917695892772"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "11px", borderRadius: 8,
                    background: "transparent", color: "var(--dark)",
                    fontSize: 13, fontWeight: 700, textDecoration: "none",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <Phone size={14} />
                  Call: 7695892772
                </a>
              </div>
            )}

            {/* StickyContactBar (mobile) */}
            <StickyContactBar
              product={{ id: product.id, title: product.title, slug: product.slug, price: product.price, color: product.color, storage: product.storage }}
              settings={{ whatsappNumber: settings.whatsappNumber, contactPhoneNumber: settings.contactPhoneNumber }}
            />
          </div>
        </div>

        {/* ── Bottom 2-col: Specs + Issues ──────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginTop: 24 }} className="pd-bottom">

          {/* Specifications */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid var(--border-light)", padding: "24px",
          }}>
            <h2 style={{
              fontSize: 16, fontWeight: 800, color: "var(--dark)",
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: 20, paddingBottom: 16,
              borderBottom: "1px solid var(--border-light)",
            }}>
              <ShieldCheck size={18} color="var(--gold)" />
              Detailed Specifications
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }} className="spec-cols">
              <SpecRow label="Brand"        value={product.brand?.name} />
              <SpecRow label="Model"        value={product.model} />
              <SpecRow label="Condition"    value={condLabel} accent />
              <SpecRow label="Battery Health" value={product.batteryHealth ? `${product.batteryHealth}%` : null} accent />
              <SpecRow label="Storage"      value={product.storage} />
              <SpecRow label="RAM"          value={product.ram} />
              <SpecRow label="OS Version"   value={product.operatingSystem} />
              <SpecRow label="Network Lock" value={product.networkLock?.replace("-", " ") || "Unlocked"} />
              <SpecRow label="5G Support"   value={product.is5g ? "Yes" : "No"} />
              <SpecRow label="Dual SIM"     value={product.dualSim ? "Yes" : "No"} />
              <SpecRow label="Year Released" value={product.yearReleased} />
              <SpecRow label="Colour"       value={product.color} />
              <SpecRow label="Warranty"     value={`${product.warrantyOption?.replace("-", " ") || "—"} ${product.warrantyDuration ? `(${product.warrantyDuration})` : ""}`} />
              {product.customFeatures?.filter((f: any) => f.enabled).map((feat: any, i: number) => (
                <SpecRow key={i} label={feat.name} value={feat.value} />
              ))}
            </div>

            {/* Box contents */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-light)" }}>
              <h3 style={{
                fontSize: 12, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.07em", color: "var(--gray-2)", marginBottom: 14,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Package size={13} /> Included in Box
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                <BoxItem label="Retail Box"     included={product.boxAndAccessories?.boxAvailable} />
                <BoxItem label="Invoice / Bill" included={product.boxAndAccessories?.invoiceAvailable} />
                <BoxItem label="Charger Block"  included={product.boxAndAccessories?.originalCharger} />
                <BoxItem label="Charging Cable" included={product.boxAndAccessories?.originalCable} />
              </div>
              {product.boxAndAccessories?.accessoriesIncluded && (
                <p style={{ fontSize: 12, color: "var(--gray-2)", marginTop: 12, fontStyle: "italic" }}>
                  Extra: {product.boxAndAccessories.accessoriesIncluded}
                </p>
              )}
            </div>
          </div>

          {/* Known Issues */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid var(--border-light)", padding: "24px",
          }}>
            <h2 style={{
              fontSize: 16, fontWeight: 800, color: "var(--dark)",
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: 8, paddingBottom: 16,
              borderBottom: "1px solid var(--border-light)",
            }}>
              <AlertTriangle size={18} color="#d97706" />
              Cosmetic & Functional Check
            </h2>
            <p style={{ fontSize: 12, color: "var(--gray-2)", marginBottom: 20, lineHeight: 1.6 }}>
              All known issues are listed transparently so you know exactly what you're buying.
            </p>

            {(!product.knownIssues || product.knownIssues.length === 0) ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0",
              }}>
                <Check size={18} color="#15803d" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>No known issues!</div>
                  <div style={{ fontSize: 12, color: "var(--gray-2)", marginTop: 2 }}>
                    This device is functionally and cosmetically verified clean.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {product.knownIssues.map((issue: any, idx: number) => {
                  const sev = {
                    light:  { label: "Light",  color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
                    medium: { label: "Medium",  color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
                    heavy:  { label: "Heavy",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
                  }[issue.severity as string] ?? { label: "Issue", color: "#555", bg: "#f9f9f9", border: "#e5e7eb" };
                  return (
                    <div key={idx} style={{
                      padding: "12px 14px", borderRadius: 8,
                      background: "var(--off-white)", border: "1px solid var(--border-light)",
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                        background: sev.bg, border: `1px solid ${sev.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <IconRenderer name={issue.icon || "AlertCircle"} className="h-4 w-4" style={{ color: sev.color }} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--dark)" }}>{issue.title}</span>
                          <span style={{
                            fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 3,
                            textTransform: "uppercase", letterSpacing: "0.05em",
                            color: sev.color, background: sev.bg, border: `1px solid ${sev.border}`,
                          }}>{sev.label}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "var(--gray-2)", lineHeight: 1.55 }}>{issue.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}

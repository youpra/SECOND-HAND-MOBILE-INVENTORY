import React, { Suspense } from "react";
import { getFilteredProducts, FilterParams } from "@/lib/products";
import { getSiteCategories, getSiteBrands } from "@/lib/payload-data";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/FilterPanel";
import { Smartphone } from "lucide-react";

interface PageProps {
  searchParams: Promise<FilterParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = await getFilteredProducts(params);
  const categories = await getSiteCategories();
  const brands = await getSiteBrands();

  const available = products.filter((p: any) => p.status === "available").length;
  const sold      = products.filter((p: any) => p.status === "sold").length;

  return (
    <div style={{ background: "var(--c-bg)", flexGrow: 1 }}>

      {/* ─── Category/Brand hero strip ─────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 20px 0" }}>
          <h1 style={{
            fontSize: 22, fontWeight: 900, letterSpacing: "-0.025em",
            color: "var(--c-text-1)", marginBottom: 4,
          }}>
            Second Hand <span style={{ color: "var(--c-red)" }}>Mobile Phones</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--c-text-2)", marginBottom: 16 }}>
            Verified pre-owned smartphones · Near Ritchie Street, Chennai
          </p>

          {/* Stats pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 16 }}>
            <StatPill color="#15803d" bg="#f0fdf4" border="#bbf7d0">
              🟢 {available} Available
            </StatPill>
            <StatPill color="#374151" bg="#f9fafb" border="#e5e7eb">
              📦 {products.length} Total
            </StatPill>
            <StatPill color="#6b7280" bg="#f9fafb" border="#e5e7eb">
              ✅ {sold} Sold
            </StatPill>
            <a
              href="https://wa.me/c/917695892772"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 700, color: "#15803d",
                padding: "3px 10px", borderRadius: 99,
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                textDecoration: "none",
              }}
            >
              💬 WhatsApp Catalog
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main content: filters + grid ──────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 20px" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* Sidebar filters */}
          <Suspense fallback={
            <div style={{
              width: 220, flexShrink: 0, borderRadius: 10, height: 400,
              background: "#fff", border: "1px solid var(--c-border)",
            }} />
          }>
            <FilterPanel categories={categories} brands={brands} />
          </Suspense>

          {/* Product grid area */}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            {/* Results header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 14,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text-2)" }}>
                {products.length} {products.length === 1 ? "phone" : "phones"} found
              </span>
            </div>

            {products.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "60px 20px",
                background: "#fff", borderRadius: 12, border: "1px solid var(--c-border)",
                textAlign: "center",
              }}>
                <Smartphone size={40} color="var(--c-text-3)" />
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--c-text-1)", marginTop: 12, marginBottom: 4 }}>
                  No phones found
                </div>
                <div style={{ fontSize: 13, color: "var(--c-text-2)" }}>
                  Try adjusting your filters or check back for new arrivals.
                </div>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 10,
              }}
                className="product-grid"
              >
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive grid: 2 on mobile → 3 tablet → 4 desktop */}
      <style>{`
        @media (min-width: 640px)  { .product-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 12px !important; } }
        @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 14px !important; } }
      `}</style>
    </div>
  );
}

function StatPill({ children, color, bg, border }: { children: React.ReactNode; color: string; bg: string; border: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 99,
      color, background: bg, border: `1px solid ${border}`,
    }}>{children}</span>
  );
}

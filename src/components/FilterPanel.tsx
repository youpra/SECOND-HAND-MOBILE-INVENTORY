"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, X, Sliders, Check } from "lucide-react";

interface FilterPanelProps {
  categories: any[];
  brands: any[];
}

const inp: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  border: "1px solid var(--border-light)",
  borderRadius: 7,
  color: "var(--dark)",
  fontSize: 12,
  padding: "8px 10px",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 800,
  textTransform: "uppercase", letterSpacing: "0.07em",
  color: "var(--gray-2)", marginBottom: 6, display: "block",
};

export function FilterPanel({ categories, brands }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch]               = useState(searchParams.get("search") || "");
  const [brand, setBrand]                 = useState(searchParams.get("brand") || "");
  const [priceMin, setPriceMin]           = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax]           = useState(searchParams.get("priceMax") || "");
  const [batteryMin, setBatteryMin]       = useState(searchParams.get("batteryMin") || "");
  const [batteryMax, setBatteryMax]       = useState(searchParams.get("batteryMax") || "");
  const [sort, setSort]                   = useState(searchParams.get("sort") || "newest");
  const [selectedStatuses, setSelectedStatuses]     = useState<string[]>(searchParams.getAll("status"));
  const [selectedConditions, setSelectedConditions] = useState<string[]>(searchParams.getAll("condition"));
  const [is5g, setIs5g]                   = useState(searchParams.get("is5g") === "true");
  const [dualSim, setDualSim]             = useState(searchParams.get("dualSim") === "true");
  const [mobileOpen, setMobileOpen]       = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setBrand(searchParams.get("brand") || "");
    setPriceMin(searchParams.get("priceMin") || "");
    setPriceMax(searchParams.get("priceMax") || "");
    setBatteryMin(searchParams.get("batteryMin") || "");
    setBatteryMax(searchParams.get("batteryMax") || "");
    setSort(searchParams.get("sort") || "newest");
    setSelectedStatuses(searchParams.getAll("status"));
    setSelectedConditions(searchParams.getAll("condition"));
    setIs5g(searchParams.get("is5g") === "true");
    setDualSim(searchParams.get("dualSim") === "true");
  }, [searchParams]);

  const applyFilters = () => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (brand) p.set("brand", brand);
    if (priceMin) p.set("priceMin", priceMin);
    if (priceMax) p.set("priceMax", priceMax);
    if (batteryMin) p.set("batteryMin", batteryMin);
    if (batteryMax) p.set("batteryMax", batteryMax);
    if (sort) p.set("sort", sort);
    if (is5g) p.set("is5g", "true");
    if (dualSim) p.set("dualSim", "true");
    selectedStatuses.forEach(s => p.append("status", s));
    selectedConditions.forEach(c => p.append("condition", c));
    startTransition(() => router.push(`/?${p.toString()}`));
    setMobileOpen(false);
  };

  const resetFilters = () => {
    setSearch(""); setBrand(""); setPriceMin(""); setPriceMax("");
    setBatteryMin(""); setBatteryMax(""); setSort("newest");
    setSelectedStatuses([]); setSelectedConditions([]);
    setIs5g(false); setDualSim(false);
    startTransition(() => router.push("/"));
    setMobileOpen(false);
  };

  const toggleStatus    = (s: string) => setSelectedStatuses(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleCondition = (c: string) => setSelectedConditions(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  /* ─── shared filter body ─── */
  const FilterBody = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Brand */}
      <div>
        <label style={labelStyle}>Brand</label>
        <select value={brand} onChange={e => setBrand(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
        </select>
      </div>

      {/* Status */}
      <div>
        <label style={labelStyle}>Status</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {["available", "reserved", "sold", "coming-soon", "repairing"].map(s => {
            const active = selectedStatuses.includes(s);
            return (
              <button key={s} onClick={() => toggleStatus(s)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                cursor: "pointer", textAlign: "left", textTransform: "capitalize",
                border: active ? "1px solid var(--gold-border)" : "1px solid var(--border-light)",
                background: active ? "var(--gold-dim)" : "#fff",
                color: active ? "var(--dark)" : "var(--gray-2)",
                fontFamily: "inherit",
              }}>
                <span>{s.replace("-", " ")}</span>
                {active && <Check size={12} color="var(--gold)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label style={labelStyle}>Condition</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[{ label: "Like New", val: "like-new" }, { label: "Excellent", val: "excellent" }, { label: "Good", val: "good" }, { label: "Fair", val: "fair" }].map(c => {
            const active = selectedConditions.includes(c.val);
            return (
              <button key={c.val} onClick={() => toggleCondition(c.val)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                cursor: "pointer", textAlign: "left",
                border: active ? "1px solid var(--gold-border)" : "1px solid var(--border-light)",
                background: active ? "var(--gold-dim)" : "#fff",
                color: active ? "var(--dark)" : "var(--gray-2)",
                fontFamily: "inherit",
              }}>
                <span>{c.label}</span>
                {active && <Check size={12} color="var(--gold)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label style={labelStyle}>Price Range (₹)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ ...inp, width: "50%" }} />
          <span style={{ color: "var(--gray-2)", fontSize: 12 }}>–</span>
          <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ ...inp, width: "50%" }} />
        </div>
      </div>

      {/* Battery health */}
      <div>
        <label style={labelStyle}>Battery Health (%)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="number" placeholder="Min" value={batteryMin} onChange={e => setBatteryMin(e.target.value)} style={{ ...inp, width: "50%" }} />
          <span style={{ color: "var(--gray-2)", fontSize: 12 }}>–</span>
          <input type="number" placeholder="Max" value={batteryMax} onChange={e => setBatteryMax(e.target.value)} style={{ ...inp, width: "50%" }} />
        </div>
      </div>

      {/* Toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, borderTop: "1px solid var(--border-light)" }}>
        {[{ state: is5g, set: setIs5g, label: "5G Only" }, { state: dualSim, set: setDualSim, label: "Dual SIM Only" }].map(({ state, set, label }) => (
          <label key={label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "var(--dark)", fontWeight: 500 }}>
            <input type="checkbox" checked={state} onChange={e => set(e.target.checked)}
              style={{ width: 14, height: 14, cursor: "pointer", accentColor: "var(--gold)" }} />
            {label}
          </label>
        ))}
      </div>

      {/* Apply */}
      <button onClick={applyFilters} disabled={isPending} style={{
        width: "100%", padding: "10px", borderRadius: 8, border: "none",
        background: "var(--dark)", color: "var(--gold)",
        fontSize: 12, fontWeight: 800, letterSpacing: "0.06em",
        textTransform: "uppercase", cursor: "pointer",
        opacity: isPending ? 0.6 : 1, fontFamily: "inherit",
      }}>
        {isPending ? "Applying…" : "Apply Filters"}
      </button>
    </div>
  );

  return (
    <div style={{ width: "100%", flexShrink: 0 }} className="fp-wrap">

      {/* ── Sort + mobile trigger row ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flexGrow: 1 }}>
          <input type="text" placeholder="Search brand, model…" value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyFilters()}
            style={{ ...inp, paddingLeft: 32 }} />
          <Search size={13} color="var(--gray-2)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>

        {/* Sort */}
        <select value={sort} onChange={e => { setSort(e.target.value); const p = new URLSearchParams(searchParams.toString()); p.set("sort", e.target.value); router.push(`/?${p.toString()}`); }}
          style={{ ...inp, width: "auto", flexShrink: 0, cursor: "pointer" }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priceAsc">Price ↑</option>
          <option value="priceDesc">Price ↓</option>
          <option value="viewsDesc">Most Viewed</option>
        </select>

        {/* Mobile filter btn */}
        <button onClick={() => setMobileOpen(true)} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 12px", borderRadius: 7, border: "1px solid var(--border-light)",
          background: "#fff", color: "var(--dark)", fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
        }} className="fp-mobile-btn">
          <Sliders size={13} /> Filters
        </button>
      </div>

      {/* ── Desktop sidebar ── */}
      <div style={{
        background: "#fff",
        border: "1px solid var(--border-light)",
        borderRadius: 10, padding: 16,
      }} className="fp-sidebar">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-light)" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--dark)", display: "flex", alignItems: "center", gap: 6 }}>
            <Sliders size={13} color="var(--gold)" /> Filters
          </span>
          <button onClick={resetFilters} style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, color: "var(--gray-2)", background: "none", border: "none",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            <RotateCcw size={11} /> Reset
          </button>
        </div>
        <FilterBody />
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            width: "min(340px, 92vw)", height: "100%",
            background: "#fff", padding: 20, overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid var(--border-light)" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--dark)", display: "flex", alignItems: "center", gap: 6 }}>
                <Sliders size={15} color="var(--gold)" /> Filters
              </span>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} color="var(--gray-2)" />
              </button>
            </div>
            <FilterBody isMobile />
            <button onClick={resetFilters} style={{
              marginTop: 10, width: "100%", padding: "10px", borderRadius: 8,
              border: "1px solid var(--border-light)", background: "var(--off-white)",
              color: "var(--gray-2)", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Reset All</button>
          </div>
        </div>
      )}

      <style>{`
        .fp-wrap    { max-width: 220px; }
        .fp-sidebar { display: block; }
        .fp-mobile-btn { display: none !important; }
        @media (max-width: 1023px) {
          .fp-wrap        { max-width: 100%; }
          .fp-sidebar     { display: none !important; }
          .fp-mobile-btn  { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

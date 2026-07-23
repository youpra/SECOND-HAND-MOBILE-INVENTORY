"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, X, Sliders, Check } from "lucide-react";

interface FilterPanelProps {
  categories: any[];
  brands: any[];
}

export function FilterPanel({ categories, brands }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state initialized from search params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [batteryMin, setBatteryMin] = useState(searchParams.get("batteryMin") || "");
  const [batteryMax, setBatteryMax] = useState(searchParams.get("batteryMax") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    searchParams.getAll("status")
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.getAll("condition")
  );

  const [is5g, setIs5g] = useState(searchParams.get("is5g") === "true");
  const [dualSim, setDualSim] = useState(searchParams.get("dualSim") === "true");

  // Mobile visibility drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync state with url params updates
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

  // Apply filters function
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (brand) params.set("brand", brand);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    if (batteryMin) params.set("batteryMin", batteryMin);
    if (batteryMax) params.set("batteryMax", batteryMax);
    if (sort) params.set("sort", sort);
    if (is5g) params.set("is5g", "true");
    if (dualSim) params.set("dualSim", "true");

    selectedStatuses.forEach((status) => params.append("status", status));
    selectedConditions.forEach((cond) => params.append("condition", cond));

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
    setMobileOpen(false);
  };

  // Clear all filters
  const resetFilters = () => {
    setSearch("");
    setBrand("");
    setPriceMin("");
    setPriceMax("");
    setBatteryMin("");
    setBatteryMax("");
    setSort("newest");
    setSelectedStatuses([]);
    setSelectedConditions([]);
    setIs5g(false);
    setDualSim(false);

    startTransition(() => {
      router.push("/");
    });
    setMobileOpen(false);
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleConditionToggle = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      {/* Quick Search & Sort bar (Desktop and Mobile) */}
      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search brand, model, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        </div>

        <div className="flex gap-2">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex lg:hidden items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <Sliders className="h-4 w-4" />
            Filters
          </button>

          {/* Sort selection */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              const params = new URLSearchParams(searchParams.toString());
              params.set("sort", e.target.value);
              router.push(`/?${params.toString()}`);
            }}
            className="flex-grow bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-300 focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="viewsDesc">Most Viewed</option>
            <option value="contactsDesc">Most Contacted</option>
            <option value="recentlyUpdated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Filter Sidebar - Desktop Only */}
      <div className="hidden lg:flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/20 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="font-bold text-slate-200 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-red-500" />
            Filters
          </h2>
          <button
            onClick={resetFilters}
            className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Brands */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Statuses */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
          <div className="flex flex-col gap-1.5">
            {["available", "reserved", "sold", "coming-soon", "repairing"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusToggle(status)}
                className={`flex items-center justify-between text-left text-xs rounded-lg px-3 py-2 border transition-all ${
                  selectedStatuses.includes(status)
                    ? "bg-red-600/10 text-red-400 border-red-500/30 font-semibold"
                    : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <span className="capitalize">{status.replace("-", " ")}</span>
                {selectedStatuses.includes(status) && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</label>
          <div className="flex flex-col gap-1.5">
            {[
              { label: "Like New", val: "like-new" },
              { label: "Excellent", val: "excellent" },
              { label: "Good", val: "good" },
              { label: "Fair", val: "fair" },
            ].map((cond) => (
              <button
                key={cond.val}
                onClick={() => handleConditionToggle(cond.val)}
                className={`flex items-center justify-between text-left text-xs rounded-lg px-3 py-2 border transition-all ${
                  selectedConditions.includes(cond.val)
                    ? "bg-red-600/10 text-red-400 border-red-500/30 font-semibold"
                    : "bg-slate-950/40 text-slate-400 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <span>{cond.label}</span>
                {selectedConditions.includes(cond.val) && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price Range (₹)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
            />
            <span className="text-slate-600">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Battery Health Range */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Battery Health (%)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={batteryMin}
              onChange={(e) => setBatteryMin(e.target.value)}
              className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
            />
            <span className="text-slate-600">-</span>
            <input
              type="number"
              placeholder="Max"
              value={batteryMax}
              onChange={(e) => setBatteryMax(e.target.value)}
              className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Switches */}
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-800/80">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={is5g}
              onChange={(e) => setIs5g(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-red-600 focus:ring-red-500"
            />
            <span>5G Supported Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={dualSim}
              onChange={(e) => setDualSim(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-red-600 focus:ring-red-500"
            />
            <span>Dual SIM Only</span>
          </label>
        </div>

        {/* Apply Button */}
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:bg-red-500 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply Filters"}
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm h-full bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h2 className="font-bold text-white flex items-center gap-2 text-lg">
                <Sliders className="h-5 w-5 text-red-400" />
                Filters
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 hover:bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Brand */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Statuses */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {["available", "reserved", "sold", "coming-soon", "repairing"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`flex items-center justify-between text-left text-xs rounded-lg px-3 py-2 border transition-all ${
                      selectedStatuses.includes(status)
                        ? "bg-red-600/10 text-red-400 border-red-500/30 font-semibold"
                        : "bg-slate-900/40 text-slate-400 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <span className="capitalize">{status.replace("-", " ")}</span>
                    {selectedStatuses.includes(status) && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Conditions */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Condition</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Like New", val: "like-new" },
                  { label: "Excellent", val: "excellent" },
                  { label: "Good", val: "good" },
                  { label: "Fair", val: "fair" },
                ].map((cond) => (
                  <button
                    key={cond.val}
                    onClick={() => handleConditionToggle(cond.val)}
                    className={`flex items-center justify-between text-left text-xs rounded-lg px-3 py-2 border transition-all ${
                      selectedConditions.includes(cond.val)
                        ? "bg-red-600/10 text-red-400 border-red-500/30 font-semibold"
                        : "bg-slate-900/40 text-slate-400 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <span>{cond.label}</span>
                    {selectedConditions.includes(cond.val) && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
                <span className="text-slate-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Mobile Battery */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Battery Health (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={batteryMin}
                  onChange={(e) => setBatteryMin(e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
                <span className="text-slate-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={batteryMax}
                  onChange={(e) => setBatteryMax(e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Mobile Switches */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-850">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={is5g}
                  onChange={(e) => setIs5g(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-red-600 focus:ring-red-500"
                />
                <span>5G Supported Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={dualSim}
                  onChange={(e) => setDualSim(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-red-600 focus:ring-red-500"
                />
                <span>Dual SIM Only</span>
              </label>
            </div>

            {/* Mobile Action Buttons */}
            <div className="mt-auto pt-6 flex gap-3">
              <button
                onClick={resetFilters}
                className="w-1/2 rounded-xl border border-slate-800 bg-slate-900 py-3 text-sm font-semibold text-slate-300 hover:text-white"
              >
                Reset All
              </button>
              <button
                onClick={applyFilters}
                className="w-1/2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

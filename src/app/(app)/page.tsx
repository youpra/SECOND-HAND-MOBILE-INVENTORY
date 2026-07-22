import React, { Suspense } from "react";
import { getFilteredProducts, FilterParams } from "@/lib/products";
import { getSiteCategories, getSiteBrands } from "@/lib/payload-data";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/FilterPanel";
import { Sparkles, ShoppingBag } from "lucide-react";

interface PageProps {
  searchParams: Promise<FilterParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = await getFilteredProducts(params);
  const categories = await getSiteCategories();
  const brands = await getSiteBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
      {/* Premium Hero Banner Section */}
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-950 border border-slate-800/80 p-8 sm:p-12 text-center shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-4">
            <Sparkles className="h-3 w-3" /> Live Inventory Availability
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl mb-4 leading-tight">
            Premium Pre-Owned Tech, <br/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zero Guesswork.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            See exactly what's Available, Reserved, or Sold. No unnecessary WhatsApp back-and-forth. Check specs, inspect known issues, and buy directly.
          </p>
        </div>
      </div>

      {/* Main Grid Layout: Sidebar Filters + Products */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <Suspense fallback={<div className="w-64 h-96 bg-slate-900/10 rounded-2xl animate-pulse" />}>
          <FilterPanel categories={categories} brands={brands} />
        </Suspense>

        {/* Product Grid Area */}
        <div className="flex-grow w-full">
          {products.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/10 py-16 px-4 text-center">
              <ShoppingBag className="h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-300 mb-1">No items match your criteria</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Try loosening your filters, resetting the price range, or searching for a different brand or model.
              </p>
            </div>
          ) : (
            /* Grid display */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

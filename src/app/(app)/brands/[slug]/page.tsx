import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import { getFilteredProducts } from "@/lib/products";
import { getSiteCategories, getSiteBrands } from "@/lib/payload-data";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/FilterPanel";
import { Metadata } from "next";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<any>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });

  try {
    const brandDoc = await payload.find({
      collection: "brands",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (brandDoc.docs.length === 0) return {};

    const brand = brandDoc.docs[0];
    const title = brand.seoTitle || `${brand.name} Pre-Owned Electronics`;
    const description =
      brand.seoDescription ||
      brand.description ||
      `Find available, reserved, and sold pre-owned ${brand.name} electronics in our inventory.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/brands/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `/brands/${slug}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (err) {
    return {};
  }
}

export default async function Page({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;

  const payload = await getPayload({ config });
  const brandDoc = await payload.find({
    collection: "brands",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (brandDoc.docs.length === 0) {
    return notFound();
  }

  const brand = brandDoc.docs[0];

  // Override brand search param
  const filterParams = {
    ...sParams,
    brand: slug,
  };

  const products = await getFilteredProducts(filterParams);
  const categories = await getSiteCategories();
  const brands = await getSiteBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
      {/* Brand Header Banner */}
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(99,102,241,0.08),rgba(255,255,255,0))]" />
        <div className="relative z-10 max-w-xl text-left">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-3">
            {brand.name} Electronics
          </h1>
          {brand.description && (
            <p className="text-sm text-slate-400 leading-relaxed">{brand.description}</p>
          )}
        </div>
      </div>

      {/* Grid Layout: Sidebar Filters + Products */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <Suspense fallback={<div className="w-64 h-96 bg-slate-900/10 rounded-2xl animate-pulse" />}>
          <FilterPanel categories={categories} brands={brands} />
        </Suspense>

        {/* Product Grid Area */}
        <div className="flex-grow w-full">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/10 py-16 px-4 text-center">
              <h3 className="text-lg font-bold text-slate-300 mb-1">No items found for this brand</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Try loosening your filters or resetting the search criteria.
              </p>
            </div>
          ) : (
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

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
import { ChevronRight, ShieldCheck, Check, AlertTriangle, AlertCircle } from "lucide-react";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });

  try {
    const result = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (result.docs.length === 0) return {};

    const product = result.docs[0];
    const title = `${product.title} - ₹${product.price} (Second Hand)`;
    const description = `Buy used ${product.brand.name} ${product.model} in ${product.condition} condition. Current Selling Price: ₹${product.price}. Read full specifications, warranty info, and known issues.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/products/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `/products/${slug}`,
        type: "article",
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

export default async function Page({ params }: ProductPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
  });

  if (result.docs.length === 0) {
    return notFound();
  }

  const product = result.docs[0];
  const settings = await getSiteSettings();

  // Status config
  const statusConfig = {
    available: { label: "Available", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    reserved: { label: "Reserved", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    sold: { label: "Sold", bg: "bg-slate-700/20 text-slate-400 border-slate-700/30" },
    "out-of-stock": { label: "Out of Stock", bg: "bg-red-500/10 text-red-400 border-red-500/30" },
    repairing: { label: "Repairing", bg: "bg-red-500/10 text-red-400 border-red-500/30" },
    "coming-soon": { label: "Coming Soon", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  }[product.status as string] || { label: "Unknown", bg: "bg-slate-500/10 text-slate-400 border-slate-500/30" };

  // Calculate savings
  const savings =
    product.originalLaunchPrice && product.originalLaunchPrice > product.price
      ? product.originalLaunchPrice - product.price
      : 0;

  const savingsPct =
    product.originalLaunchPrice && product.originalLaunchPrice > product.price
      ? Math.round((savings / product.originalLaunchPrice) * 100)
      : 0;

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || `Pre-owned ${product.title} in ${product.condition} condition`,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "itemCondition": product.condition === "like-new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      "availability": product.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    "brand": {
      "@type": "Brand",
      "name": typeof product.brand === "object" ? product.brand.name : "Device",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow pb-24 lg:pb-8">
      {/* Dynamic JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Analytics trigger to increment views */}
      <AnalyticsTrigger productId={product.id} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-slate-300">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-slate-300">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/brands/${product.brand.slug}`} className="hover:text-slate-300">
          {product.brand.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300 truncate max-w-xs">{product.model}</span>
      </nav>

      {/* Two Column Layout: Media Swiper + Details Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Swipe Gallery */}
        <div className="lg:col-span-7 w-full">
          <ProductGallery images={product.gallery || []} />
        </div>

        {/* Right Column: Specifications & Contact Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Header Specs block */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/10 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusConfig.bg}`}>
                {statusConfig.label}
              </span>
              <span className="text-xs text-slate-500">Released in {product.yearReleased || "N/A"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
              {product.title}
            </h1>

            {product.status === "sold" && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl p-3 mb-4 uppercase tracking-wider">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>This item has been Sold out and is no longer available.</span>
              </div>
            )}

            {product.customerNotes && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{product.customerNotes}</span>
              </div>
            )}

            {/* Pricing block */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-black text-white">₹{product.price}</span>
              {product.originalLaunchPrice && (
                <span className="text-sm text-slate-500 line-through">
                  Original: ₹{product.originalLaunchPrice}
                </span>
              )}
            </div>

            {savings > 0 && (
              <span className="inline-block rounded-lg bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">
                Save ₹{savings} ({savingsPct}% Off retail)
              </span>
            )}
          </div>

          {/* Sticky Contact Bar Widget */}
          <StickyContactBar
            product={{
              id: product.id,
              title: product.title,
              slug: product.slug,
              price: product.price,
              color: product.color,
              storage: product.storage,
            }}
            settings={{
              whatsappNumber: settings.whatsappNumber,
              contactPhoneNumber: settings.contactPhoneNumber,
            }}
          />
        </div>
      </div>

      {/* Full Product Specifications Details Grid */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Specifications Listing */}
        <div className="lg:col-span-7 flex flex-col gap-8 w-full">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/10 p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-850 pb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-red-400" />
              Detailed Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {/* Pre-defined specs */}
              <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                <span className="text-slate-500">Brand</span>
                <span className="text-white font-medium">{product.brand.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                <span className="text-slate-500">Model</span>
                <span className="text-white font-medium">{product.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                <span className="text-slate-500">Condition</span>
                <span className="text-white font-medium capitalize">
                  {product.condition === "like-new" ? "Like New" : product.condition}
                </span>
              </div>
              {product.batteryHealth && (
                <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                  <span className="text-slate-500">Battery Health</span>
                  <span className="text-red-400 font-bold">{product.batteryHealth}%</span>
                </div>
              )}
              {product.ram && (
                <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                  <span className="text-slate-500">RAM</span>
                  <span className="text-white font-medium">{product.ram}</span>
                </div>
              )}
              {product.storage && (
                <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                  <span className="text-slate-500">Storage</span>
                  <span className="text-white font-medium">{product.storage}</span>
                </div>
              )}
              {product.operatingSystem && (
                <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                  <span className="text-slate-500">OS Version</span>
                  <span className="text-white font-medium">{product.operatingSystem}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                <span className="text-slate-500">Network Lock</span>
                <span className="text-white font-medium capitalize">
                  {product.networkLock?.replace("-", " ") || "Unlocked"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                <span className="text-slate-500">5G Support</span>
                <span className="text-white font-medium">{product.is5g ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                <span className="text-slate-500">Dual SIM</span>
                <span className="text-white font-medium">{product.dualSim ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                <span className="text-slate-500">Warranty</span>
                <span className="text-white font-medium capitalize">
                  {product.warrantyOption?.replace("-", " ")} {product.warrantyDuration ? `(${product.warrantyDuration})` : ""}
                </span>
              </div>

              {/* Dynamic specs created by admin */}
              {product.customFeatures &&
                product.customFeatures
                  .filter((feat: any) => feat.enabled)
                  .map((feat: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-slate-850/40 text-sm">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        {feat.icon && <IconRenderer name={feat.icon} className="h-4 w-4 text-red-400" />}
                        {feat.name}
                      </span>
                      <span className="text-white font-medium">{feat.value}</span>
                    </div>
                  ))}
            </div>

            {/* Accessories / Box checklist */}
            <div className="mt-8 pt-6 border-t border-slate-850/60">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Included in Box</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`rounded-full p-0.5 border ${product.boxAndAccessories?.boxAvailable ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-600"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className={product.boxAndAccessories?.boxAvailable ? "text-slate-200" : "text-slate-600"}>Retail Box</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`rounded-full p-0.5 border ${product.boxAndAccessories?.invoiceAvailable ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-600"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className={product.boxAndAccessories?.invoiceAvailable ? "text-slate-200" : "text-slate-600"}>Invoice Bill</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`rounded-full p-0.5 border ${product.boxAndAccessories?.originalCharger ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-600"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className={product.boxAndAccessories?.originalCharger ? "text-slate-200" : "text-slate-600"}>Charger block</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`rounded-full p-0.5 border ${product.boxAndAccessories?.originalCable ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-600"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className={product.boxAndAccessories?.originalCable ? "text-slate-200" : "text-slate-600"}>Charging Cable</span>
                </div>
              </div>
              {product.boxAndAccessories?.accessoriesIncluded && (
                <p className="text-xs text-slate-500 mt-4 italic">
                  Additional items: {product.boxAndAccessories.accessoriesIncluded}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Known Issues Damage Block */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <div className="rounded-3xl border border-red-950/20 bg-red-950/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Cosmetic & Functional Damage Check
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We list all known issues transparently so you know exactly what you are purchasing before you contact us.
            </p>

            {(!product.knownIssues || product.knownIssues.length === 0) ? (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 text-emerald-400">
                <Check className="h-5 w-5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">No known issues logged!</p>
                  <p className="text-slate-400 mt-0.5">This device is functionally and cosmetically verified clean.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {product.knownIssues.map((issue: any, idx: number) => {
                  const severityConfig = {
                    light: { text: "Light issue", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                    medium: { text: "Medium wear", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                    heavy: { text: "Heavy damage", bg: "bg-red-500/10 text-red-400 border-red-500/20" },
                  }[issue.severity as string] || { text: "Issue", bg: "bg-slate-800 text-slate-400" };

                  return (
                    <div key={idx} className="rounded-2xl border border-slate-850 bg-slate-950/60 p-4 flex gap-3 items-start">
                      <div className="rounded-lg bg-slate-900 border border-slate-850 p-2 text-red-400 flex-shrink-0">
                        <IconRenderer name={issue.icon || "AlertCircle"} className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-sm text-slate-200">{issue.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severityConfig.bg}`}>
                            {severityConfig.text}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{issue.description}</p>
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

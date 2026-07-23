import React from "react";
import Link from "next/link";
import { Eye, MessageSquare, Tag } from "lucide-react";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSold = product.status === "sold";
  const isOutOfStock = product.status === "out-of-stock";

  // Calculate discount percentage
  const discount =
    product.originalLaunchPrice && product.originalLaunchPrice > product.price
      ? Math.round(
          ((product.originalLaunchPrice - product.price) / product.originalLaunchPrice) * 100
        )
      : null;

  // Status mapping
  const statusConfig = {
    available: { label: "Available", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    reserved: { label: "Reserved", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    sold: { label: "Sold", bg: "bg-slate-700/20 text-slate-400 border-slate-700/30" },
    "out-of-stock": { label: "Out of Stock", bg: "bg-red-500/10 text-red-400 border-red-500/30" },
    repairing: { label: "Repairing", bg: "bg-red-500/10 text-red-400 border-red-500/30" },
    "coming-soon": { label: "Coming Soon", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  }[product.status as string] || { label: "Unknown", bg: "bg-slate-500/10 text-slate-400 border-slate-500/30" };

  // Condition mapping labels
  const conditionConfig = {
    "like-new": "Like New",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
  }[product.condition as string] || product.condition;

  const cardContent = (
    <div className={`relative flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/40 p-4 transition-all duration-300 ${
      isSold
        ? ""
        : "hover:border-slate-700 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/20"
    }`}>
      {/* Grayscale overlay for Sold / Out of stock */}
      {(isSold || isOutOfStock) && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-slate-950/40 backdrop-blur-[1px] pointer-events-none" />
      )}

      {/* Thumbnail Image Container */}
      <div className="relative mb-4 aspect-[9/16] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center">
        {/* Display Badge Overlay */}
        <span
          className={`absolute top-2 left-2 z-20 rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusConfig.bg}`}
        >
          {statusConfig.label}
        </span>

        {discount && !isSold && !isOutOfStock && (
          <span className="absolute top-2 right-2 z-20 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-md">
            {discount}% OFF
          </span>
        )}

        {/* Sold / Out of Stock centered badge overlay */}
        {(isSold || isOutOfStock) && (
          <div className="absolute z-20 rounded-lg bg-slate-950/90 border border-slate-800 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-slate-950/50">
            {isSold ? "SOLD" : "OUT OF STOCK"}
          </div>
        )}

        {/* Main Image — prefer uploaded mainImage, fall back to YouTube CDN, then logo */}
        <img
          src={(() => {
            // 1. Try the uploaded mainImage
            const img = product.mainImage;
            if (img) {
              const filename = typeof img === "object" ? img.filename : null;
              if (filename) return `/media/${filename}`;
              const url = typeof img === "object" ? img.url : img;
              if (url && typeof url === "string") {
                if (url.startsWith("/api/media/file/")) return url.replace("/api/media/file/", "/media/");
                return url;
              }
            }
            // 2. Try YouTube Shorts thumbnail directly from CDN
            const ytUrl = product.youtubeShortsUrl;
            if (ytUrl) {
              const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
              const match = String(ytUrl).match(regExp);
              const videoId = match && match[2]?.length === 11 ? match[2] : null;
              if (videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            }
            // 3. Fallback to site logo
            return "/media/logo.png";
          })()}
          alt={product.title}
          className={`h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 ${
            isSold || isOutOfStock ? "filter grayscale opacity-45 blur-[2px]" : ""
          }`}
          loading="lazy"
        />
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-grow">
        {/* Brand & Category row */}
        <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-400 uppercase tracking-wider">
            {typeof product.brand === "object" ? product.brand.name : "Device"}
          </span>
          <span>&bull;</span>
          <span>{conditionConfig}</span>
        </div>

        {/* Product Title */}
        <h3 className="mb-2 font-bold text-slate-100 line-clamp-1 group-hover:text-red-400 transition-colors">
          {product.title}
        </h3>

        {/* Specs tags row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.storage && (
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
              {product.storage}
            </span>
          )}
          {product.ram && (
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
              {product.ram} RAM
            </span>
          )}
          {product.batteryHealth && (
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-red-400 flex items-center gap-0.5">
              <Tag className="h-3 w-3" />
              {product.batteryHealth}% BH
            </span>
          )}
        </div>

        {/* Pricing & Footer row */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalLaunchPrice && (
              <span className="text-xs text-slate-500 line-through">
                ₹{product.originalLaunchPrice}
              </span>
            )}
            <span className="text-lg font-black text-white">
              ₹{product.price}
            </span>
          </div>

          {/* Micro counters in footer of card */}
          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <span className="flex items-center gap-0.5">
              <Eye className="h-3.5 w-3.5" />
              {product.viewCount || 0}
            </span>
            <span className="flex items-center gap-0.5 text-emerald-500/80">
              <MessageSquare className="h-3.5 w-3.5" />
              {product.whatsappClickCount || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isSold) {
    return <div className="block h-full cursor-not-allowed">{cardContent}</div>;
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      {cardContent}
    </Link>
  );
}

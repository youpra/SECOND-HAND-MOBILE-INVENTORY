import React from "react";
import { getPayload } from "payload";
import config from "../payload.config";
import { Eye, MessageSquare, Tag, ShoppingBag, FolderOpen, Award, BarChart2 } from "lucide-react";

export async function AdminDashboard() {
  const payload = await getPayload({ config });

  // Fetch counts and metrics
  let totalProducts = 0;
  let availableProducts = 0;
  let reservedProducts = 0;
  let soldProducts = 0;
  let categoriesCount = 0;
  let brandsCount = 0;
  let topViewed: any[] = [];
  let topContacted: any[] = [];

  try {
    const productsRes = await payload.find({
      collection: "products",
      limit: 1000,
    });
    totalProducts = productsRes.totalDocs;
    availableProducts = productsRes.docs.filter((p: any) => p.status === "available").length;
    reservedProducts = productsRes.docs.filter((p: any) => p.status === "reserved").length;
    soldProducts = productsRes.docs.filter((p: any) => p.status === "sold").length;

    const categoriesRes = await payload.find({
      collection: "categories",
      limit: 1,
    });
    categoriesCount = categoriesRes.totalDocs;

    const brandsRes = await payload.find({
      collection: "brands",
      limit: 1,
    });
    brandsCount = brandsRes.totalDocs;

    // Fetch top viewed products
    const viewedRes = await payload.find({
      collection: "products",
      sort: "-viewCount",
      limit: 5,
    });
    topViewed = viewedRes.docs;

    // Fetch top contacted products
    const contactedRes = await payload.find({
      collection: "products",
      sort: "-whatsappClickCount",
      limit: 5,
    });
    topContacted = contactedRes.docs;
  } catch (err) {
    console.error("Failed to fetch dashboard metrics:", err);
  }

  return (
    <div className="w-full flex flex-col gap-6 py-6 px-1">
      {/* Dashboard Section Title */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory Analytics</h1>
          <p className="text-zinc-500 text-xs mt-1">Real-time statistics of second-hand electronic assets</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400">
          <BarChart2 className="h-3.5 w-3.5 text-indigo-400" />
          Live Metrics
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total Products</span>
            <ShoppingBag className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalProducts}</div>
        </div>

        {/* Available */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Available</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white">{availableProducts}</div>
        </div>

        {/* Reserved */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Reserved</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-white">{reservedProducts}</div>
        </div>

        {/* Sold */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Sold</span>
            <span className="h-2 w-2 rounded-full bg-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white">{soldProducts}</div>
        </div>

        {/* Categories */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Categories</span>
            <FolderOpen className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{categoriesCount}</div>
        </div>

        {/* Brands */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Brands</span>
            <Award className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{brandsCount}</div>
        </div>
      </div>

      {/* Top Performing Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
            <Eye className="h-4 w-4 text-indigo-400" />
            Most Viewed Products
          </h3>
          <div className="flex flex-col gap-2">
            {topViewed.map((prod: any) => (
              <div key={prod.id} className="flex items-center justify-between text-xs py-1">
                <span className="text-zinc-300 font-medium truncate max-w-xs">{prod.title}</span>
                <span className="text-zinc-500 flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {prod.viewCount || 0} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Contacted */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            Most Contacted (WhatsApp clicks)
          </h3>
          <div className="flex flex-col gap-2">
            {topContacted.map((prod: any) => (
              <div key={prod.id} className="flex items-center justify-between text-xs py-1">
                <span className="text-zinc-300 font-medium truncate max-w-xs">{prod.title}</span>
                <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded">
                  {prod.whatsappClickCount || 0} clicks
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { getPayload } from "payload";
import config from "../payload.config";
import { Eye, MessageSquare, ShoppingBag, FolderOpen, Award, BarChart2 } from "lucide-react";

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

  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  };

  return (
    <div style={{ ...fontStyle, width: "100%", display: "flex", flexDirection: "column", gap: "24px", padding: "20px 0", boxSizing: "border-box" }}>
      {/* Dashboard Section Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #27272a", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.025em" }}>Inventory Analytics</h1>
          <p style={{ margin: "4px 0 0 0", color: "#71717a", fontSize: "12px" }}>Real-time statistics of second-hand electronic assets</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "8px", border: "1px solid #27272a", backgroundColor: "rgba(39, 39, 42, 0.5)", padding: "6px 12px", fontSize: "12px", color: "#a1a1aa" }}>
          <BarChart2 size={14} style={{ color: "#ef4444" }} />
          Live Metrics
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", width: "100%" }}>
        {/* Total Products */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.4)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ color: "#71717a", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Products</span>
            <ShoppingBag size={16} style={{ color: "#ef4444" }} />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>{totalProducts}</div>
        </div>

        {/* Available */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.4)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", width: "100%", justifyContent: "space-between" }}>
            <span style={{ color: "#71717a", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Available</span>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>{availableProducts}</div>
        </div>

        {/* Reserved */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.4)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ color: "#71717a", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Reserved</span>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>{reservedProducts}</div>
        </div>

        {/* Sold */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.4)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ color: "#71717a", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sold</span>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#71717a" }} />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>{soldProducts}</div>
        </div>

        {/* Categories */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.4)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ color: "#71717a", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Categories</span>
            <FolderOpen size={16} style={{ color: "#c084fc" }} />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>{categoriesCount}</div>
        </div>

        {/* Brands */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.4)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ color: "#71717a", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Brands</span>
            <Award size={16} style={{ color: "#22d3ee" }} />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>{brandsCount}</div>
        </div>
      </div>

      {/* Top Performing Grids */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", width: "100%" }}>
        {/* Most Viewed */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.3)", padding: "20px", boxSizing: "border-box" }}>
          <h3 style={{ margin: "0 0 16px 0", fontWeight: "bold", color: "#ffffff", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #27272a", paddingBottom: "10px" }}>
            <Eye size={16} style={{ color: "#ef4444" }} />
            Most Viewed Products
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topViewed.map((prod: any) => (
              <div key={prod.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", padding: "4px 0" }}>
                <span style={{ color: "#d4d4d8", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>{prod.title}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#a1a1aa", backgroundColor: "#09090b", padding: "2px 8px", borderRadius: "4px", border: "1px solid #27272a", fontSize: "11px", whiteSpace: "nowrap" }}>
                  {prod.viewCount || 0} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Contacted */}
        <div style={{ borderRadius: "12px", border: "1px solid #27272a", backgroundColor: "rgba(24, 24, 27, 0.3)", padding: "20px", boxSizing: "border-box" }}>
          <h3 style={{ margin: "0 0 16px 0", fontWeight: "bold", color: "#ffffff", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #27272a", paddingBottom: "10px" }}>
            <MessageSquare size={16} style={{ color: "#34d399" }} />
            Most Contacted (WhatsApp clicks)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topContacted.map((prod: any) => (
              <div key={prod.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", padding: "4px 0" }}>
                <span style={{ color: "#d4d4d8", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>{prod.title}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#34d399", backgroundColor: "rgba(4, 120, 87, 0.1)", padding: "2px 8px", borderRadius: "4px", border: "1px solid rgba(4, 120, 87, 0.2)", fontSize: "11px", whiteSpace: "nowrap" }}>
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

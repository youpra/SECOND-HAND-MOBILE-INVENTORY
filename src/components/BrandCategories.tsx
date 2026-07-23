import Link from "next/link";

const BRANDS = [
  { name: "Apple",    slug: "apple",    img: "/media/brand-apple.jpg",    bg: "#eef3ff" },
  { name: "Samsung",  slug: "samsung",  img: "/media/brand-samsung.jpg",  bg: "#f3efff" },
  { name: "OnePlus",  slug: "oneplus",  img: "/media/brand-oneplus.jpg",  bg: "#edfaf3" },
  { name: "Google",   slug: "google",   img: "/media/brand-google.jpg",   bg: "#fff3ef" },
  { name: "Nothing",  slug: "nothing",  img: "/media/brand-nothing.jpg",  bg: "#f0f0f0" },
  { name: "Vivo",     slug: "vivo",     img: "/media/brand-vivo.jpg",     bg: "#edf6ff" },
  { name: "Xiaomi",   slug: "xiaomi",   img: "/media/brand-xiaomi.jpg",   bg: "#f5f5f5" },
  { name: "Motorola", slug: "motorola", img: "/media/brand-motorola.jpg", bg: "#fff8ef" },
];

export function BrandCategories() {
  return (
    <section style={{ background: "#fff", padding: "36px 0 32px", borderBottom: "1px solid var(--border-light)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>

        {/* Title */}
        <div style={{ marginBottom: 22 }}>
          <h2 className="section-title" style={{ textAlign: "left", color: "var(--dark)", marginBottom: 2 }}>
            Shop by Brand
          </h2>
          <p style={{ fontSize: 13, color: "var(--gray-2)" }}>
            Browse verified pre-owned phones by your favourite brand
          </p>
        </div>

        {/* Scrollable row of cards */}
        <div style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 8,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
          className="brand-scroll-row">

          {BRANDS.map(({ name, slug, img, bg }) => (
            <Link
              key={slug}
              href={`/?brand=${slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
                flexShrink: 0,
                width: 112,
              }}
            >
              {/* Image card */}
              <div style={{
                width: 112, height: 112,
                borderRadius: 16,
                background: bg,
                border: "1.5px solid rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 9,
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
                className="brand-card-img">
                <img
                  src={img}
                  alt={name}
                  style={{
                    width: "90%", height: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Label */}
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: "var(--dark)",
                letterSpacing: "0.01em",
              }}>{name}</span>
            </Link>
          ))}

          {/* "All Brands" card */}
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 0,
              width: 112,
            }}
          >
            <div style={{
              width: 112, height: 112,
              borderRadius: 16,
              background: "var(--dark)",
              border: "1.5px solid var(--border-dark)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 9,
              flexDirection: "column",
              gap: 6,
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
              className="brand-card-img">
              <span style={{ fontSize: 24 }}>📱</span>
              <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: "0.05em" }}>
                ALL
              </span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)" }}>View All</span>
          </Link>
        </div>
      </div>

      <style>{`
        .brand-scroll-row::-webkit-scrollbar { display: none; }
        .brand-card-img:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.13);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}

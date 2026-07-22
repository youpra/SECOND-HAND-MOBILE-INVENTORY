import { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@/payload.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];

  try {
    const productsRes = await payload.find({
      collection: "products",
      limit: 500,
    });
    products = productsRes.docs;

    const categoriesRes = await payload.find({
      collection: "categories",
      limit: 100,
    });
    categories = categoriesRes.docs;

    const brandsRes = await payload.find({
      collection: "brands",
      limit: 100,
    });
    brands = brandsRes.docs;
  } catch (err) {
    console.error("Failed to fetch documents for sitemap generation: ", err);
  }

  const productEntries = products.map((prod: any) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: new Date(prod.updatedAt || prod.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((cat: any) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(cat.updatedAt || cat.createdAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const brandEntries = brands.map((brand: any) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(brand.updatedAt || brand.createdAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryEntries,
    ...brandEntries,
    ...productEntries,
  ];
}

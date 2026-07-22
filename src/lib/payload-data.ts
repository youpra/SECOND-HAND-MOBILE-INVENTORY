import { getPayload } from "payload";
import config from "@/payload.config";
import { cache } from "react";

export const getSiteCategories = cache(async () => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "categories",
      limit: 100,
      sort: "name",
    });
    return res.docs.filter((cat: any) => cat.active !== false);
  } catch (err) {
    console.warn("Failed to fetch categories during build, using empty fallback:", err);
    return [];
  }
});

export const getSiteBrands = cache(async () => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "brands",
      limit: 100,
      sort: "name",
    });
    return res.docs;
  } catch (err) {
    console.warn("Failed to fetch brands during build, using empty fallback:", err);
    return [];
  }
});

export const getSiteSettings = cache(async () => {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({
      slug: "settings",
    });
    return settings;
  } catch (err) {
    console.warn("Failed to fetch settings during build, using default fallback:", err);
    return {
      whatsappNumber: "+919876543210",
      contactPhoneNumber: "+919876543210",
    } as any;
  }
});

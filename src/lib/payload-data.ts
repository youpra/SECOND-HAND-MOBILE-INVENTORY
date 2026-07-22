import { getPayload } from "payload";
import config from "@/payload.config";
import { cache } from "react";

export const getSiteCategories = cache(async () => {
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "categories",
    limit: 100,
    sort: "name",
  });
  return res.docs.filter((cat: any) => cat.active !== false);
});

export const getSiteBrands = cache(async () => {
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "brands",
    limit: 100,
    sort: "name",
  });
  return res.docs;
});

export const getSiteSettings = cache(async () => {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({
    slug: "settings",
  });
  return settings;
});

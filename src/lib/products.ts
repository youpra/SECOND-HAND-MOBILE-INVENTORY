import { getPayload } from "payload";
import config from "@/payload.config";

export interface FilterParams {
  search?: string;
  category?: string;
  brand?: string;
  status?: string | string[];
  condition?: string | string[];
  priceMin?: string;
  priceMax?: string;
  batteryMin?: string;
  batteryMax?: string;
  is5g?: string;
  dualSim?: string;
  warrantyOption?: string;
  sort?: string;
}

export async function getFilteredProducts(params: FilterParams) {
  const payload = await getPayload({ config });
  const query: any = { and: [] };

  // 1. Category Filter (by slug)
  if (params.category) {
    const categoryDoc = await payload.find({
      collection: "categories",
      where: { slug: { equals: params.category } },
      limit: 1,
    });
    if (categoryDoc.docs.length > 0) {
      query.and.push({ category: { equals: categoryDoc.docs[0].id } });
    } else {
      // Return empty if category is specified but not found
      return [];
    }
  }

  // 2. Brand Filter (by slug)
  if (params.brand) {
    const brandDoc = await payload.find({
      collection: "brands",
      where: { slug: { equals: params.brand } },
      limit: 1,
    });
    if (brandDoc.docs.length > 0) {
      query.and.push({ brand: { equals: brandDoc.docs[0].id } });
    } else {
      return [];
    }
  }

  // 3. Status Filter (supports multi-select)
  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    query.and.push({ status: { in: statuses } });
  }

  // 4. Condition Filter (supports multi-select)
  if (params.condition) {
    const conditions = Array.isArray(params.condition) ? params.condition : [params.condition];
    query.and.push({ condition: { in: conditions } });
  }

  // 5. Search text (matches title, model, or description)
  if (params.search) {
    query.and.push({
      or: [
        { title: { like: params.search } },
        { model: { like: params.search } },
      ],
    });
  }

  // 6. Price Range
  if (params.priceMin || params.priceMax) {
    const priceQuery: any = {};
    if (params.priceMin) priceQuery.greater_than_equal = parseFloat(params.priceMin);
    if (params.priceMax) priceQuery.less_than_equal = parseFloat(params.priceMax);
    query.and.push({ price: priceQuery });
  }

  // 7. Battery Health Range
  if (params.batteryMin || params.batteryMax) {
    const batteryQuery: any = {};
    if (params.batteryMin) batteryQuery.greater_than_equal = parseInt(params.batteryMin, 10);
    if (params.batteryMax) batteryQuery.less_than_equal = parseInt(params.batteryMax, 10);
    query.and.push({ batteryHealth: batteryQuery });
  }

  // 8. Boolean Toggles
  if (params.is5g === "true") {
    query.and.push({ is5g: { equals: true } });
  }
  if (params.dualSim === "true") {
    query.and.push({ dualSim: { equals: true } });
  }

  // 9. Warranty Option Filter
  if (params.warrantyOption) {
    query.and.push({ warrantyOption: { equals: params.warrantyOption } });
  }

  // Clean query if no constraints
  const finalWhere = query.and.length > 0 ? query : {};

  // 10. Sorting
  let sortField = "-createdAt"; // Default: Newest
  if (params.sort) {
    switch (params.sort) {
      case "priceAsc":
        sortField = "price";
        break;
      case "priceDesc":
        sortField = "-price";
        break;
      case "viewsDesc":
        sortField = "-viewCount";
        break;
      case "contactsDesc":
        sortField = "-whatsappClickCount";
        break;
      case "oldest":
        sortField = "createdAt";
        break;
      case "recentlyUpdated":
        sortField = "-updatedAt";
        break;
      case "newest":
      default:
        sortField = "-createdAt";
        break;
    }
  }

  const result = await payload.find({
    collection: "products",
    where: finalWhere,
    sort: sortField,
    limit: 100,
  });

  return result.docs;
}

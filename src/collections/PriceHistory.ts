import { CollectionConfig } from "payload";

export const PriceHistory: CollectionConfig = {
  slug: "price-history",
  admin: {
    useAsTitle: "price",
    defaultColumns: ["product", "price", "changeDate"],
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
    {
      name: "price",
      type: "number",
      required: true,
    },
    {
      name: "changeDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

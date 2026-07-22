import { CollectionConfig } from "payload";

export const Brands: CollectionConfig = {
  slug: "brands",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "featured"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            if (data?.name) return data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return value;
          },
        ],
      },
    },
    {
      name: "logo",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "featured",
      type: "boolean",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "seoTitle",
      type: "text",
      label: "SEO Title override",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "SEO Description override",
      admin: {
        position: "sidebar",
      },
    },
  ],
};

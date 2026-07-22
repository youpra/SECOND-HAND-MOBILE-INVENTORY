import { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  admin: {
    group: "Config",
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "SecondHand Electronics",
    },
    {
      name: "whatsappNumber",
      type: "text",
      required: true,
      label: "WhatsApp Number (with country code, e.g. +919876543210)",
      admin: {
        placeholder: "+919876543210",
        description: "Must start with country code, no spaces or special symbols.",
      },
    },
    {
      name: "contactPhoneNumber",
      type: "text",
      required: true,
      label: "Contact Phone Number (for normal voice calling)",
      admin: {
        placeholder: "+919876543210",
      },
    },
    {
      name: "seoTitle",
      type: "text",
      label: "Global SEO Title Override",
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "Global SEO Description Override",
    },
    {
      name: "logo",
      type: "relationship",
      relationTo: "media",
    },
  ],
};

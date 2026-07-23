import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "brand", "model", "status", "price", "condition"],
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // Automatically manage status dates
        if (data.status === "sold" && originalDoc?.status !== "sold") {
          data.soldDate = new Date().toISOString();
        }
        if (data.status === "reserved" && originalDoc?.status !== "reserved") {
          data.reservedDate = new Date().toISOString();
        }

        // Auto-fetch YouTube Shorts thumbnail if provided and changed
        if (data.youtubeShortsUrl && data.youtubeShortsUrl !== originalDoc?.youtubeShortsUrl) {
          try {
            // Extract 11-character video ID from YouTube/Shorts URL
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = data.youtubeShortsUrl.match(regExp);
            const videoId = (match && match[2].length === 11) ? match[2] : null;

            if (videoId) {
              console.log(`Extracting YouTube Shorts ID: ${videoId}, fetching thumbnail...`);
              let response = await fetch(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
              let fileBuffer = Buffer.from(await response.arrayBuffer());
              let filename = `yt_${videoId}_max.jpg`;

              if (response.status !== 200) {
                const fallbackResponse = await fetch(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                fileBuffer = Buffer.from(await fallbackResponse.arrayBuffer());
                filename = `yt_${videoId}_hq.jpg`;
              }

              // Create a media record in database
              const media = await req.payload.create({
                collection: 'media',
                data: {
                  alt: `YouTube Shorts Thumbnail for ${data.title || "Product"}`,
                },
                file: {
                  data: fileBuffer,
                  name: filename,
                  mimetype: "image/jpeg",
                  size: fileBuffer.length,
                },
              });

              // Assign new media to mainImage
              data.mainImage = media.id;
              console.log(`Successfully auto-created thumbnail media record ID: ${media.id}`);
            }
          } catch (err) {
            req.payload.logger.error("Failed to auto-fetch YouTube Shorts thumbnail: " + err);
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Automatically create a price history entry if price is set or changed
        if (operation === "create" || (operation === "update" && doc.price !== previousDoc?.price)) {
          try {
            await req.payload.create({
              collection: "price-history",
              data: {
                product: doc.id,
                price: doc.price,
                changeDate: new Date().toISOString(),
              },
            });
          } catch (err) {
            req.payload.logger.error("Failed to write price history entry: " + err);
          }
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
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
            if (data?.title) return data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return value;
          },
        ],
      },
    },
    {
      name: "brand",
      type: "relationship",
      relationTo: "brands",
      required: true,
    },
    {
      name: "model",
      type: "text",
      required: true,
      admin: {
        placeholder: "e.g. Galaxy S23 Ultra, iPhone 15 Pro",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "available",
      options: [
        { label: "Available", value: "available" },
        { label: "Reserved", value: "reserved" },
        { label: "Sold", value: "sold" },
        { label: "Out of Stock", value: "out-of-stock" },
        { label: "Repairing", value: "repairing" },
        { label: "Coming Soon", value: "coming-soon" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          admin: {
            placeholder: "e.g. 599",
          },
        },
        {
          name: "originalLaunchPrice",
          type: "number",
          admin: {
            placeholder: "e.g. 999",
            description: "Original retail price, used to calculate savings.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "ram",
          type: "text",
          admin: {
            placeholder: "e.g. 8 GB, 12 GB",
          },
        },
        {
          name: "storage",
          type: "text",
          admin: {
            placeholder: "e.g. 128 GB, 256 GB, 1 TB",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "condition",
          type: "select",
          required: true,
          options: [
            { label: "Like New (Mint)", value: "like-new" },
            { label: "Excellent (Very Minor Scratches)", value: "excellent" },
            { label: "Good (Normal Wear & Tear)", value: "good" },
            { label: "Fair (Visible Scratches/Dents)", value: "fair" },
          ],
        },
        {
          name: "batteryHealth",
          type: "number",
          admin: {
            placeholder: "e.g. 92",
            description: "Percentage health (if applicable, e.g. 80-100)",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "operatingSystem",
          type: "text",
          admin: {
            placeholder: "e.g. iOS 17.5, Android 14",
          },
        },
        {
          name: "color",
          type: "text",
          admin: {
            placeholder: "e.g. Titanium Gray, Phantom Black",
          },
        },
      ],
    },
    {
      name: "networkLock",
      type: "select",
      defaultValue: "unlocked",
      options: [
        { label: "Unlocked", value: "unlocked" },
        { label: "Locked to Carrier", value: "locked-carrier" },
        { label: "Factory Unlocked", value: "factory-unlocked" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "dualSim",
          type: "boolean",
          defaultValue: false,
        },
        {
          name: "is5g",
          type: "boolean",
          defaultValue: false,
        },
        {
          name: "yearReleased",
          type: "number",
          admin: {
            placeholder: "e.g. 2023",
          },
        },
      ],
    },
    {
      name: "imei",
      type: "text",
      admin: {
        description: "Hidden from public website. Used internally for tracking device history.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "warrantyOption",
          type: "select",
          required: true,
          defaultValue: "no-warranty",
          options: [
            { label: "No Warranty", value: "no-warranty" },
            { label: "Store Warranty", value: "store-warranty" },
            { label: "Manufacturer Warranty", value: "manufacturer-warranty" },
            { label: "Seller Warranty", value: "seller-warranty" },
          ],
        },
        {
          name: "warrantyDuration",
          type: "text",
          admin: {
            placeholder: "e.g. 3 Months, 1 Year remaining",
          },
        },
      ],
    },
    {
      name: "purchaseDate",
      type: "date",
    },
    {
      name: "boxAndAccessories",
      type: "group",
      label: "Box & Accessories Included",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "invoiceAvailable",
              type: "boolean",
              defaultValue: false,
            },
            {
              name: "boxAvailable",
              type: "boolean",
              defaultValue: false,
            },
            {
              name: "originalCharger",
              type: "boolean",
              defaultValue: false,
            },
            {
              name: "originalCable",
              type: "boolean",
              defaultValue: false,
            },
          ],
        },
        {
          name: "accessoriesIncluded",
          type: "text",
          admin: {
            placeholder: "e.g. Case, screen protector, stylus",
          },
        },
      ],
    },
    {
      name: "mainImage",
      type: "relationship",
      relationTo: "media",
      required: false,
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        {
          name: "image",
          type: "relationship",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "videoUrl",
      type: "text",
      admin: {
        placeholder: "YouTube link or direct video URL",
      },
    },
    {
      name: "youtubeShortsUrl",
      type: "text",
      label: "YouTube Shorts URL",
      admin: {
        description: "Add a YouTube Shorts link. The system will automatically fetch its thumbnail as the product's main image.",
        placeholder: "e.g. https://www.youtube.com/shorts/VIDEO_ID",
      },
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "customFeatures",
      type: "array",
      label: "Dynamic Features (Custom Specifications)",
      admin: {
        description: "Add custom specifications that are not predefined (e.g. Screen Size, Refresh Rate, USB Type)",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              admin: { placeholder: "e.g. Screen Size" },
            },
            {
              name: "value",
              type: "text",
              required: true,
              admin: { placeholder: "e.g. 6.8 Inches" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "icon",
              type: "text",
              label: "Icon Name (Lucide)",
              admin: { placeholder: "e.g. Maximize2, Cpu, Zap, Speaker" },
            },
            {
              name: "enabled",
              type: "boolean",
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: "knownIssues",
      type: "array",
      label: "Known Issues (Damage Section)",
      admin: {
        description: "List cosmetic or functional damage so customers have full transparency before contacting.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              admin: { placeholder: "e.g. Micro Scratches, Battery Degradation" },
            },
            {
              name: "severity",
              type: "select",
              required: true,
              defaultValue: "light",
              options: [
                { label: "Light (Barely visible)", value: "light" },
                { label: "Medium (Normal wear/visible)", value: "medium" },
                { label: "Heavy (Cracked/Broken component)", value: "heavy" },
              ],
            },
          ],
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          admin: { placeholder: "Describe the damage in detail." },
        },
        {
          name: "icon",
          type: "text",
          label: "Icon Name (Lucide)",
          admin: { placeholder: "e.g. AlertTriangle, EyeOff, VolumeX, WifiOff" },
        },
      ],
    },
    {
      name: "viewCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "whatsappClickCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "callClickCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "soldDate",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "reservedDate",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "adminNotes",
      type: "textarea",
      label: "Internal Admin Notes",
      admin: {
        description: "Private notes for internal inventory management.",
      },
    },
    {
      name: "customerNotes",
      type: "textarea",
      label: "Customer Facing Notes",
      admin: {
        description: "Alert notes displayed directly on the product card/details page.",
      },
    },
    {
      name: "barcode",
      type: "text",
      admin: {
        position: "sidebar",
        placeholder: "For physical inventory scanner",
      },
    },
    {
      name: "qrCode",
      type: "text",
      admin: {
        position: "sidebar",
        placeholder: "For shelf QR mapping",
      },
    },
    {
      name: "favoritesCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ],
};

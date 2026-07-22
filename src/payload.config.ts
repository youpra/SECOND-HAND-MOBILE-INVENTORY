import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Brands } from "./collections/Brands";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { PriceHistory } from "./collections/PriceHistory";
import { Products } from "./collections/Products";
import { Users } from "./collections/Users";
import { Settings } from "./globals/Settings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ["@/components/AdminDashboard#AdminDashboard"],
    },
  },
  collections: [Users, Categories, Brands, Products, Media, PriceHistory],
  globals: [Settings],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "YOUR_FALLBACK_DEV_SECRET_DO_NOT_USE_IN_PRODUCTION",
  db: process.env.DATABASE_URI
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
      })
    : sqliteAdapter({
        client: {
          url: "file:./local.db",
        },
      }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});

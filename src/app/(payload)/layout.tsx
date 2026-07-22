import React from "react";
import config from "@/payload.config";
import "@payloadcms/next/css";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap.js";
import type { ServerFunctionClient } from "payload";

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      importMap={importMap}
      config={config}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}

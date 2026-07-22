import React from "react";
import config from "@/payload.config";
import "@payloadcms/next/css";
import { RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap.js";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout importMap={importMap} config={config}>
      {children}
    </RootLayout>
  );
}

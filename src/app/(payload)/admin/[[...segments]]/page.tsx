import { RootPage, generatePageMetadata } from "@payloadcms/next/views";

type Args = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const doubleEscapedRoute = true;

export default async function Page({ params, searchParams }: Args) {
  return RootPage({ params, searchParams });
}

export const generateMetadata = generatePageMetadata;

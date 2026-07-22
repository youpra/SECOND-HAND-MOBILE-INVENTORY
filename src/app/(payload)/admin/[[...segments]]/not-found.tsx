import { NotFoundPage } from "@payloadcms/next/views";

type Args = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export default async function NotFound({ params, searchParams }: Args) {
  return NotFoundPage({ params, searchParams });
}

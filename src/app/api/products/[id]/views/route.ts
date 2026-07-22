import { getPayload } from "payload";
import config from "@/payload.config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = await getPayload({ config });

  try {
    const product = await payload.findByID({
      collection: "products",
      id,
    });

    const updated = await payload.update({
      collection: "products",
      id,
      data: {
        viewCount: (product.viewCount || 0) + 1,
      },
    });

    return NextResponse.json({ success: true, views: updated.viewCount });
  } catch (err) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

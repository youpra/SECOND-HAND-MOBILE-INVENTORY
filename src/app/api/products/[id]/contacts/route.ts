import { getPayload } from "payload";
import config from "@/payload.config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "whatsapp" or "call"

  const payload = await getPayload({ config });

  try {
    const product = await payload.findByID({
      collection: "products",
      id,
    });

    const data: any = {};
    if (type === "call") {
      data.callClickCount = (product.callClickCount || 0) + 1;
    } else {
      data.whatsappClickCount = (product.whatsappClickCount || 0) + 1;
    }

    const updated = await payload.update({
      collection: "products",
      id,
      data,
    });

    return NextResponse.json({
      success: true,
      whatsappClicks: updated.whatsappClickCount,
      callClicks: updated.callClickCount,
    });
  } catch (err) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Add product identifier
    const trackingData = {
      ...body,
      product: "brandsnap",
      timestamp: new Date().toISOString(),
    };

    // Log for now (could forward to analytics service)
    console.log("[BrandSnap Track]", JSON.stringify(trackingData));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

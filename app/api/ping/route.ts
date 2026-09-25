import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PingModel } from "@/lib/models/ping";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    throw new Error("缺少 CRON_SECRET 環境變數");
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

async function recordPing() {
  await connectToDatabase();
  const ping = await PingModel.create({ pingedAt: new Date() });
  return ping;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const ping = await recordPing();
    return NextResponse.json({ ok: true, pingedAt: ping.pingedAt }, { status: 201 });
  } catch (error) {
    console.error("Failed to record ping:", error);
    return NextResponse.json({ ok: false, error: "Failed to record ping" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

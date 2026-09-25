import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PingModel } from "@/lib/models/ping";

export const dynamic = "force-dynamic";

async function recordPing() {
  await connectToDatabase();
  const ping = await PingModel.create({ pingedAt: new Date() });
  return ping;
}

export async function GET() {
  try {
    const ping = await recordPing();
    return NextResponse.json({ ok: true, pingedAt: ping.pingedAt }, { status: 201 });
  } catch (error) {
    console.error("Failed to record ping:", error);
    return NextResponse.json({ ok: false, error: "Failed to record ping" }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}

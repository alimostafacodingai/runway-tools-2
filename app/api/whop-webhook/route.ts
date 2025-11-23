import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // We will implement this later when we connect real Whop webhooks.
  console.log("Webhook hit");
  return NextResponse.json({ ok: true });
}

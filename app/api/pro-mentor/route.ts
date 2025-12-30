import { NextResponse } from "next/server";
import { runMentor } from "@/lib/mentor/engine";


export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? "");
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message.trim()) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const answer = runMentor({
      message,
      history,
    });

    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}

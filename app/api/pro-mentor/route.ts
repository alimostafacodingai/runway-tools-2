import { NextResponse } from "next/server";
import { runMentor } from "@/lib/mentor/runtime";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

type MentorResult =
  | string
  | {
      answer: string;
      debugInfo?: unknown;
    };

export async function POST(req: Request) {
  const requestId = randomUUID();
  const startedAt = Date.now();

  try {
    const body = await req.json();
    const message = String(body?.message ?? "");
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message.trim()) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const debug =
      process.env.MENTOR_DEBUG === "true" ||
      req.headers.get("x-mentor-debug") === "1";

    const result = (await runMentor({
      message,
      history,
      debug,
      requestId,
    })) as MentorResult;

    const answer = typeof result === "string" ? result : result.answer;
    const debugInfo =
      typeof result === "string" ? undefined : result.debugInfo;

    const ms = Date.now() - startedAt;

    return NextResponse.json(
      debug ? { answer, debugInfo, requestId, ms } : { answer }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}

import "server-only";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ChatMsg = { role: "user" | "assistant"; text: string };

type RunMentorInput = {
  message: string;
  history?: ChatMsg[];
  debug?: boolean;
  requestId?: string;
};

type MentorResult =
  | string
  | {
      answer: string;
      debugInfo?: unknown;
    };

export async function runMentor({
  message,
  history = [],
  debug = false,
  requestId,
}: RunMentorInput): Promise<MentorResult> {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  // ---------- RAG retrieval ----------
  const ragDebug = {
    usingRag: false,
    retrievedCount: 0,
    sources: [] as Array<{ id: string; title?: string; path?: string }>,
    note: "No matches returned.",
  };

  let ragContext = "NO_CONTEXT";

  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: message,
  });
const isToolsQuestion =
  /what tools|which tools|tools in runway|features|what does runway tools do/i.test(
    message
  );
const TOOLS_DOC_ID = 19;

  const { data: matches, error: matchErr } = await supabase.rpc(
  "match_knowledge_chunks",
  {
    query_embedding: queryEmbedding.data[0].embedding,
    match_count: 6,
    filter_doc_ids: isToolsQuestion ? [TOOLS_DOC_ID] : null,
  }
);


  if (matchErr) {
    ragDebug.note = `match_knowledge_chunks error: ${matchErr.message ?? String(matchErr)}`;
  }
if (debug) {
  console.log("[DEBUG] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("[DEBUG] matches length:", matches?.length ?? 0);
  console.log("[DEBUG] first match preview:", matches?.[0]?.content?.slice?.(0, 120));
}

  if (matches?.length) {
    ragDebug.usingRag = true;
    ragDebug.retrievedCount = matches.length;
    ragDebug.sources = matches.map((m: any) => ({
      id: String(m.chunk_id ?? m.id),
      title: m.title ?? `doc_id:${m.doc_id}`,
      path: m.path ?? "",
    }));

    ragContext = matches
      .map(
        (m: any, i: number) =>
          `[#${i + 1}] (doc_id:${m.doc_id}, chunk:${m.chunk_index})\n${m.content}`
      )
      .join("\n\n---\n\n");

    ragDebug.note = "RAG context built and will be injected into the system prompt.";
  }

  // ---------- System prompt (this fixes the generic behavior) ----------
  const SYSTEM_PROMPT = `
You are "AI Fashion Mentor" inside the Runway Tools web app.
Your job is to help the user use Runway Tools to make decisions and execute actions.

Rules:
- Be specific and practical. Use structured steps.
- If the user asks "what tools are in this webapp", answer with Runway Tools tools (pricing, break-even, cashflow, ROAS/CPA, dashboards, bookkeeping, etc.) based on CONTEXT below.
- Prefer referencing the app's tools and workflows over generic advice.
- If CONTEXT is NO_CONTEXT, say you may be missing the internal docs and ask what plan/page they are on, but still give a best-effort list of common Runway tools.

CONTEXT (source of truth):
${ragContext}
`.trim();

  if (debug) {
    console.log("==== RUNWAY runtime.ts DEBUG ====");
    console.log("requestId:", requestId);
    console.log("systemLen:", SYSTEM_PROMPT.length);
    console.log("usingRag:", ragDebug.usingRag, "retrieved:", ragDebug.retrievedCount);
    console.log("firstSource:", ragDebug.sources?.[0] ?? null);
    console.log("contextPreview:", ragContext.slice(0, 300));
    console.log("==== END DEBUG ====");
  }

  const input = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.text })),
    { role: "user" as const, content: message },
  ];

  const r = await openai.responses.create({
    model: "gpt-5-mini",
    input,
  });

  const answer = r.output_text ?? "";

  if (debug) {
    return {
      answer,
      debugInfo: {
        requestId,
        ragDebug,
        systemLen: SYSTEM_PROMPT.length,
      },
    };
  }

  return answer;
}

  
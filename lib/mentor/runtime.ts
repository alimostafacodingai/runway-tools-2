import "server-only";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ChatMsg = { role: "user" | "assistant"; text: string };

export async function runMentor({
  message,
  history,
}: {
  message: string;
  history?: ChatMsg[];
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }
    const RAG_DEBUG = process.env.RAG_DEBUG === "1";

  // EXACT DEBUG OBJECT (keep this shape stable)
  const ragDebug = {
    usingRag: false,                // should flip to true only when retrieval is wired
    retrievedCount: 0,              // how many chunks/snippets you retrieved
    sources: [] as Array<{
      id: string;                   // file/chunk id
      title?: string;
      path?: string;
    }>,
    note:
      "No retrieval wired yet: model only sees system + history + user message.",
  };

  // clear any stale context from previous requests
delete (globalThis as any).__RAG_CONTEXT__;


// --- RAG retrieval ---
const queryEmbedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: message,
});

const { data: matches, error: matchErr } = await supabase.rpc("match_knowledge_chunks", {
  query_embedding: queryEmbedding.data[0].embedding,
  match_count: 6,
});

if (matchErr) {
  if (RAG_DEBUG) console.log("[RAG_DEBUG] match_knowledge_chunks error:", matchErr);
}

if (matches?.length) {
  ragDebug.usingRag = true;
  ragDebug.retrievedCount = matches.length;
  ragDebug.sources = matches.map((m: any) => ({
    id: String(m.chunk_id ?? m.id),
    title: m.title ?? `doc_id:${m.doc_id}`,
    path: m.path ?? "",
  }));

  const context = matches
    .map((m: any, i: number) => `[#${i + 1}] (doc_id:${m.doc_id}, chunk:${m.chunk_index})\n${m.content}`)
    .join("\n\n---\n\n");

  ragDebug.note = "RAG wired: context injected into system message.";
  (globalThis as any).__RAG_CONTEXT__ = context;
}

  

  
  

if (RAG_DEBUG) {
  console.log("[RAG_DEBUG] message:", message);
  console.log("[RAG_DEBUG] debug:", ragDebug);
}

  const input = [
   {
  role: "system" as const,
  content:
    "Reply concisely. Follow the user's instruction exactly when possible.\n\n" +
    "If the following CONTEXT is provided, use it as the source of truth:\n\n" +
    "CONTEXT:\n" +
    ((globalThis as any).__RAG_CONTEXT__ ?? "NO_CONTEXT"),
},

    ...(history ?? []).map((h) => ({ role: h.role as "user" | "assistant", content: h.text })),
    { role: "user" as const, content: message },
  ];

  const r = await openai.responses.create({
    model: "gpt-5-mini",
    input,
  });

      const text = r.output_text ?? "";
  return text;


}

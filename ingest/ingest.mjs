console.log("RUNNING INGEST SCRIPT VERSION 1:", import.meta.url);


import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import OpenAI from "openai";
const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);

const envPath = path.join(scriptDir, ".env");




dotenv.config({ path: envPath, override: true });
const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
console.log("DRY_RUN =", DRY_RUN);

console.log("ENV_PATH =", envPath);
console.log("OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);








// now safe to read env:
const KB_BUCKET = process.env.KB_BUCKET || "runway";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const EMBED_MODEL = "text-embedding-3-small"; // 1536 dims


// keep the same API your code expects: pdf(buffer) -> { text }
async function pdf(buffer) {
  const loadingTask = pdfjsLib.getDocument({
    data: buffer,
    disableWorker: true,
  });

  const doc = await loadingTask.promise;

  let text = "";
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str);
    text += strings.join(" ") + "\n";
  }

  return { text };
}







const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_PATH = path.join(__dirname, ".env"); // ingest/.env
console.log("ENV_PATH =", ENV_PATH);
console.log("ENV exists =", fs.existsSync(ENV_PATH));

const result = dotenv.config({ path: ENV_PATH });
if (result.error) throw result.error;

// Force apply parsed vars
Object.assign(process.env, result.parsed);

console.log("SUPABASE_URL present?", !!process.env.SUPABASE_URL);
console.log("SERVICE_ROLE_KEY length:", (process.env.SUPABASE_SERVICE_ROLE_KEY || "").length);




console.log("ENV FILE LOADED? SUPABASE_URL =", process.env.SUPABASE_URL);
console.log("ENV FILE LOADED? SERVICE ROLE KEY exists =", !!process.env.SUPABASE_SERVICE_ROLE_KEY);



const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const CHUNK_SIZE = Number(process.env.CHUNK_SIZE || 1200);
const CHUNK_OVERLAP = Number(process.env.CHUNK_OVERLAP || 200);

// where your PDFs live in the repo


// ALWAYS points to repo_root/knowledge_pdfs no matter where you run node from
const PDF_DIR = path.join(__dirname, "..", "knowledge_pdfs");


console.log("PDF_DIR =", PDF_DIR);
const files = fs.readdirSync(PDF_DIR).filter(f => f.toLowerCase().endsWith(".pdf"));
console.log("Found PDFs:", files.length, files);


if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in ingest/.env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function chunkText(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks = [];
  let i = 0;

  while (i < clean.length) {
    const end = Math.min(i + CHUNK_SIZE, clean.length);
    chunks.push(clean.slice(i, end));
    i = end - CHUNK_OVERLAP;
    if (i < 0) i = 0;
    if (end === clean.length) break;
  }

  return chunks;
}

async function upsertDoc(title, source_path) {
  // IMPORTANT: we treat `title` as the file name (path inside the bucket)
  const pathVal = title;

  

  // 1) Find existing doc by bucket + path (NOT source_path)
  const { data: existing, error: findErr } = await supabase
    .from("knowledge_docs")
    .select("id")
    .eq("bucket", KB_BUCKET)
    .eq("path", pathVal)
    .maybeSingle();

  if (findErr) throw findErr;

 // 2) If exists, wipe its chunks first BUT DO NOT return.
// We want to re-ingest and recreate chunks.
let docId = existing?.id ?? null;

if (docId) {
  const { error: delErr } = await supabase
    .from("knowledge_chunks")
    .delete()
    .eq("doc_id", docId);

  if (delErr) throw delErr;
}


  if (!docId) {
  const { data, error } = await supabase
    .from("knowledge_docs")
    .upsert(
      {
        bucket: KB_BUCKET,
        path: pathVal,
        title,
        source_path,
        metadata: {},
      },
      { onConflict: "bucket,path" }
    )
    .select("id")
    .single();

  if (error) throw error;
  docId = data.id;
}

return docId;

}


async function main() {
  if (!fs.existsSync(PDF_DIR)) throw new Error(`PDF folder not found: ${PDF_DIR}`);

  const files = fs.readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));
  if (files.length === 0) {
    console.log("No PDFs found in:", PDF_DIR);
    return;
  }

  console.log(`Found ${files.length} PDF(s). Ingesting...`);

  for (const file of files) {
    const full = path.join(PDF_DIR, file);
    const buf = fs.readFileSync(full);

  const parsed = await pdf(new Uint8Array(buf));


    const text = (parsed.text || "").trim();

    if (!text) {
      console.log(`Skipping empty PDF: ${file}`);
      continue;
    }
const source_path = `public/pdfs/${file}`;
const chunks = chunkText(text);

if (DRY_RUN) {
  console.log(`[DRY_RUN] ${file}: chars=${text.length}, chunks=${chunks.length}`);
  continue; // <-- THIS is what stops OpenAI + DB writes
}

const docId = await upsertDoc(file, source_path);
console.log("Calling OpenAI embeddings...", { n: chunks.length });


const embeddings = [];
const EMBED_BATCH = 100;

for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
  const batchTexts = chunks.slice(i, i + EMBED_BATCH);

  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: batchTexts,
  });

  embeddings.push(...resp.data.map(d => d.embedding));
}

console.log("OpenAI embeddings OK:", embeddings.length, "chunks:", chunks.length);

if (embeddings.length !== chunks.length) {
  throw new Error(`Embeddings mismatch: embeddings=${embeddings.length} chunks=${chunks.length}`);
}

console.log("First embedding dims:", embeddings[0]?.length);

const rows = chunks.map((content, idx) => ({
  doc_id: docId,
  chunk_index: idx,
  content,
  embedding: `[${embeddings[idx].join(",")}]`,


}));

  
    const BATCH = 100;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const { error } = await supabase.from("knowledge_chunks").insert(batch);
      if (error) throw error;
    }

    console.log(`✅ ${file}: doc_id=${docId}, chunks=${chunks.length}`);
  }

  console.log("DONE.");
}

main().catch((e) => {
  console.error("INGEST FAILED:", e?.message || e);
  process.exit(1);
});
import fs from "fs";
import path from "path";
import * as pdfParse from "pdf-parse";
import OpenAI from "openai";

type Chunk = {
  id: string;
  title: string;
  path: string;
  text: string;
  embedding: number[];
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function chunkText(text: string, chunkSize = 1200, overlap = 200) {
  const clean = text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const chunks: string[] = [];
  let i = 0;

  while (i < clean.length) {
    const end = Math.min(i + chunkSize, clean.length);
    chunks.push(clean.slice(i, end));
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks.filter((c) => c.trim().length > 80);
}

async function embed(text: string) {
  const r = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return r.data[0].embedding;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const repoRoot = process.cwd();

  // Add both folders if you want:
  const dirs = [
    path.join(repoRoot, "knowledge_pdfs"),
    path.join(repoRoot, "public", "pdfs"),
  ];

  const pdfFiles: string[] = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.toLowerCase().endsWith(".pdf")) pdfFiles.push(path.join(dir, f));
    }
  }

  if (pdfFiles.length === 0) {
    throw new Error("No PDFs found in knowledge_pdfs or public/pdfs");
  }

  const out: Chunk[] = [];
  for (const filePath of pdfFiles) {
    const buf = fs.readFileSync(filePath);
    const data = await (pdfParse as any)(buf);
    const text = data.text || "";
    const pieces = chunkText(text);

    const title = path.basename(filePath);
    for (let i = 0; i < pieces.length; i++) {
      const t = pieces[i];
      const id = `${title}::${i}`;
      const embedding = await embed(t);

      out.push({
        id,
        title,
        path: filePath.replace(repoRoot, ""),
        text: t,
        embedding,
      });

      // progress
      if ((i + 1) % 5 === 0) {
        console.log(`[INGEST] ${title} chunks embedded: ${i + 1}/${pieces.length}`);
      }
    }
    console.log(`[INGEST] Finished: ${title} total chunks: ${pieces.length}`);
  }

  const outDir = path.join(repoRoot, "lib", "mentor", "knowledge");
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "index.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf-8");
  console.log(`[INGEST] Wrote index: ${outPath} (chunks: ${out.length})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

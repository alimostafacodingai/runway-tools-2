import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

type BookEntry = {
  id: string;
  date: string; // e.g. "2025-11-18"
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
};

type BookkeepingDB = Record<string, BookEntry[]>; // email → entries[]

const dataFile = path.join(
  process.cwd(),
  "app",
  "api",
  "bookkeeping",
  "data",
  "bookkeeping.json"
);

async function readDb(): Promise<BookkeepingDB> {
  try {
    const file = await fs.readFile(dataFile, "utf8");
    return file ? JSON.parse(file) : {};
  } catch {
    // if file doesn't exist yet, start with empty object
    return {};
  }
}

async function writeDb(db: BookkeepingDB) {
  await fs.writeFile(dataFile, JSON.stringify(db, null, 2), "utf8");
}

function getEmailFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    ) as { email: string; plan?: string };

    return payload.email;
  } catch {
    return null;
  }
}

// 🔹 GET → return all entries for this logged-in user
export async function GET(req: NextRequest) {
  const email = getEmailFromRequest(req);
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = await readDb();
  const entries = db[email] || [];
  return NextResponse.json(entries);
}

// 🔹 POST → add ONE new entry for this user
export async function POST(req: NextRequest) {
  const email = getEmailFromRequest(req);
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const entry = body.entry as BookEntry | undefined;

  if (!entry) {
    return NextResponse.json({ error: "Missing entry" }, { status: 400 });
  }

  const db = await readDb();
  const userEntries = db[email] || [];

  db[email] = [...userEntries, entry];

  await writeDb(db);

  return NextResponse.json({ success: true });
}

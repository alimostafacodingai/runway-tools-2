import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Supabase admin client (server-side only) ---
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

type BookkeepingInsert = {
  email: string;
  date: string;         // e.g. "2026-07-20"
  description: string;
  category: string;
  amount: number;
};

// GET /api/bookkeeping?email=someone@gmail.com
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Missing email query parameter" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("bookkeeping_entries")
    .select("*")
    .eq("email", email)
    .order("date", { ascending: true });

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json(
      { error: "Failed to load entries" },
      { status: 500 }
    );
  }

  // Your frontend can read `entries` and put them into state
  return NextResponse.json({ entries: data ?? [] }, { status: 200 });
}

// POST /api/bookkeeping
// body: { email, date, description, category, amount }
export async function POST(req: NextRequest) {
  let body: Partial<BookkeepingInsert>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { email, date, description, category } = body;
  const amount = body.amount !== undefined ? Number(body.amount) : NaN;

  if (!email || !date || !description || !category || Number.isNaN(amount)) {
    return NextResponse.json(
      { error: "Missing or invalid fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("bookkeeping_entries")
    .insert({
      email,
      date,
      description,
      category,
      amount,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase POST error:", error);
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 }
    );
  }

  // Return 201 so your frontend sees res.ok === true
  return NextResponse.json({ entry: data }, { status: 201 });
}

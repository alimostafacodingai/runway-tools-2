// app/api/bookkeeping/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

type BookkeepingEntry = {
  id: string;
  email: string;
  date: string;          // YYYY-MM-DD
  description: string;
  category: string;
  amount: number;
  created_at: string;
};

function createSupabase() {
  const url = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

// ---- Get email from cookie, with safe fallback ----
function getUserEmailFromCookie(): string {
  const cookieStore = cookies() as any;
  const userCookie = cookieStore.get?.("runway_user");

  // No cookie → use shared guest account so nothing breaks
  if (!userCookie) {
    return "guest@runway.local";
  }

  try {
    const parsed = JSON.parse(userCookie.value) as { email?: string };
    return parsed.email || "guest@runway.local";
  } catch {
    return "guest@runway.local";
  }
}

// ---- GET: load all entries for this user ----
export async function GET(_req: NextRequest) {
  try {
    const email = getUserEmailFromCookie();
    const supabase = createSupabase();

    const { data, error } = await supabase
      .from("bookkeeping_entries")
      .select("*")
      .eq("email", email)
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase GET bookkeeping error:", error);
      return NextResponse.json(
        { entries: [] as BookkeepingEntry[], error: error.message },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { entries: (data as BookkeepingEntry[]) ?? [] },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/bookkeeping error:", err);
    return NextResponse.json(
      { entries: [] as BookkeepingEntry[], error: "Unexpected server error." },
      { status: 200 }
    );
  }
}

// ---- POST: add one entry for this user ----
export async function POST(req: NextRequest) {
  try {
    const email = getUserEmailFromCookie();
    const body = await req.json();
    const { date, description, category, amount } = body;

    const supabase = createSupabase();

    const { data, error } = await supabase
      .from("bookkeeping_entries")
      .insert([
        {
          email,
          date,
          description,
          category,
          amount,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase POST bookkeeping error:", error);
      return NextResponse.json(
        { entry: null, error: error.message },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { entry: data as BookkeepingEntry, error: null },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/bookkeeping error:", err);
    return NextResponse.json(
      { entry: null, error: "Unexpected server error." },
      { status: 200 }
    );
  }
}

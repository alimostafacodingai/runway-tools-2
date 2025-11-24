// app/api/bookkeeping/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

type BookkeepingEntry = {
  id: string;
  email: string;
  date: string;        // YYYY-MM-DD
  description: string;
  category: string;
  amount: number;
  created_at: string;
};

// ---- Supabase helper ----
function createSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}


  // ---- Get email from cookie ----
// ---- Get email from cookie (with safe fallback) ----
function getUserEmailFromCookie(): string {
  const cookieStore = cookies() as any;
  const userCookie = cookieStore.get?.("runway_user");

  // If no cookie → use a shared guest account so it NEVER breaks
  if (!userCookie) {
    return "guest@runway.local";
  }

  try {
    const parsed = JSON.parse(userCookie.value) as { email?: string };
    return parsed.email || "guest@runway.local";
  } catch {
    // If cookie is weird / broken → still don’t crash
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
      console.error("Supabase GET error:", error);
      return NextResponse.json(
        { error: "Failed to load bookkeeping data." },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error("GET /api/bookkeeping error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

// ---- POST: save new entry for this user ----
export async function POST(req: NextRequest) {
  try {
    const email = getUserEmailFromCookie();
    

    const body = await req.json();
    const { date, description, category, amount } = body;

    const supabase = createSupabase();

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
        { error: "Failed to save entry." },
        { status: 500 }
      );
    }

    return NextResponse.json({ entry: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookkeeping error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

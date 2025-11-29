// app/api/bookkeeping/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

type BookkeepingEntry = {
  id: number;
  email: string;
  date: string;        // YYYY-MM-DD (or whatever you store)
  description: string;
  category: string;
  amount: number;
  created_at: string;
};

function getUserEmailFromCookie(): string | null {
  const store = cookies();
  // this is what login/signup set:
  return store.get("user_email")?.value ?? null;
}

// GET → return all entries for this user
export async function GET(_req: NextRequest) {
  try {
    const email = getUserEmailFromCookie();

    // Not logged in → just return empty list (no crash)
    if (!email) {
      return NextResponse.json({ entries: [] }, { status: 200 });
    }

    const { data, error } = await supabaseServer
      .from("bookkeeping_entries")                    // 👈 no generic here
      .select<BookkeepingEntry>("*")                  // 👈 row type goes here (optional but nice)
      .eq("email", email)                             // if your column is user_email, change this
      .order("date", { ascending: true });

    if (error) {
      console.error("GET /api/bookkeeping DB error:", error);
      return NextResponse.json(
        { entries: [], error: "DB error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { entries: data ?? [] },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/bookkeeping unexpected error:", err);
    return NextResponse.json(
      { entries: [], error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

// POST → add one new entry
export async function POST(req: NextRequest) {
  try {
    const email = getUserEmailFromCookie();
    if (!email) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { date, description, category, amount } = body ?? {};

    if (
      !date ||
      !category ||
      typeof amount !== "number" ||
      Number.isNaN(amount)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("bookkeeping_entries")
      .insert({
        // let Supabase generate id
        email,
        date,
        description: description ?? "",
        category,
        amount,
      });

    if (error) {
      console.error("POST /api/bookkeeping DB error:", error);
      return NextResponse.json(
        { error: "Failed to save entry" },
        { status: 500 }
      );
    }

    // same shape as before so your frontend stays happy
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookkeeping unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

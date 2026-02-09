import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { createHash } from "crypto";

// Force Node runtime (so crypto + supabase work)
export const runtime = "nodejs";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const password_hash = hashPassword(password);

    // Look up user in Supabase
    const { data: user, error } = await supabaseServer
      .from("users")
      .select("id, email, plan")
      .eq("email", email)
      .eq("password_hash", password_hash)
      .maybeSingle();

    if (error) {
      console.error("DB error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json(
        { error: "No account found. Please sign up." },
        { status: 401 }
      );
    }

    const res = NextResponse.json(
      { message: "Logged in", user },
      { status: 200 }
    );

    // Cookies for frontend
    res.cookies.set("user_email", user.email, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookies.set("user_plan", user.plan ?? "free", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Unexpected error in /api/login:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

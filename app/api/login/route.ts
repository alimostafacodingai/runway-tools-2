// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import crypto from "crypto";

// same hashing as signup
function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
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

    // 1) Look for a user with matching email + hash in Supabase
    const { data: user, error } = await supabaseServer
      .from("users")
      .select("id, email, plan")
      .eq("email", email)
      .eq("password_hash", password_hash)
      .maybeSingle();

    if (error) {
      console.error("DB error:", error);
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "No account found. Please sign up." },
        { status: 401 }
      );
    }

    // 2) Set cookies (same names your app already uses)
    const res = NextResponse.json(
      {
        message: "Logged in",
        user: { id: user.id, email: user.email, plan: user.plan },
      },
      { status: 200 }
    );

    res.cookies.set("user_email", user.email, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookies.set("user_plan", user.plan, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}

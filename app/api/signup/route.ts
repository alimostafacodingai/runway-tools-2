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
    const { email, password, plan } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1) Check if user exists already
    const { data: existing, error: checkError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("DB check error:", checkError);
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 2) Hash password exactly like login
    const password_hash = hashPassword(password);

    // 3) Insert new user
    const { data: user, error: insertError } = await supabaseServer
      .from("users")
      .insert({
        email,
        password_hash,
        plan: plan || "free",
      })
      .select("id, email, plan")
      .single();

    if (insertError || !user) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Could not create user" },
        { status: 500 }
      );
    }

    // 4) Set cookies for session (same as login)
    const res = NextResponse.json(
      { message: "User created", user },
      { status: 201 }
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
    console.error("Unexpected signup error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}

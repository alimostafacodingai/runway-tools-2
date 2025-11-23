import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

type Plan = "free" | "beginner" | "pro";

type User = {
  email: string;
  passwordHash: string; // salt:base64(password)
  salt: string;
  plan: Plan;
};

const dataFile = path.join(
  process.cwd(),
  "app",
  "api",
  "me",
  "data",
  "users.json"
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Read users.json
    const file = await fs.readFile(dataFile, "utf8");
    const users: User[] = JSON.parse(file || "[]");

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: "No account found. Please sign up." },
        { status: 404 }
      );
    }

    // Very simple “hash” check (salt:base64(password))
    const [storedSalt] = user.passwordHash.split(":");
    const inputHash = storedSalt + ":" + Buffer.from(password).toString("base64");

    if (inputHash !== user.passwordHash) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Decide where to send them AFTER login
    const url = new URL(req.url);
    const nextParam = url.searchParams.get("next");

    const defaultRedirectByPlan: Record<Plan, string> = {
      free: "/tools",              // free tools page
      beginner: "/beginner-plan",  // beginner product page
      pro: "/professional-plan",   // pro product page
    };

    const nextUrl = nextParam || defaultRedirectByPlan[user.plan] || "/tools";

    // Create JWT
    const token = jwt.sign(
      { email: user.email, plan: user.plan },
      process.env.JWT_SECRET || "secret123"
    );

    const res = NextResponse.json({
      success: true,
      email: user.email,
      plan: user.plan,
      nextUrl,              // ⬅️ frontend should redirect here
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

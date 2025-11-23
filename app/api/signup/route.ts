import { NextResponse } from "next/server";
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
    const body = await req.json();

    const email = body.email as string;
    const password = body.password as string;
    const planFromBody = body.plan as Plan | undefined;

    // ⛔ If plan is missing, fail loudly (no silent "free" default)
    if (!email || !password || !planFromBody) {
      return NextResponse.json(
        { error: "Email, password, and plan are required" },
        { status: 400 }
      );
    }

    // ✅ Make sure plan is one of the allowed values
    if (
      planFromBody !== "free" &&
      planFromBody !== "beginner" &&
      planFromBody !== "pro"
    ) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const plan: Plan = planFromBody;

    console.log("SIGNUP → received:", { email, plan });

    // Read existing users
    let users: User[] = [];
    try {
      const file = await fs.readFile(dataFile, "utf8");
      users = file ? JSON.parse(file) : [];
    } catch {
      users = [];
    }

    // Check if user already exists
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { error: "This email already has an account. Please log in." },
        { status: 409 }
      );
    }

    // Very simple "hash": salt:base64(password)
    const salt = Math.random().toString(36).slice(2);
    const passwordHash = salt + ":" + Buffer.from(password).toString("base64");

    const newUser: User = {
      email,
      passwordHash,
      salt,
      plan, // 👈 THIS is what gets saved
    };

    users.push(newUser);
    await fs.writeFile(dataFile, JSON.stringify(users, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      email,
      plan,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// app/api/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

type Plan = "free" | "beginner" | "pro";

type TokenPayload = {
  email: string;
  plan: Plan;
};

type User = {
  email: string;
  passwordHash: string;
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

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    // ❌ No token → user not logged in
    if (!token) {
      return NextResponse.json(
        {
          loggedIn: false,
          email: null,
          plan: "free",
          canUseBeginnerTools: false,
          canUseProTools: false,
        },
        { status: 200 }
      );
    }

    // ✅ Decode JWT
    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret123"
      ) as TokenPayload;
    } catch {
      // Bad / expired token → treat as logged out
      return NextResponse.json(
        {
          loggedIn: false,
          email: null,
          plan: "free",
          canUseBeginnerTools: false,
          canUseProTools: false,
        },
        { status: 200 }
      );
    }

    // 🔍 Load latest user info from users.json (single source of truth)
    let plan: Plan = decoded.plan;
    try {
      const file = await fs.readFile(dataFile, "utf8");
      const users: User[] = JSON.parse(file || "[]");
      const user = users.find((u) => u.email === decoded.email);
      if (user) {
        plan = user.plan; // if plan changed in file, override token
      }
    } catch (e) {
      console.error("Error reading users.json in /api/me:", e);
      // If file fails, we still fall back to plan from token
    }

    const canUseBeginnerTools = plan === "beginner" || plan === "pro";
    const canUseProTools = plan === "pro";

    return NextResponse.json(
      {
        loggedIn: true,
        email: decoded.email,
        plan,
        canUseBeginnerTools,
        canUseProTools,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/me:", err);
    return NextResponse.json(
      {
        loggedIn: false,
        email: null,
        plan: "free",
        canUseBeginnerTools: false,
        canUseProTools: false,
      },
      { status: 500 }
    );
  }
}

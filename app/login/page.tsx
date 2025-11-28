"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "free" | "beginner" | "pro";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();

  // Only trust "next" if it is an internal path
  const rawNext = search.get("next");
  const safeNext =
    rawNext && rawNext.startsWith("/") ? rawNext : null;

  const [email, setEmail] = useState(search.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    const plan = data.user?.plan || "free";

    // If you support ?next=... for checkout, keep this first
    if (safeNext) {
      router.push(safeNext);
      return;
    }

    // ✅ Correct redirect based on plan from Supabase
    if (plan === "beginner") {
      router.push("/beginner");
    } else if (plan === "pro") {
      router.push("/pro");
    } else {
      router.push("/free");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("Unexpected error during login.");
  }
}


  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Log in to Runway Tools
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-700 focus:outline-none focus:border-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-700 focus:outline-none focus:border-white"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition"
          >
            Log in
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-zinc-400">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "free" | "beginner" | "pro";

// 🧱 Put all the logic that uses useSearchParams inside this component
function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();

  const rawNext = search.get("next");
  const safeNext = rawNext && rawNext.startsWith("/") ? rawNext : null;

  const [email, setEmail] = useState(search.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();
      const plan = data.plan as Plan;

      if (safeNext) {
        router.push(safeNext);
        return;
      }

      if (plan === "free") router.push("/tools");
      else if (plan === "beginner") router.push("/beginner-plan");
      else router.push("/professional-plan");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Log in to Runway Tools</h1>

        {error && (
          <div className="mb-3 text-sm text-red-400 bg-red-950/30 border border-red-700/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-lg bg-white text-black text-sm font-semibold py-2 hover:bg-zinc-200 transition"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}

// ✅ Default export wrapped in Suspense (fixes the Vercel /login prerender error)
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-zinc-400 text-sm">Loading…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

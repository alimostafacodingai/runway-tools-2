"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "free" | "beginner" | "pro";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }

      const data: { plan?: Plan } = await res.json().catch(() => ({}));

      // Decide where to send the user AFTER login
      let redirect = "/plans";
      if (data.plan === "pro") redirect = "/pro-plan";
      else if (data.plan === "beginner") redirect = "/beginner-plan";
      else if (data.plan === "free") redirect = "/free-plan";

      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <section className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">Log in to Runway Tools</h1>
        <p className="text-zinc-400 mb-6 text-sm">
          Enter your email and password to access your plan.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-black text-sm font-semibold py-2 hover:bg-zinc-200 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </section>
    </main>
  );
}

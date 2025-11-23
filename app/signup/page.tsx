"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "free" | "beginner" | "pro";

function SignUpInner() {
  const router = useRouter();

  const [plan, setPlan] = useState<Plan>("free");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, plan }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Sign-up failed");
      }

      // redirect based on chosen plan
      let redirect = "/plans";
      if (plan === "pro") redirect = "/pro-plan";
      else if (plan === "beginner") redirect = "/beginner-plan";
      else if (plan === "free") redirect = "/free-plan";

      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <section className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-3">
            Create your Runway Tools account
          </h1>
          <p className="text-zinc-400 text-sm">
            Choose a plan, then sign up with your email and password.
          </p>
        </div>

        {/* Plan selector */}
        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => setPlan("free")}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
              plan === "free"
                ? "border-white bg-zinc-900"
                : "border-zinc-700 bg-zinc-950"
            }`}
          >
            <div className="font-semibold">Free Plan</div>
            <div className="text-xs text-zinc-400">
              Try the core tools and templates.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPlan("beginner")}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
              plan === "beginner"
                ? "border-white bg-zinc-900"
                : "border-zinc-700 bg-zinc-950"
            }`}
          >
            <div className="font-semibold">Beginner Plan</div>
            <div className="text-xs text-zinc-400">
              Full basic calculators and templates.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPlan("pro")}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
              plan === "pro"
                ? "border-white bg-zinc-900"
                : "border-zinc-700 bg-zinc-950"
            }`}
          >
            <div className="font-semibold">Pro Plan</div>
            <div className="text-xs text-zinc-400">
              All tools, dashboards and AI Pro.
            </div>
          </button>
        </div>

        {/* Sign-up form */}
        <form onSubmit={handleSignUp} className="space-y-4">
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-black text-sm font-semibold py-2 hover:bg-zinc-200 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <SignUpInner />
    </Suspense>
  );
}

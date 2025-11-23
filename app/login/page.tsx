"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "free" | "beginner" | "pro";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();

  // Only trust `next` if it starts with "/"
  const rawNext = search.get("next");
  const safeNext = rawNext && rawNext.startsWith("/") ? rawNext : null;

  const [email, setEmail] = useState(search.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Wrong email or password.");
        return;
      }

      // 👇 Read the plan & nextUrl from the API
      const plan: Plan = data.plan || "free";
      const apiNextUrl: string | undefined = data.nextUrl;

      // Store current user (optional but useful)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "runwayCurrentUser",
          JSON.stringify({
            email: data.email ?? email,
            plan,
          })
        );
      }

      // 1) If this login was triggered from a protected page with ?next=, respect that
      if (safeNext) {
        router.push(safeNext);
        return;
      }

      // 2) Otherwise, if backend gave us a nextUrl, follow that
      if (apiNextUrl && typeof apiNextUrl === "string") {
        router.push(apiNextUrl);
        return;
      }

      // 3) Fallback: redirect by plan (must match your backend defaults)
      if (plan === "beginner") {
        router.push("/beginner-plan");
      } else if (plan === "pro") {
        router.push("/professional-plan");
      } else {
        router.push("/tools"); // free plan default
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Log in to Runway Tools
      </h1>

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl border border-white/10 w-full max-w-md space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 disabled:opacity-60 transition"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-white/60 text-center">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="underline hover:text-white"
        >
          Sign up
        </button>
      </p>
    </main>
  );
}

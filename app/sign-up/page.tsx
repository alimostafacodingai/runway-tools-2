"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Plan = "free" | "beginner" | "pro";

export default function SignupPage() {
  const router = useRouter();

  // state for plan and next
  const [plan, setPlan] = useState<Plan>("free");
  const [next, setNext] = useState("/login");

  // read query params from the browser URL on the client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const planFromUrl = params.get("plan") as Plan | null;
    setPlan(planFromUrl || "free");

    const nextParam = params.get("next");
    setNext(nextParam || "/login");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          plan, // 👈 IMPORTANT: send plan to backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      if (plan === "beginner" || plan === "pro") {
        alert(
          "Account created! Use the SAME email on the Whop checkout page to activate your plan."
        );
      }

      router.push(next);
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
        Create your account
      </h1>

      <p className="text-white/70 mb-10 text-center max-w-md">
        {plan === "free" &&
          "You're creating a free Runway Tools account."}
        {plan === "beginner" &&
          "You're creating an account to buy the Beginner Plan (250 EGP)."}
        {plan === "pro" &&
          "You're creating an account to buy the Pro Plan (300 EGP)."}
      </p>

      <form
        onSubmit={handleSignup}
        className="bg-zinc-900 p-8 rounded-2xl border border-white/10 w-full max-w-md space-y-4"
      >
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Your password"
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
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>

      <p className="mt-4 text-sm text-white/60 text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push(`/login?next=${next}`)}
          className="underline hover:text-white"
        >
          Log in
        </button>
      </p>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

type Plan = "free" | "beginner" | "pro";

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("signupPage");
  const locale = useLocale();

  const href = (path: string) => `/${locale}${path}`;

  const [plan, setPlan] = useState<Plan>("free");
  const [next, setNext] = useState(href("/login"));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const planFromUrl = params.get("plan") as Plan | null;
    if (planFromUrl) setPlan(planFromUrl);

    const nextParam = params.get("next");
    if (nextParam) setNext(nextParam);
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
          plan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("errors.signupFailed"));
        return;
      }

      if (plan === "beginner" || plan === "pro") {
        alert(t("alerts.checkoutNotice"));
      }

      router.push(next);
    } catch (err) {
      console.error(err);
      setError(t("errors.server"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {t("title")}
      </h1>

      <p className="text-white/70 mb-10 text-center max-w-md">
        {plan === "free" && t("planCopy.free")}
        {plan === "beginner" && t("planCopy.beginner")}
        {plan === "pro" && t("planCopy.pro")}
      </p>

      <form
        onSubmit={handleSignup}
        className="bg-zinc-900 p-8 rounded-2xl border border-white/10 w-full max-w-md space-y-4"
      >
        <input
          type="email"
          placeholder={t("fields.emailPlaceholder")}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t("fields.passwordPlaceholder")}
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
          {loading ? t("cta.loading") : t("cta.default")}
        </button>
      </form>

      <p className="mt-4 text-sm text-white/60 text-center">
        {t("footer.text")}{" "}
        <button
          type="button"
          onClick={() => router.push(`${href("/login")}?next=${encodeURIComponent(next)}`)}
          className="underline hover:text-white"
        >
          {t("footer.link")}
        </button>
      </p>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

type Plan = "free" | "beginner" | "pro";

interface LoginPageProps {
  searchParams?: { next?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const router = useRouter();
  const t = useTranslations("loginPage");
  const locale = useLocale();

  const href = (path: string) => `/${locale}${path}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const rawNext = searchParams?.next;
  const safeNext =
    rawNext && typeof rawNext === "string" && rawNext.startsWith("/")
      ? rawNext
      : null;

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
        setError(data.error || t("errors.loginFailed"));
        return;
      }

      const plan: Plan = (data.user?.plan as Plan) || "free";

      if (safeNext) {
        router.push(safeNext);
        return;
      }

      if (plan === "beginner") {
        router.push(href("/beginner"));
      } else if (plan === "pro") {
        router.push(href("/professional-plan"));
      } else {
        router.push(href("/tools"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("errors.unexpected"));
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          {t("subtitle")}
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm mb-1">{t("fields.email")}</label>
            <input
              type="email"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">{t("fields.password")}</label>
            <input
              type="password"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-1 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-white text-black font-semibold py-2 rounded-lg hover:bg-zinc-200 transition"
          >
            {t("cta")}
          </button>
        </form>

        <p className="text-sm text-zinc-500 text-center mt-4">
          {t("footer.text")}{" "}
          <a href={href("/signup")} className="text-zinc-200 underline">
            {t("footer.link")}
          </a>
        </p>
      </div>
    </main>
  );
}

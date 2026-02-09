"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function Plans() {
  const router = useRouter();
  const t = useTranslations("plansPage");
  const locale = useLocale();

  const href = (path: string) => `/${locale}${path}`;

  const beginnerCheckout =
    "https://whop.com/checkout/plan_LTyeLxIoU6b0l";
  const proCheckout =
    "https://whop.com/checkout/plan_ni4U7dhxJpJPk";

  const freeFeatures = t.raw("free.features") as string[];
  const beginnerFeatures = t.raw("beginner.features") as string[];
  const proFeatures = t.raw("pro.features") as string[];

  async function handlePaidPlanClick(
    plan: "beginner" | "pro",
    checkoutUrl: string
  ) {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      const data = await res.json();
      const next = encodeURIComponent(checkoutUrl);

      if (data.loggedIn) {
        router.push(
          `${href("/login")}?plan=${plan}&next=${next}&reason=already_have_account`
        );
        return;
      }

      router.push(`${href("/signup")}?plan=${plan}&next=${next}`);
    } catch (e) {
      const next = encodeURIComponent(checkoutUrl);
      router.push(`${href("/signup")}?plan=${plan}&next=${next}`);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12 text-center">
        {t("title")}
      </h1>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div className="border border-white/20 rounded-2xl p-8 bg-zinc-900 w-full">
          <h3 className="text-2xl font-semibold mb-2">
            {t("free.title")}
          </h3>
          <p className="text-white/70 mb-6">
            {t("free.perfectFor")}
          </p>

          <h4 className="text-lg font-semibold mb-3">{t("free.unlocks")}</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/80 mb-6">
            {freeFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <a
            href={href("/tools")}
            className="block text-center bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            {t("free.cta")}
          </a>
        </div>

        <div className="border border-yellow-400/40 rounded-2xl p-8 bg-zinc-900 w-full shadow-[0_0_25px_rgba(255,255,0,0.15)]">
          <h3 className="text-2xl font-semibold mb-2">
            {t("beginner.title")}
          </h3>
          <p className="text-white/70 mb-6">
            {t("beginner.perfectFor")}
          </p>

          <h4 className="text-lg font-semibold mb-3">
            {t("beginner.includes")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/80 mb-6">
            {beginnerFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => handlePaidPlanClick("beginner", beginnerCheckout)}
            className="block w-full text-center bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            {t("beginner.cta")}
          </button>
        </div>

        <div className="border border-purple-400/40 rounded-2xl p-8 bg-zinc-900 w-full shadow-[0_0_25px_rgba(168,85,247,0.15)]">
          <h3 className="text-2xl font-semibold mb-2">
            {t("pro.title")}
          </h3>
          <p className="text-white/70 mb-6">
            {t("pro.perfectFor")}
          </p>

          <h4 className="text-lg font-semibold mb-3">
            {t("pro.includes")}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/80 mb-6">
            {proFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => handlePaidPlanClick("pro", proCheckout)}
            className="block w-full text-center bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-400 transition"
          >
            {t("pro.cta")}
          </button>
        </div>
      </div>
    </main>
  );
}

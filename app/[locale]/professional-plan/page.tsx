"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function ProPage() {
  const router = useRouter();
  const t = useTranslations("proPlanPage");
  const locale = useLocale();

  const href = (path: string) => `/${locale}${path}`;

  const calculators = t.raw("calculators.items") as {
    title: string;
    desc: string;
    path: string;
    cta?: string;
  }[];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <section className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-3">{t("hero.title")}</h1>
        <p className="text-zinc-300">{t("hero.subtitle")}</p>
      </section>

      <section className="max-w-5xl mx-auto space-y-10">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">{t("mentor.title")}</h2>
          <p className="text-zinc-400 mb-4">{t("mentor.desc")}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={href("/mentor")}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200"
            >
              {t("mentor.ctaPrimary")}
            </Link>

            <button
              onClick={() => router.push(href("/tools"))}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-zinc-600 text-sm font-semibold hover:bg-zinc-900"
            >
              {t("mentor.ctaSecondary")}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {t("calculators.title")}
          </h2>

          {calculators.map((item, idx) => (
            <div
              key={item.title}
              className={`${
                idx === 0 ? "mt-0" : "mt-3"
              } flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3`}
            >
              <div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
              <button
                onClick={() => router.push(href(item.path))}
                className={
                  item.cta === "link"
                    ? "text-sm font-semibold text-zinc-100 underline underline-offset-4 hover:text-white"
                    : "text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
                }
              >
                {item.cta === "link" ? t("calculators.linkCta") : t("calculators.cta")}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">{t("bookkeeping.title")}</h2>
          <p className="text-zinc-400 mb-4">{t("bookkeeping.desc")}</p>

          <button
            onClick={() => router.push(href("/bookkeeping"))}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            {t("bookkeeping.cta")}
          </button>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">{t("dashboard.title")}</h2>
          <p className="text-zinc-400 mb-4">{t("dashboard.desc")}</p>

          <button
            onClick={() => router.push(href("/runway-dashboard"))}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            {t("dashboard.cta")}
          </button>
        </div>
      </section>
    </main>
  );
}

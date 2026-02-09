"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function ToolsPage() {
  const router = useRouter();
  const t = useTranslations("toolsPage");
  const locale = useLocale();

  const href = (path: string) => `/${locale}${path}`;

  const templateItems = t.raw("templates.items") as {
    title: string;
    desc: string;
  }[];

  const calculatorItems = t.raw("calculators.items") as {
    title: string;
    desc: string;
    path: string;
  }[];

  const templateHrefs = [
    "/pdfs/business-plan-template.pdf",
    "/pdfs/brand-identity-template.pdf",
    "/pdfs/email-marketing-templates.pdf",
    "/pdfs/product-design-worksheet.pdf",
    "/pdfs/Refund_and_Exchange_Policy_Template.docx.pdf",
    "/pdfs/Shopify-product-description-template(3).pdf",
    "/pdfs/size-chart-template.pdf",
    "/pdfs/supplier-outreach-email-template.pdf",
    "/pdfs/weekly-content-calendar.pdf",
    "/pdfs/label-invoice-template-arabic-english(1).docx.pdf",
  ];

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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(href("/mentor"))}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:opacity-90"
            >
              {t("mentor.cta")}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">{t("templates.title")}</h2>
          <p className="text-zinc-400 mb-4">{t("templates.desc")}</p>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {templateItems.map((item, idx) => (
              <a
                key={item.title}
                href={templateHrefs[idx]}
                className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
                target="_blank"
                rel="noreferrer"
              >
                <h3 className="font-semibold group-hover:text-white text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">{t("calculators.title")}</h2>
          <p className="text-zinc-400 mb-4">{t("calculators.desc")}</p>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {calculatorItems.map((item) => (
              <Link
                key={item.title}
                href={href(item.path)}
                className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              >
                <h3 className="font-semibold group-hover:text-white text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">{t("upgrade.title")}</h2>
          <p className="text-zinc-400 mb-4 text-sm">{t("upgrade.desc")}</p>

          <button
            onClick={() => router.push(href("/plans"))}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            {t("upgrade.cta")}
          </button>
        </div>
      </section>
    </main>
  );
}

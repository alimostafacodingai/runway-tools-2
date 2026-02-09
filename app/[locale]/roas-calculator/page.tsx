"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type CurrencyCode = "EGP" | "USD" | "EUR" | "GBP" | "AED" | "SAR";

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EGP: "EÂ£",
  USD: "$",
  EUR: "€",
  GBP: "Â£",
  AED: "Ã˜Â¯.Ã˜Â¥",
  SAR: "Ã¯Â·Â¼",
};

function formatNumber(n: number) {
  if (!Number.isFinite(n)) n = 0;
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function RoasCalculatorPage() {
  const t = useTranslations("roasCalculatorPage");

  const [currency, setCurrency] = useState<CurrencyCode>("EGP");
  const [aov, setAov] = useState(0);
  const [cogs, setCogs] = useState(0);
  const [otherVar, setOtherVar] = useState(0);
  const [cpa, setCpa] = useState(0);
  const [targetMargin, setTargetMargin] = useState(0);

  const symbol = CURRENCY_SYMBOLS[currency];

  const revenue = aov;
  const costNonAd = cogs + otherVar;
  const preAdProfit = revenue - costNonAd;

  const beCPA = preAdProfit > 0 ? preAdProfit : 0;
  const beROAS = beCPA > 0 ? revenue / beCPA : 0;

  const profitAfterAds = preAdProfit - cpa;
  const marginAfterAds = revenue > 0 ? profitAfterAds / revenue : 0;
  const actualROAS = cpa > 0 ? revenue / cpa : 0;

  let maxCpaForTarget = 0;
  const targetMarginPct = targetMargin / 100;

  if (targetMarginPct > 0 && revenue > 0) {
    maxCpaForTarget = preAdProfit - targetMarginPct * revenue;
    if (maxCpaForTarget < 0) maxCpaForTarget = 0;
  }

  let statusText = t("status.noTarget");
  if (targetMarginPct > 0) {
    if (cpa === 0) {
      statusText = t("status.enterCpa");
    } else if (cpa <= maxCpaForTarget) {
      statusText = t("status.ok");
    } else {
      statusText = t("status.high");
    }
  }

  const money = (n: number) => `${symbol}${formatNumber(n)}`;

  return (
    <main
      className="min-h-screen text-[#e9ecff]"
      style={{
        background:
          "radial-gradient(1200px 800px at 0% 0%, #251b63 0%, transparent 60%), radial-gradient(1200px 800px at 100% 0%, #0b6c9a33 0%, transparent 60%), #0f1226",
      }}
    >
      <div className="px-7 py-7 max-w-6xl mx-auto">
        <h1 className="text-[26px] font-semibold mb-2">{t("title")}</h1>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4 mt-1">
          <label className="text-sm text-[#a4a9c8]" htmlFor="currency">
            {t("currency.label")}
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-[#0e1230] text-[#e9ecff] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm"
          >
            <option value="EGP">{t("currency.egp")}</option>
            <option value="USD">{t("currency.usd")}</option>
            <option value="EUR">{t("currency.eur")}</option>
            <option value="GBP">{t("currency.gbp")}</option>
            <option value="AED">{t("currency.aed")}</option>
            <option value="SAR">{t("currency.sar")}</option>
          </select>
          <span className="text-xs text-[#a4a9c8]">{t("currency.hint")}</span>
        </div>

        <p className="text-sm text-[#a4a9c8] mb-6 max-w-3xl">{t("subtitle")}</p>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* LEFT: Inputs */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-3 -mt-1">
              <h3 className="text-sm font-semibold tracking-wide bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] bg-clip-text text-transparent">
                {t("inputs.title")}
              </h3>
              <span className="text-[11px] px-3 py-0.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(124,92,255,0.12)] text-[#cfd3ff]">
                {t("inputs.badge")}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  {t("inputs.aov.label")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={aov || ""}
                  onChange={(e) => setAov(parseFloat(e.target.value) || 0)}
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  {t("inputs.aov.note")}
                </p>
              </div>

              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  {t("inputs.cogs.label")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cogs || ""}
                  onChange={(e) => setCogs(parseFloat(e.target.value) || 0)}
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  {t("inputs.cogs.note")}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mt-4">
              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  {t("inputs.other.label")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={otherVar || ""}
                  onChange={(e) => setOtherVar(parseFloat(e.target.value) || 0)}
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  {t("inputs.other.note")}
                </p>
              </div>

              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  {t("inputs.target.label")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetMargin || ""}
                  onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  {t("inputs.target.note")}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                {t("inputs.cpa.label")}
              </label>
              <input
                type="number"
                step="0.01"
                value={cpa || ""}
                onChange={(e) => setCpa(parseFloat(e.target.value) || 0)}
                className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
              />
              <p className="text-[11px] text-[#a7acd4] mt-1">
                {t("inputs.cpa.note")}
              </p>
            </div>

            {/* Explanation box */}
            <div className="mt-4 text-xs text-[#cfd3ff] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3.5 leading-relaxed space-y-2">
              <p>{t("explain.p1")}</p>
              <p>{t("explain.p2")}</p>
              <p>{t("explain.p3")}</p>
              <p>{t("explain.p4")}</p>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-3 -mt-1">
              <h3 className="text-sm font-semibold tracking-wide bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] bg-clip-text text-transparent">
                {t("results.title")}
              </h3>
              <span className="text-[11px] px-3 py-0.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(124,92,255,0.12)] text-[#cfd3ff]">
                {t("results.badge")}
              </span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.12em] text-[#9fa4d6] mt-1 mb-2">
              {t("results.structureTitle")}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.revenue")}</span>
                <span className="font-semibold">{money(revenue)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.nonAd")}</span>
                <span className="font-semibold">{money(costNonAd)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.preAd")}</span>
                <span className="font-semibold">{money(preAdProfit)}</span>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-gradient-to-tr from-[rgba(124,92,255,0.25)] to-[rgba(0,212,255,0.25)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-4 space-y-1.5">
              <div className="flex items-center justify-between text-base">
                <span>{t("results.beCpa")}</span>
                <span className="font-extrabold">{money(beCPA)}</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span>{t("results.beRoas")}</span>
                <span className="font-extrabold">
                  {beROAS > 0 ? `${formatNumber(beROAS)}Ã—` : "—"}
                </span>
              </div>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.08)] mt-4 pt-3 space-y-2 text-sm">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#9fa4d6] mt-1">
                {t("results.withCpa")}
              </p>

              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.actualCpa")}</span>
                <span className="font-semibold">{money(cpa)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.afterAds")}</span>
                <span
                  className={`font-semibold ${
                    profitAfterAds > 0
                      ? "text-[#aef7d0]"
                      : profitAfterAds < 0
                      ? "text-[#fecaca]"
                      : ""
                  }`}
                >
                  {money(profitAfterAds)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.marginAfter")}</span>
                <span className="font-semibold">
                  {formatNumber(marginAfterAds * 100)}%
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.actualRoas")}</span>
                <span className="font-semibold">
                  {actualROAS > 0 ? `${formatNumber(actualROAS)}Ã—` : "—"}
                </span>
              </div>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.08)] mt-4 pt-3 space-y-2 text-sm">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#9fa4d6] mt-1">
                {t("results.targetTitle")}
              </p>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.maxCpa")}</span>
                <span className="font-semibold">{money(maxCpaForTarget)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">{t("results.statusLabel")}</span>
                <span className="font-semibold text-xs">{statusText}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#a7acd4] mt-4">{t("results.tip")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}


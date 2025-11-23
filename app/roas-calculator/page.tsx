"use client";

import { useState } from "react";

type CurrencyCode = "EGP" | "USD" | "EUR" | "GBP" | "AED" | "SAR";

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EGP: "E£",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SAR: "﷼",
};

function formatNumber(n: number) {
  if (!Number.isFinite(n)) n = 0;
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function RoasCpaPage() {
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

  let statusText = "No target margin set.";
  if (targetMarginPct > 0) {
    if (cpa === 0) {
      statusText = "Enter a CPA to compare with your target margin.";
    } else if (cpa <= maxCpaForTarget) {
      statusText = "✅ Your CPA supports your target margin.";
    } else {
      statusText = "⚠️ CPA is too high for your target margin.";
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
        <h1 className="text-[26px] font-semibold mb-2">
          RunwayToRevenue – ROAS / CPA Break-Even Calculator
        </h1>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4 mt-1">
          <label className="text-sm text-[#a4a9c8]" htmlFor="currency">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-[#0e1230] text-[#e9ecff] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm"
          >
            <option value="EGP">EGP – Egyptian Pound</option>
            <option value="USD">USD – US Dollar</option>
            <option value="EUR">EUR – Euro</option>
            <option value="GBP">GBP – British Pound</option>
            <option value="AED">AED – UAE Dirham</option>
            <option value="SAR">SAR – Saudi Riyal</option>
          </select>
          <span className="text-xs text-[#a4a9c8]">
            Use the same currency you use in your pricing &amp; income statement
            tools.
          </span>
        </div>

        <p className="text-sm text-[#a4a9c8] mb-6 max-w-3xl">
          This tool shows your <strong>break-even CPA</strong> and{" "}
          <strong>break-even ROAS</strong>, then compares them with your actual
          CPA and ROAS. Use the same inputs you use in your pricing calculator:
          average order value, cost per order, and ad spend per order.
        </p>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* LEFT: Inputs */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-3 -mt-1">
              <h3 className="text-sm font-semibold tracking-wide bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] bg-clip-text text-transparent">
                Inputs
              </h3>
              <span className="text-[11px] px-3 py-0.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(124,92,255,0.12)] text-[#cfd3ff]">
                Per Order / Per Purchase
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  Average Order Value (AOV)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={aov || ""}
                  onChange={(e) => setAov(parseFloat(e.target.value) || 0)}
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  The average amount a customer pays for one order.
                </p>
              </div>

              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  Product + Fulfilment Cost per Order
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cogs || ""}
                  onChange={(e) => setCogs(parseFloat(e.target.value) || 0)}
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  All costs to deliver one order: product, packaging, shipping
                  to customer, etc.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mt-4">
              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  Other Variable Cost per Order
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={otherVar || ""}
                  onChange={(e) =>
                    setOtherVar(parseFloat(e.target.value) || 0)
                  }
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  Payment fees, platform fees, per-order app fees, etc.
                </p>
              </div>

              <div>
                <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                  Target Profit Margin % (optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetMargin || ""}
                  onChange={(e) =>
                    setTargetMargin(parseFloat(e.target.value) || 0)
                  }
                  className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
                />
                <p className="text-[11px] text-[#a7acd4] mt-1">
                  The % of revenue you want as profit <em>after ads</em>.
                  Example: 20%.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[13px] text-[#cfd3ff] mb-1 block">
                CPA (Cost per Attribute)
              </label>
              <input
                type="number"
                step="0.01"
                value={cpa || ""}
                onChange={(e) => setCpa(parseFloat(e.target.value) || 0)}
                className="w-full max-w-[180px] bg-[#0e1230] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#e9ecff] outline-none focus:border-[#6f84ff] focus:ring-2 focus:ring-[rgba(127,152,255,0.2)]"
              />
              <p className="text-[11px] text-[#a7acd4] mt-1">
                In this calculator, the <strong>attribute = purchase</strong>.
                So this CPA is how much you pay in ads to get{" "}
                <strong>one order</strong> (total ad spend ÷ number of
                purchases).
              </p>
            </div>

            {/* Explanation box */}
            <div className="mt-4 text-xs text-[#cfd3ff] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3.5 leading-relaxed space-y-2">
              <p>
                <strong>What does “profit before ads” mean?</strong> It&apos;s
                your revenue per order minus all non-ad costs (product,
                packaging, shipping-to-customer, payment fees, etc.). Basically:
                “If I spent zero on ads, how much profit would I make from one
                order?”
              </p>
              <p>
                <strong>ROAS (Return on Ad Spend)</strong> = Revenue ÷ Ad
                Spend. Here we look at it per order as{" "}
                <strong>AOV ÷ CPA</strong>, where{" "}
                <strong>CPA (cost per attribute)</strong> is the ad cost for one
                purchase (one completed order).
              </p>
              <p>
                <strong>Break-even CPA</strong> is your profit before ads per
                order. If your real CPA is lower than this, you still keep
                profit. If it’s higher, you lose money on each order.
              </p>
              <p>
                <strong>Example:</strong> AOV = 1000, non-ad costs = 500 ⇒
                profit before ads = 500 (this is your break-even CPA). If CPA =
                300 ⇒ profit after ads = 200 (good). If CPA = 500 ⇒ break-even.
                If CPA = 700 ⇒ you lose 200 per order.
              </p>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-3 -mt-1">
              <h3 className="text-sm font-semibold tracking-wide bg-gradient-to-r from-[#7c5cff] to-[#00d4ff] bg-clip-text text-transparent">
                Results
              </h3>
              <span className="text-[11px] px-3 py-0.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(124,92,255,0.12)] text-[#cfd3ff]">
                Live
              </span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.12em] text-[#9fa4d6] mt-1 mb-2">
              Per order profit structure
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">
                  Revenue per order (AOV)
                </span>
                <span className="font-semibold">{money(revenue)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">
                  Total non-ad cost per order
                </span>
                <span className="font-semibold">{money(costNonAd)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">
                  Profit before ads (per order)
                </span>
                <span className="font-semibold">{money(preAdProfit)}</span>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-gradient-to-tr from-[rgba(124,92,255,0.25)] to-[rgba(0,212,255,0.25)] border border-[rgba(255,255,255,0.08)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-4 space-y-1.5">
              <div className="flex items-center justify-between text-base">
                <span>Break-even CPA (max you can pay)</span>
                <span className="font-extrabold">{money(beCPA)}</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span>Break-even ROAS</span>
                <span className="font-extrabold">
                  {beROAS > 0 ? `${formatNumber(beROAS)}×` : "—"}
                </span>
              </div>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.08)] mt-4 pt-3 space-y-2 text-sm">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#9fa4d6] mt-1">
                With your current CPA
              </p>

              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">Actual CPA (input)</span>
                <span className="font-semibold">{money(cpa)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">
                  Profit per order after ads
                </span>
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
                <span className="text-[#cfd3ff]">
                  Profit margin after ads
                </span>
                <span className="font-semibold">
                  {formatNumber(marginAfterAds * 100)}%
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">
                  Actual ROAS (AOV ÷ CPA)
                </span>
                <span className="font-semibold">
                  {actualROAS > 0 ? `${formatNumber(actualROAS)}×` : "—"}
                </span>
              </div>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.08)] mt-4 pt-3 space-y-2 text-sm">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#9fa4d6] mt-1">
                Target margin check
              </p>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">
                  Max CPA for target margin
                </span>
                <span className="font-semibold">
                  {money(maxCpaForTarget)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#cfd3ff]">
                  Is your current CPA ok?
                </span>
                <span className="font-semibold text-xs">{statusText}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#a7acd4] mt-4">
              Tip: Get your <strong>real cost per order</strong> from the
              Manufacturing Cost Tool + shipping-to-customer and payment fees.
              Then test different CPAs and see how aggressive you can be with
              ads while keeping healthy profit.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";

export default function BeginnerPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Hero */}
      <section className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-3">
          Runway Tools – Beginner Plan
        </h1>
        <p className="text-zinc-300">
          Welcome! Your <span className="font-semibold">Beginner</span> plan is
          active. This page gives you access to all templates, calculators, and
          the AI included in this tier.
        </p>

        {/* 🔹 Quick-access button to Packaging Cost Builder */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/packaging-cost-builder")}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            Open Packaging Cost Builder
          </button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto space-y-10">
        {/* AI section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">AI Fashion Mentor - Operations Access</h2>
          <p className="text-zinc-400 mb-4">
            Use the AI to ask questions about pricing, launching, content ideas,
            and basic brand strategy.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
  onClick={() => router.push("/pro/mentor")}
  className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
>
  Open AI Fashion Mentor 
</button>


            <button
              onClick={() => router.push("/tools")}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-zinc-600 text-sm font-semibold text-zinc-100 hover:bg-zinc-900 transition"
            >
              All templates
            </button>
          </div>
        </div>

        {/* 🔻 Templates & PDFs block removed */}

        {/* Calculators section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Beginner Calculators</h2>
          <p className="text-zinc-400 mb-4">
            Quick tools to help you price products and understand basic numbers.
          </p>

          <div className="space-y-6">
            {/* Pricing Calculator */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">Pricing Calculator</h3>
                <p className="text-xs text-zinc-400">
                  Calculate your selling price, profit margin and markup per
                  unit.
                </p>
              </div>
              <button
                onClick={() => router.push("/pricing-calculator")}
                className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
              >
                Open
              </button>
            </div>

            {/* Income Statement */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">
                  Income Statement Calculator
                </h3>
                <p className="text-xs text-zinc-400">
                  Open your live income statement (with import from bookkeeping
                  and PDF).
                </p>
              </div>
              <button
                onClick={() => router.push("/income-statement")}
                className="text-sm font-semibold text-zinc-100 underline underline-offset-4"
              >
                Open
              </button>
            </div>

            {/* Break-Even & Profit Estimator */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">
                  Break-Even &amp; Profit Estimator
                </h3>
                <p className="text-xs text-zinc-400">
                  See how many units you need to sell to cover your costs and
                  hit a profit target.
                </p>
              </div>
              <button
                onClick={() => router.push("/break-even")}
                className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
              >
                Open
              </button>
            </div>

            {/* Monthly Cash Flow Calculator */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">
                  Monthly Cash Flow Calculator
                </h3>
                <p className="text-xs text-zinc-400">
                  Track opening cash, inflows, outflows and closing cash for
                  each month.
                </p>
              </div>
              <button
                onClick={() => router.push("/cashflow-calculator")}
                className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
              >
                Open
              </button>
            </div>

            {/* ROAS / CPA Break-Even Calculator */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">
                  ROAS / CPA Break-Even Calculator
                </h3>
                <p className="text-xs text-zinc-400">
                  Check your break-even CPA &amp; ROAS and see if your ads are
                  actually profitable.
                </p>
              </div>
              <button
                onClick={() => router.push("/roas-calculator")}
                className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
              >
                Open
              </button>
            </div>

            {/* Returns / Exchange Cost Model */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">
                  Returns / Exchange Cost Model
                </h3>
                <p className="text-xs text-zinc-400">
                  See how returns and exchanges reduce your profit per order and
                  per month.
                </p>
              </div>
              <button
                onClick={() => router.push("/returns-exchange")}
                className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
              >
                Open
              </button>
            </div>

            {/* Packaging Cost Builder */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">Packaging Cost Builder</h3>
                <p className="text-xs text-zinc-400">
                  Build your full packaging cost per order and per item to plug
                  into your pricing.
                </p>
              </div>
              <button
                onClick={() => router.push("/packaging-cost-builder")}
                className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
              >
                Open
              </button>
            </div>

            {/* Production Planner & MOQ Optimizer */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">
                  Production Planner &amp; MOQ Optimizer
                </h3>
                <p className="text-xs text-zinc-400">
                  Plan total units per drop, check MOQ, and stay within your
                  production budget.
                </p>
              </div>
              <button
                onClick={() => router.push("/production-planner")}
                className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Bookkeeping section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Bookkeeping</h2>
          <p className="text-zinc-400 mb-4">
            Track all your sales, COGS, and operating expenses in one place.
            Your records are saved per account, so when you log in again you
            will find everything still here.
          </p>

          <button
            onClick={() => router.push("/bookkeeping")}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            Open Bookkeeping
          </button>
        </div>
      </section>
    </main>
  );
}

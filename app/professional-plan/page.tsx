"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Hero */}
      <section className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-3">
          Runway Tools – Pro Plan
        </h1>
        <p className="text-zinc-300">
          You&apos;re in <span className="font-semibold">Pro</span>.{"  "}
          This is your control centre for all advanced calculators, templates and AI.
        </p>
      </section>

      <section className="max-w-5xl mx-auto space-y-10">
        {/* Pro AI */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">AI Fashion Mentor – Advanced Access</h2>
          <p className="text-zinc-400 mb-4">
            Ask deeper questions about scaling, cashflow, product strategy, drops,
            influencer deals and more.
          </p>

          



<div className="flex items-center gap-3 flex-wrap">
  <Link
    href="/pro/mentor"
    className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200"
  >
    Open AI Fashion Mentor
  </Link>

  <button
    onClick={() => router.push("/tools")}
    className="inline-flex items-center px-4 py-2 rounded-lg border border-zinc-600 text-sm font-semibold hover:bg-zinc-900"
  >
    All templates
  </button>
</div>
</div>.

        {/* Pro calculators */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Pro Calculators &amp; Dashboards
          </h2>

          {/* Pricing Calculator */}
          <div className="mt-0 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">Pricing Calculator</h3>
              <p className="text-xs text-zinc-400">
                Open your full pricing tool to calculate selling price, margin and
                markup per unit.
              </p>
            </div>
            <button
              onClick={() => router.push("/pricing-calculator")}
              className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
            >
              Open
            </button>
          </div>

          {/* Break-Even & Profit Estimator */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">
                Break-Even &amp; Profit Estimator
              </h3>
              <p className="text-xs text-zinc-400">
                See how many units you need to sell to cover your costs and hit a
                profit target.
              </p>
            </div>
            <button
              onClick={() => router.push("/break-even")}
              className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
            >
              Open
            </button>
          </div>

          {/* ROAS / CPA Break-Even Calculator */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">
                ROAS / CPA Break-Even Calculator
              </h3>
              <p className="text-xs text-zinc-400">
                Check your break-even CPA &amp; ROAS and see if your ad spend is
                actually profitable.
              </p>
            </div>
            <button
              onClick={() => router.push("/roas-cpa")}
              className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
            >
              Open
            </button>
          </div>

          {/* Monthly Cash Flow Calculator */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">
                Monthly Cash Flow Calculator
              </h3>
              <p className="text-xs text-zinc-400">
                Track opening cash, inflows, outflows and closing cash for each
                month.
              </p>
            </div>
            <button
              onClick={() => router.push("/cashflow-calculator")}
              className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
            >
              Open
            </button>
          </div>

          {/* Income Statement Calculator */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">
                Income Statement Calculator
              </h3>
              <p className="text-xs text-zinc-400">
                See your revenue, COGS, gross profit and net profit for a chosen
                period.
              </p>
            </div>
            <button
              onClick={() => router.push("/income-statement")}
              className="text-sm font-semibold text-zinc-900 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-200 transition"
            >
              Open
            </button>
          </div>

          {/* Returns / Exchange Cost Model */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">
                Returns / Exchange Cost Model
              </h3>
              <p className="text-xs text-zinc-400">
                See how returns and exchanges reduce your profit per order and per
                month.
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
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">Packaging Cost Builder</h3>
              <p className="text-xs text-zinc-400">
                Build your full packaging cost per order and per item to plug into
                your pricing.
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
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">
                Production Planner &amp; MOQ Optimizer
              </h3>
              <p className="text-xs text-zinc-400">
                Plan total units per drop, respect MOQ, and stay inside your
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

          {/* Manufacturer Costing Tool */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
            <div>
              <h3 className="font-semibold text-sm">Manufacturer Costing Tool</h3>
              <p className="text-xs text-zinc-400">
                Open your all-in manufacturing cost calculator inside Runway Tools.
              </p>
            </div>
            <button
              onClick={() => router.push("/manufacturer-cost")}
              className="text-sm font-semibold text-zinc-100 underline underline-offset-4 hover:text-white"
            >
              Open
            </button>
          </div>
        </div>

        {/* Bookkeeping */}
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

        {/* Runway Dashboard */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Runway Dashboard</h2>
          <p className="text-zinc-400 mb-4">
            See this month&apos;s revenue, COGS, gross profit, net profit, and
            retained profit — all calculated automatically from your bookkeeping
            entries for this account.
          </p>

          <button
            onClick={() => router.push("/runway-dashboard")}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            Open Runway Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}

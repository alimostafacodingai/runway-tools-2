"use client";

import Link from "next/link";
import React from "react";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07060A] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[45%] h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/18 blur-[120px]" />
        <div className="absolute left-[18%] top-[30%] h-[420px] w-[420px] rounded-full bg-indigo-600/12 blur-[120px]" />
        <div className="absolute right-[14%] top-[25%] h-[460px] w-[460px] rounded-full bg-fuchsia-500/10 blur-[140px]" />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_42%,rgba(0,0,0,0.75)_74%,rgba(0,0,0,0.92)_100%)]" />
      </div>

      {/* Particles */}
      <Particles />

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7">
        {/* Logo badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-purple-500/10 blur-xl" />
            <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur">
              <span className="text-sm font-semibold tracking-tight">
                Runway Tools
              </span>
              <span className="text-lg">🚀</span>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 shadow-[0_10px_40px_rgba(0,0,0,.35)] transition hover:bg-white/[0.06] hover:text-white"
          >
            Log in
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-10 pt-14">
        {/* pill */}
        <div className="mb-10 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/50 backdrop-blur">
          <span className="mr-2">✨</span>
          The future of fashion business
        </div>

        {/* title */}
        <h1 className="text-center text-[64px] font-semibold tracking-tight text-white sm:text-[84px] md:text-[104px] lg:text-[112px]">
          Runway Tools
        </h1>

        {/* rocket */}
        <div className="mt-5 grid place-items-center">
          <div className="animate-floatFast text-[40px] drop-shadow-[0_20px_40px_rgba(0,0,0,.7)]">
            🚀
          </div>
        </div>

        {/* subtitle */}
        <p className="mt-6 max-w-3xl text-center text-[20px] leading-relaxed text-white/40 sm:text-[22px]">
          All-in-one fashion business toolkit —
          <br />
          pricing, cash flow, and brand growth tools.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/plans"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8B4CF5] to-[#6E2EEA] px-8 py-4 text-sm font-semibold shadow-[0_18px_60px_rgba(139,76,245,.25)] transition hover:brightness-110 active:scale-[0.99]"
          >
            Explore Plans
            <span className="opacity-90 transition group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>

          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/85 shadow-[0_12px_50px_rgba(0,0,0,.35)] backdrop-blur transition hover:bg-white/[0.06]"
          >
            <span className="text-base">⚡</span> Free Tools
          </Link>
        </div>

        {/* Top feature cards */}
        <div className="mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <FeatureCard
            icon="💰"
            title="Pricing Calculator"
            desc="Optimal margins for your products"
          />
          <FeatureCard
            icon="📊"
            title="Cash Flow Tracker"
            desc="Real-time financial insights"
          />
          <FeatureCard
            icon="🚀"
            title="Growth Tools"
            desc="Scale your fashion brand"
          />
        </div>
      </section>

      {/* ========= SECTIONS ========= */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        {/* Toolkit */}
        <div className="mt-18">
          <SectionHeading
            eyebrow="What’s inside"
            title="A complete finance + operations toolkit"
            subtitle="Core systems that stop guesswork: pricing clarity, cash safety, production control, and real profit visibility."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <PillarCard
              icon="💸"
              title="Pricing & Profit"
              desc="Know your true profit after costs, returns, and fees — not fake spreadsheet math."
              bullets={["Pricing (EGP)", "Income Statement", "Break-even targets"]}
            />
            <PillarCard
              icon="📈"
              title="Cash & Planning"
              desc="Spot negative months early so you don’t get trapped mid-production."
              bullets={["Cash flow tracker", "Monthly inflow/outflow", "Risk months"]}
            />
            <PillarCard
              icon="🏭"
              title="Production & Costs"
              desc="Avoid MOQ traps and over-ordering. Plan quantities based on reality."
              bullets={["Manufacturing cost", "Production planning", "Packaging impact"]}
            />
            <PillarCard
              icon="🧠"
              title="Growth Support"
              desc="Make scaling decisions with data: ads, returns, pricing, and operations."
              bullets={["Returns impact", "ROAS/CPA break-even", "Growth decision support"]}
            />
          </div>
        </div>

        {/* Dashboard */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Dashboard"
            title="Your money control centre"
            subtitle="Revenue, costs, profit, and what you keep in the business — updated live from your bookkeeping entries."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Value bullets */}
            <div className="space-y-6 lg:col-span-2">
              <DashboardPoint
                icon="🟣"
                title="Live monthly summary"
                desc="Revenue, net profit, and retained profit for the selected month."
              />
              <DashboardPoint
                icon="🔵"
                title="Profit structure clarity"
                desc="See exactly how sales turn into profit: Revenue → COGS → OPEX → Net profit."
              />
              <DashboardPoint
                icon="🟪"
                title="Owner vs retained profit"
                desc="Know what you took out vs what stays in the brand to fund the next drops."
              />
              <DashboardPoint
                icon="⚡"
                title="Trace every number"
                desc="Every total is backed by your transaction entries — no mystery math."
              />
            </div>

            {/* Preview panel mock (matches your real dashboard layout) */}
            <div className="tilt3d relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur lg:col-span-3">
              <div className="pointer-events-none absolute -top-24 left-1/2 h-44 w-[140%] -translate-x-1/2 rounded-full bg-white/10 blur-2xl opacity-30" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-transparent" />

              <div className="relative">
                <div>
                  <div className="text-xs text-white/45">Runway Dashboard</div>
                  <div className="mt-1 text-lg font-semibold text-white/90">
                    Live summary for January 2026
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-white/45">
                    Based on your bookkeeping entries. This is your money control centre:
                    revenue, costs, profit, and what you keep in the business.
                  </div>
                </div>

                {/* Top 3 stat cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <DashStat
                    label="Revenue this month"
                    value="E£0.00"
                    hint="Total sales (Sales revenue)"
                    tone="neutral"
                  />
                  <DashStat
                    label="Net profit this month"
                    value="E£-8,000.00"
                    hint="After COGS and operating expenses"
                    tone="bad"
                  />
                  <DashStat
                    label="Retained profit"
                    value="E£-8,000.00"
                    hint="Net profit minus owner's withdrawals"
                    tone="bad"
                  />
                </div>

                {/* Two big panels */}
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <DashPanel title="Profit structure" subtitle="How your sales turn into profit this month.">
                    <DashRow k="Revenue" v="E£0.00" />
                    <DashRow k="COGS (product costs)" v="E£3,000.00" />
                    <DashRow k="Gross profit" v="E£-3,000.00" tone="bad" />
                    <DashRow k="Operating expenses (OPEX)" v="E£5,000.00" />
                    <DashRow k="Net profit" v="E£-8,000.00" tone="bad" bold />
                    <div className="mt-4 space-y-2 text-[11px] text-white/40">
                      <div>• Gross profit = Revenue − COGS (fabric, production, packaging, shipping-to-you).</div>
                      <div>• Net profit = Gross profit − OPEX (marketing, rent, website, salaries, etc.).</div>
                    </div>
                  </DashPanel>

                  <DashPanel
                    title="Owner & retained profit"
                    subtitle="How much you take out vs how much stays in the brand."
                  >
                    <DashRow k="Net profit" v="E£-8,000.00" tone="bad" />
                    <DashRow k="Owner's withdrawals" v="E£0.00" />
                    <DashRow k="Retained profit" v="E£-8,000.00" tone="bad" bold />
                    <div className="mt-4 space-y-2 text-[11px] text-white/40">
                      <div>• Owner's withdrawals = money you take out for yourself (not a business expense).</div>
                      <div>• Retained profit = Net profit − withdrawals. This funds the next drops.</div>
                    </div>
                  </DashPanel>
                </div>

                {/* Entries table */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white/85">
                      This month&apos;s entries
                    </div>
                    <div className="text-xs text-white/45">2 transactions</div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                    <div className="grid grid-cols-12 gap-2 bg-white/[0.03] px-3 py-2 text-[11px] text-white/55">
                      <div className="col-span-2">Date</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-4">Category</div>
                      <div className="col-span-2 text-right">Amount</div>
                    </div>

                    <div className="divide-y divide-white/10">
                      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] text-white/70">
                        <div className="col-span-2">2026-01-05</div>
                        <div className="col-span-4">stock for summer drop</div>
                        <div className="col-span-4">COGS — Materials / Fabric</div>
                        <div className="col-span-2 text-right">E£3,000.00</div>
                      </div>
                      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] text-white/70">
                        <div className="col-span-2">2026-01-05</div>
                        <div className="col-span-4">rent for physical store - jan</div>
                        <div className="col-span-4">OPEX — Rent / Utilities</div>
                        <div className="col-span-2 text-right">E£5,000.00</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-white/40">
                    Edit your data from the Bookkeeping page. This dashboard is read-only and always reflects your latest entries.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow (fixed exactly as you requested) */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Workflow"
            title="How founders use Runway Tools"
            subtitle="Input real numbers → run core tools → check dashboard → make the best decision with the assistance of AI."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <WorkflowCard
              step="01"
              title="Input real numbers"
              desc="Enter your real costs, prices, expenses, and bookkeeping entries — no guessing."
            />
            <WorkflowCard
              step="02"
              title="Run core tools"
              desc="Use pricing, cash flow, and profit tools to compute the real financial picture."
            />
            <WorkflowCard
              step="03"
              title="Check the dashboard"
              desc="See the live monthly summary: profit structure, retained profit, and entries."
            />
            <WorkflowCard
              step="04"
              title="Make the best decision with AI"
              desc="AI reads your dashboard + tools and tells you what to change first to improve profit and cash."
            />
          </div>
        </div>

        {/* Templates */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Templates Suite"
            title="Not just calculators — execution templates"
            subtitle="Templates that help you move faster and avoid costly mistakes while scaling."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <PillarCard
              icon="🧾"
              title="Store & Operations"
              desc="Operational templates that remove friction and protect profit."
              bullets={["Refund policy", "AR/EN invoice/labels", "Business plan"]}
            />
            <PillarCard
              icon="🎯"
              title="Brand & Offers"
              desc="Positioning + offers + content frameworks that convert."
              bullets={["Brand identity", "Content calendar", "Product descriptions"]}
            />
            <PillarCard
              icon="✉️"
              title="Marketing Templates"
              desc="Simple email flows that increase repeat purchases."
              bullets={["Email marketing", "Post-purchase flow", "Sizing clarity"]}
            />
          </div>

          <div className="mt-10 text-center text-xs text-white/35">
            Clear inputs → instant outputs → next action.
          </div>
        </div>
      </section>

      {/* Floating 3D-ish shapes layer */}
      <Shapes />

      {/* Animations */}
      <style jsx global>{`
        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) rotate(-12deg);
          }
          50% {
            transform: translateY(-22px) rotate(-8deg);
          }
        }
        @keyframes floatMid {
          0%,
          100% {
            transform: translateY(0px) rotate(14deg);
          }
          50% {
            transform: translateY(-28px) rotate(10deg);
          }
        }
        @keyframes floatFast {
          0%,
          100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-14px) rotate(2deg);
          }
        }
        .animate-floatSlow {
          animation: floatSlow 6.8s ease-in-out infinite;
        }
        .animate-floatMid {
          animation: floatMid 5.9s ease-in-out infinite;
        }
        .animate-floatFast {
          animation: floatFast 4.4s ease-in-out infinite;
        }

        /* subtle 3D hover tilt */
        .tilt3d {
          transform-style: preserve-3d;
          transition: transform 220ms ease, filter 220ms ease;
        }
        .tilt3d:hover {
          transform: translateY(-4px) rotateX(6deg) rotateY(-6deg);
          filter: brightness(1.06);
        }
      `}</style>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-sm text-white/45">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-white/45 sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="tilt3d rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-6 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur transition hover:bg-white/[0.05]">
      <div className="mb-3 text-2xl">{icon}</div>
      <div className="text-base font-semibold text-white/90">{title}</div>
      <div className="mt-2 text-sm text-white/45">{desc}</div>
    </div>
  );
}

function PillarCard({
  icon,
  title,
  desc,
  bullets,
}: {
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <div className="tilt3d group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur transition hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-44 w-[140%] -translate-x-1/2 rounded-full bg-white/10 blur-2xl opacity-0 transition group-hover:opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-transparent" />

      <div className="relative">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10 shadow-[0_14px_60px_rgba(0,0,0,.45)]">
          <span className="text-xl">{icon}</span>
        </div>

        <div className="text-lg font-semibold text-white/90">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-white/45">{desc}</div>

        <ul className="mt-4 space-y-2 text-sm text-white/60">
          {bullets.slice(0, 3).map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-purple-400/70" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DashboardPoint({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="tilt3d rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur transition hover:bg-white/[0.06]">
      <div className="flex items-start gap-3">
        <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
          <span className="text-sm">{icon}</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-white/45">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function DashStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "neutral" | "bad";
}) {
  const valueClass =
    tone === "bad" ? "text-red-400" : "text-white/90";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 backdrop-blur">
      <div className="text-[11px] text-white/55">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${valueClass}`}>{value}</div>
      <div className="mt-1 text-[11px] text-white/40">{hint}</div>
    </div>
  );
}

function DashPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 backdrop-blur">
      <div className="text-sm font-semibold text-white/85">{title}</div>
      <div className="mt-1 text-[11px] text-white/45">{subtitle}</div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function DashRow({
  k,
  v,
  tone = "neutral",
  bold = false,
}: {
  k: string;
  v: string;
  tone?: "neutral" | "bad";
  bold?: boolean;
}) {
  const vClass =
    tone === "bad" ? "text-red-400" : "text-white/80";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className={`text-[11px] ${bold ? "font-semibold text-white/75" : "text-white/55"}`}>
        {k}
      </div>
      <div className={`text-[11px] ${bold ? "font-semibold" : ""} ${vClass}`}>
        {v}
      </div>
    </div>
  );
}

function WorkflowCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="tilt3d group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur transition hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/12 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-44 w-[140%] -translate-x-1/2 rounded-full bg-white/10 blur-2xl opacity-0 transition group-hover:opacity-40" />

      <div className="relative">
        <div className="text-xs font-semibold text-white/45">{step}</div>
        <div className="mt-2 text-lg font-semibold text-white/90">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-white/45">{desc}</div>
      </div>
    </div>
  );
}

function Particles() {
  const dots = [
    ["7%", "12%", 3, 0.22],
    ["16%", "18%", 2, 0.18],
    ["28%", "10%", 2, 0.16],
    ["38%", "22%", 3, 0.18],
    ["52%", "14%", 2, 0.16],
    ["64%", "18%", 3, 0.18],
    ["78%", "10%", 2, 0.16],
    ["88%", "18%", 3, 0.18],
    ["10%", "42%", 2, 0.14],
    ["22%", "56%", 3, 0.16],
    ["34%", "48%", 2, 0.14],
    ["46%", "60%", 2, 0.12],
    ["58%", "44%", 3, 0.16],
    ["70%", "52%", 2, 0.14],
    ["82%", "46%", 3, 0.16],
    ["92%", "58%", 2, 0.14],
    ["12%", "78%", 2, 0.12],
    ["26%", "86%", 3, 0.14],
    ["44%", "82%", 2, 0.12],
    ["62%", "88%", 2, 0.12],
    ["76%", "84%", 3, 0.14],
    ["90%", "80%", 2, 0.12],
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map(([l, t, s, o], i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#B66BFF]"
          style={{
            left: l,
            top: t,
            width: s,
            height: s,
            opacity: o,
            filter: "blur(0.2px)",
          }}
        />
      ))}
    </div>
  );
}

function Shapes() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* LEFT big rounded square */}
      <div className="absolute left-[4%] top-[26%] h-[150px] w-[150px] animate-floatSlow [perspective:1000px]">
        <div className="h-full w-full rounded-[32px] bg-gradient-to-br from-[#7B2CFF] to-[#3B1686] shadow-[0_50px_160px_rgba(123,44,255,.22)] ring-1 ring-white/10 [transform:rotate(14deg)_rotateX(18deg)_rotateY(-18deg)]" />
      </div>

      {/* LEFT ring */}
      <div className="absolute left-[6%] top-[46%] h-[120px] w-[120px] animate-floatMid rounded-full bg-gradient-to-br from-[#7B2CFF]/80 to-[#4C1AAE]/40 shadow-[0_60px_160px_rgba(123,44,255,.18)] ring-1 ring-white/10 [transform:rotateX(16deg)_rotateY(-18deg)]">
        <div className="absolute inset-[26%] rounded-full bg-[#07060A] ring-1 ring-white/10" />
      </div>

      {/* RIGHT top blob */}
      <div className="absolute right-[7%] top-[18%] h-[160px] w-[160px] animate-floatMid rounded-full bg-gradient-to-br from-[#7B2CFF] to-[#2C0F66] shadow-[0_70px_190px_rgba(123,44,255,.18)] ring-1 ring-white/10" />

      {/* RIGHT ring */}
      <div className="absolute right-[8%] top-[36%] h-[120px] w-[120px] animate-floatSlow rounded-full bg-gradient-to-br from-[#7B2CFF]/80 to-[#4C1AAE]/40 shadow-[0_70px_190px_rgba(123,44,255,.16)] ring-1 ring-white/10 [transform:rotateX(14deg)_rotateY(18deg)]">
        <div className="absolute inset-[26%] rounded-full bg-[#07060A] ring-1 ring-white/10" />
      </div>

      {/* bottom-right rounded square */}
      <div className="absolute bottom-[10%] right-[12%] h-[140px] w-[140px] animate-floatSlow [perspective:1000px]">
        <div className="h-full w-full rounded-[32px] bg-gradient-to-br from-[#7B2CFF] to-[#3B1686] shadow-[0_70px_190px_rgba(123,44,255,.18)] ring-1 ring-white/10 [transform:rotate(-16deg)_rotateX(18deg)_rotateY(18deg)]" />
      </div>

      {/* extra depth */}
      <div className="absolute left-[28%] top-[14%] h-24 w-24 animate-floatMid rounded-full bg-purple-500/12 blur-md" />
      <div className="absolute right-[24%] top-[58%] h-16 w-16 animate-floatSlow rounded-[24px] bg-fuchsia-500/10 blur-sm" />
      <div className="absolute left-[14%] bottom-[18%] h-20 w-20 animate-floatMid rounded-full bg-indigo-500/10 blur-md" />
      <div className="absolute right-[18%] bottom-[26%] h-10 w-10 animate-floatSlow rounded-full bg-purple-500/14 blur-sm" />
    </div>
  );
}

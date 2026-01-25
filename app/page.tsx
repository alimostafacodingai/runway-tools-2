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
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span>Runway Tools</span>
          <span className="text-xl">🚀</span>
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
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-14">
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
          All-in-one fashion business toolkit —<br />
          pricing, cash flow, and brand growth tools.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/plans"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8B4CF5] to-[#6E2EEA] px-8 py-4 text-sm font-semibold shadow-[0_18px_60px_rgba(139,76,245,.25)] transition hover:brightness-110 active:scale-[0.99]"
          >
            Explore Plans
            <span className="opacity-90 transition group-hover:translate-x-0.5">↗</span>
          </Link>

          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/85 shadow-[0_12px_50px_rgba(0,0,0,.35)] backdrop-blur transition hover:bg-white/[0.06]"
          >
            <span className="text-base">⚡</span> Free Tools
          </Link>
        </div>

        {/* Feature cards */}
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
      `}</style>
    </main>
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
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-6 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur transition hover:bg-white/[0.05]">
      <div className="mb-3 text-2xl">{icon}</div>
      <div className="text-base font-semibold text-white/90">{title}</div>
      <div className="mt-2 text-sm text-white/45">{desc}</div>
    </div>
  );
}

function Particles() {
  // deterministic positions so Next.js doesn’t complain about hydration
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
      {/* LEFT big diamond */}
      <div className="absolute left-[6%] top-[26%] h-[140px] w-[140px] animate-floatSlow [perspective:1000px]">
        <div className="h-full w-full rounded-3xl bg-gradient-to-br from-[#7B2CFF] to-[#3B1686] shadow-[0_40px_120px_rgba(123,44,255,.22)] ring-1 ring-white/10 [transform:rotate(20deg)_rotateX(18deg)_rotateY(-18deg)]" />
      </div>

      {/* LEFT ring */}
      <div className="absolute left-[8%] top-[46%] h-[120px] w-[120px] animate-floatMid rounded-full bg-gradient-to-br from-[#7B2CFF]/80 to-[#4C1AAE]/40 shadow-[0_50px_140px_rgba(123,44,255,.18)] ring-1 ring-white/10 [transform:rotateX(16deg)_rotateY(-18deg)]">
        <div className="absolute inset-[26%] rounded-full bg-[#07060A] ring-1 ring-white/10" />
      </div>

      {/* RIGHT blob */}
      <div className="absolute right-[9%] top-[26%] h-[140px] w-[140px] animate-floatMid rounded-full bg-gradient-to-br from-[#7B2CFF] to-[#2C0F66] shadow-[0_60px_160px_rgba(123,44,255,.18)] ring-1 ring-white/10" />

      {/* RIGHT ring */}
      <div className="absolute right-[10%] top-[44%] h-[120px] w-[120px] animate-floatSlow rounded-full bg-gradient-to-br from-[#7B2CFF]/80 to-[#4C1AAE]/40 shadow-[0_60px_160px_rgba(123,44,255,.16)] ring-1 ring-white/10 [transform:rotateX(14deg)_rotateY(18deg)]">
        <div className="absolute inset-[26%] rounded-full bg-[#07060A] ring-1 ring-white/10" />
      </div>

      {/* bottom-right diamond */}
      <div className="absolute bottom-[12%] right-[14%] h-[120px] w-[120px] animate-floatSlow [perspective:1000px]">
        <div className="h-full w-full rounded-3xl bg-gradient-to-br from-[#7B2CFF] to-[#3B1686] shadow-[0_60px_160px_rgba(123,44,255,.18)] ring-1 ring-white/10 [transform:rotate(-20deg)_rotateX(18deg)_rotateY(18deg)]" />
      </div>
    </div>
  );
}

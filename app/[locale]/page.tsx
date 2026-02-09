"use client";

import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import LocaleToggle from "./_components/LocaleToggle";

export default function Landing() {
  const t = useTranslations("landing");
  const locale = useLocale();

  // Locale-safe URL helper: never drop /en or /ar
  const href = (path: string) => `/${locale}${path}`;

  // Arrays (translated)
  const pricingBullets = t.raw("toolkit.pricing.bullets") as string[];
  const cashBullets = t.raw("toolkit.cash.bullets") as string[];
  const prodBullets = t.raw("toolkit.production.bullets") as string[];
  const growthBullets = t.raw("toolkit.growth.bullets") as string[];

  const tplStoreBullets = t.raw("templates.store.bullets") as string[];
  const tplBrandBullets = t.raw("templates.brand.bullets") as string[];
  const tplMktBullets = t.raw("templates.marketing.bullets") as string[];

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
                {t("brandName")}
              </span>
              <span className="text-lg">{"\u{1F680}"}</span>
            </div>
          </div>
        </div>

       <nav className="flex items-center gap-3">
  <LocaleToggle />

  <Link
    href={href("/login")}
    className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 shadow-[0_10px_40px_rgba(0,0,0,.35)] transition hover:bg-white/[0.06] hover:text-white"
  >
    {t("login")}
  </Link>
</nav>

      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-10 pt-14">
        {/* pill */}
        <div className="mb-10 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/50 backdrop-blur">
          <span className="mr-2">{"\u{2728}"}</span>
          {t("hero.pill")}
        </div>

        {/* title */}
        <h1 className="text-center text-[64px] font-semibold tracking-tight text-white sm:text-[84px] md:text-[104px] lg:text-[112px]">
          {t("brandName")}
        </h1>

        {/* rocket */}
        <div className="mt-5 grid place-items-center">
          <div className="animate-floatFast text-[40px] drop-shadow-[0_20px_40px_rgba(0,0,0,.7)]">
            {"\u{1F680}"}
          </div>
        </div>

        {/* subtitle */}
        <p className="mt-6 max-w-3xl text-center text-[20px] leading-relaxed text-white/40 sm:text-[22px]">
          {t("hero.subtitleLine1")}
          <br />
          {t("hero.subtitleLine2")}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={href("/plans")}
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8B4CF5] to-[#6E2EEA] px-8 py-4 text-sm font-semibold shadow-[0_18px_60px_rgba(139,76,245,.25)] transition hover:brightness-110 active:scale-[0.99]"
          >
            {t("hero.ctaPlans")}
            <span className="opacity-90 transition group-hover:translate-x-0.5">
              {"\u{2197}"}
            </span>
          </Link>

          <Link
            href={href("/tools")}
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/85 shadow-[0_12px_50px_rgba(0,0,0,.35)] backdrop-blur transition hover:bg-white/[0.06]"
          >
            <span className="text-base">{"\u{26A1}"}</span> {t("hero.ctaFreeTools")}
          </Link>
        </div>

        {/* Top feature cards */}
        <div className="mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={"\u{1F4B0}"}
            title={t("features.f1Title")}
            desc={t("features.f1Desc")}
          />
          <FeatureCard
            icon={"\u{1F4CA}"}
            title={t("features.f2Title")}
            desc={t("features.f2Desc")}
          />
          <FeatureCard
            icon={"\u{1F680}"}
            title={t("features.f3Title")}
            desc={t("features.f3Desc")}
          />
        </div>
      </section>

      {/* ========= SECTIONS ========= */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        {/* Toolkit */}
        <div className="mt-18">
          <SectionHeading
            eyebrow={t("toolkit.heading.eyebrow")}
            title={t("toolkit.heading.title")}
            subtitle={t("toolkit.heading.subtitle")}
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <PillarCard
              icon="ðŸ’¸"
              title={t("toolkit.pricing.title")}
              desc={t("toolkit.pricing.desc")}
              bullets={pricingBullets}
            />
            <PillarCard
              icon={"\u{1F4C8}"}
              title={t("toolkit.cash.title")}
              desc={t("toolkit.cash.desc")}
              bullets={cashBullets}
            />
            <PillarCard
              icon={"\u{1F3ED}"}
              title={t("toolkit.production.title")}
              desc={t("toolkit.production.desc")}
              bullets={prodBullets}
            />
            <PillarCard
              icon={"\u{1F9E0}"}
              title={t("toolkit.growth.title")}
              desc={t("toolkit.growth.desc")}
              bullets={growthBullets}
            />
          </div>
        </div>

        {/* Dashboard */}
        <div className="mt-20">
          <SectionHeading
            eyebrow={t("dashboard.heading.eyebrow")}
            title={t("dashboard.heading.title")}
            subtitle={t("dashboard.heading.subtitle")}
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Value bullets */}
            <div className="space-y-6 lg:col-span-2">
              <DashboardPoint
                icon={"\u{1F7E3}"}
                title={t("dashboard.points.p1Title")}
                desc={t("dashboard.points.p1Desc")}
              />
              <DashboardPoint
                icon={"\u{1F535}"}
                title={t("dashboard.points.p2Title")}
                desc={t("dashboard.points.p2Desc")}
              />
              <DashboardPoint
                icon={"\u{1F7EA}"}
                title={t("dashboard.points.p3Title")}
                desc={t("dashboard.points.p3Desc")}
              />
              <DashboardPoint
              icon={"\u{26A1}"}
                title={t("dashboard.points.p4Title")}
                desc={t("dashboard.points.p4Desc")}
              />
            </div>

            {/* Preview panel mock */}
            <div className="tilt3d relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur lg:col-span-3">
              <div className="pointer-events-none absolute -top-24 left-1/2 h-44 w-[140%] -translate-x-1/2 rounded-full bg-white/10 blur-2xl opacity-30" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-transparent" />

              <div className="relative">
                <div>
                  <div className="text-xs text-white/45">
                    {t("dashboard.mock.kicker")}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white/90">
                    {t("dashboard.mock.title")}
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-white/45">
                    {t("dashboard.mock.desc")}
                  </div>
                </div>

                {/* Top 3 stat cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <DashStat
                    label={t("dashboard.mock.stats.s1Label")}
                    value={t("dashboard.mock.stats.s1Value")}
                    hint={t("dashboard.mock.stats.s1Hint")}
                    tone="neutral"
                  />
                  <DashStat
                    label={t("dashboard.mock.stats.s2Label")}
                    value={t("dashboard.mock.stats.s2Value")}
                    hint={t("dashboard.mock.stats.s2Hint")}
                    tone="bad"
                  />
                  <DashStat
                    label={t("dashboard.mock.stats.s3Label")}
                    value={t("dashboard.mock.stats.s3Value")}
                    hint={t("dashboard.mock.stats.s3Hint")}
                    tone="bad"
                  />
                </div>

                {/* Two big panels */}
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <DashPanel
                    title={t("dashboard.mock.panels.p1Title")}
                    subtitle={t("dashboard.mock.panels.p1Subtitle")}
                  >
                    <DashRow k={t("dashboard.mock.panels.p1Rows.r1k")} v={t("dashboard.mock.panels.p1Rows.r1v")} />
                    <DashRow k={t("dashboard.mock.panels.p1Rows.r2k")} v={t("dashboard.mock.panels.p1Rows.r2v")} />
                    <DashRow k={t("dashboard.mock.panels.p1Rows.r3k")} v={t("dashboard.mock.panels.p1Rows.r3v")} tone="bad" />
                    <DashRow k={t("dashboard.mock.panels.p1Rows.r4k")} v={t("dashboard.mock.panels.p1Rows.r4v")} />
                    <DashRow k={t("dashboard.mock.panels.p1Rows.r5k")} v={t("dashboard.mock.panels.p1Rows.r5v")} tone="bad" bold />

                    <div className="mt-4 space-y-2 text-[11px] text-white/40">
                      <div>• {t("dashboard.mock.panels.p1Foot.f1")}</div>
                      <div>• {t("dashboard.mock.panels.p1Foot.f2")}</div>
                    </div>
                  </DashPanel>

                  <DashPanel
                    title={t("dashboard.mock.panels.p2Title")}
                    subtitle={t("dashboard.mock.panels.p2Subtitle")}
                  >
                    <DashRow k={t("dashboard.mock.panels.p2Rows.r1k")} v={t("dashboard.mock.panels.p2Rows.r1v")} tone="bad" />
                    <DashRow k={t("dashboard.mock.panels.p2Rows.r2k")} v={t("dashboard.mock.panels.p2Rows.r2v")} />
                    <DashRow k={t("dashboard.mock.panels.p2Rows.r3k")} v={t("dashboard.mock.panels.p2Rows.r3v")} tone="bad" bold />

                    <div className="mt-4 space-y-2 text-[11px] text-white/40">
                      <div>• {t("dashboard.mock.panels.p2Foot.f1")}</div>
                      <div>• {t("dashboard.mock.panels.p2Foot.f2")}</div>
                    </div>
                  </DashPanel>
                </div>

                {/* Entries table */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white/85">
                      {t("dashboard.mock.entries.title")}
                    </div>
                    <div className="text-xs text-white/45">
                      {t("dashboard.mock.entries.count")}
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                    <div className="grid grid-cols-12 gap-2 bg-white/[0.03] px-3 py-2 text-[11px] text-white/55">
                      <div className="col-span-2">
                        {t("dashboard.mock.entries.headers.date")}
                      </div>
                      <div className="col-span-4">
                        {t("dashboard.mock.entries.headers.description")}
                      </div>
                      <div className="col-span-4">
                        {t("dashboard.mock.entries.headers.category")}
                      </div>
                      <div className="col-span-2 text-right">
                        {t("dashboard.mock.entries.headers.amount")}
                      </div>
                    </div>

                    <div className="divide-y divide-white/10">
                      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] text-white/70">
                        <div className="col-span-2">
                          {t("dashboard.mock.entries.r1.date")}
                        </div>
                        <div className="col-span-4">
                          {t("dashboard.mock.entries.r1.desc")}
                        </div>
                        <div className="col-span-4">
                          {t("dashboard.mock.entries.r1.cat")}
                        </div>
                        <div className="col-span-2 text-right">
                          {t("dashboard.mock.entries.r1.amount")}
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] text-white/70">
                        <div className="col-span-2">
                          {t("dashboard.mock.entries.r2.date")}
                        </div>
                        <div className="col-span-4">
                          {t("dashboard.mock.entries.r2.desc")}
                        </div>
                        <div className="col-span-4">
                          {t("dashboard.mock.entries.r2.cat")}
                        </div>
                        <div className="col-span-2 text-right">
                          {t("dashboard.mock.entries.r2.amount")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-white/40">
                    {t("dashboard.mock.entries.note")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow */}
        <div className="mt-20">
          <SectionHeading
            eyebrow={t("workflow.heading.eyebrow")}
            title={t("workflow.heading.title")}
            subtitle={t("workflow.heading.subtitle")}
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-4">
            <WorkflowCard
              step={t("workflow.steps.s1Step")}
              title={t("workflow.steps.s1Title")}
              desc={t("workflow.steps.s1Desc")}
            />
            <WorkflowCard
              step={t("workflow.steps.s2Step")}
              title={t("workflow.steps.s2Title")}
              desc={t("workflow.steps.s2Desc")}
            />
            <WorkflowCard
              step={t("workflow.steps.s3Step")}
              title={t("workflow.steps.s3Title")}
              desc={t("workflow.steps.s3Desc")}
            />
            <WorkflowCard
              step={t("workflow.steps.s4Step")}
              title={t("workflow.steps.s4Title")}
              desc={t("workflow.steps.s4Desc")}
            />
          </div>
        </div>

        {/* Templates */}
        <div className="mt-20">
          <SectionHeading
            eyebrow={t("templates.heading.eyebrow")}
            title={t("templates.heading.title")}
            subtitle={t("templates.heading.subtitle")}
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <PillarCard
              icon={"\u{1F9FE}"}
              title={t("templates.store.title")}
              desc={t("templates.store.desc")}
              bullets={tplStoreBullets}
            />
            <PillarCard
              icon={"\u{1F3AF}"}
              title={t("templates.brand.title")}
              desc={t("templates.brand.desc")}
              bullets={tplBrandBullets}
            />
            <PillarCard
              icon={"\u{2709}\u{FE0F}"}
              title={t("templates.marketing.title")}
              desc={t("templates.marketing.desc")}
              bullets={tplMktBullets}
            />
          </div>

          <div className="mt-10 text-center text-xs text-white/35">
            {t("templates.footerLine")}
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
  const valueClass = tone === "bad" ? "text-red-400" : "text-white/90";

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
  const vClass = tone === "bad" ? "text-red-400" : "text-white/80";

  return (
    <div className="flex items-center justify-between gap-3">
      <div
        className={`text-[11px] ${
          bold ? "font-semibold text-white/75" : "text-white/55"
        }`}
      >
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
      {dots.map(([l, tt, s, o], i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#B66BFF]"
          style={{
            left: l,
            top: tt,
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



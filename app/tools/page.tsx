"use client";

import { useRouter } from "next/navigation";

export default function ToolsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Hero */}
      <section className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-3">Runway Tools – Free Plan</h1>
        <p className="text-zinc-300">
          Start for free with core templates and Fashion Mentor AI Lite.
          When you&apos;re ready to plug in real numbers and get full analysis, you can upgrade anytime.
        </p>
      </section>

      <section className="max-w-5xl mx-auto space-y-10">
        {/* Fashion Mentor AI Lite */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Fashion Mentor AI Lite</h2>
          <p className="text-zinc-400 mb-4">
            Ask how each Runway Tools calculator works, what it does, and which tool to use for what.
            For &quot;is this good or bad?&quot; decisions and full strategy, upgrade to Fashion Mentor AI Pro.
          </p>

          <a
            href="https://chatgpt.com/g/g-68b2591e88248191ace922d144f65135-fashion-mentor-lite-by-runway-tools"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            Open Fashion Mentor AI Lite
          </a>
        </div>

        {/* Free PDFs / Templates */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Free Templates &amp; PDFs</h2>
          <p className="text-zinc-400 mb-4">
            Download these starter templates to plan your brand and understand the basics before upgrading
            to the full calculators and dashboards.
          </p>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {/* Business Plan Template */}
            <a
              href="/pdfs/business-plan-template.pdf" // make sure this matches the actual file name
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Business Plan Template (Free)
              </h3>
              <p className="text-xs text-zinc-400">
                Simple structure to map out your brand idea and launch steps.
              </p>
            </a>

            {/* Brand Identity Starter */}
            <a
              href="/pdfs/brand-identity-template.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Brand Identity Starter
              </h3>
              <p className="text-xs text-zinc-400">
                Define your brand vibe, target customer and positioning.
              </p>
            </a>

            {/* Email Marketing Templates */}
            <a
              href="/pdfs/email-marketing-templates.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Email Marketing Templates
              </h3>
              <p className="text-xs text-zinc-400">
                Plug-and-play email scripts for launches, drops and follow-ups.
              </p>
            </a>

            {/* Product Design Worksheet */}
            <a
              href="/pdfs/product-design-worksheet.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Product Design Worksheet
              </h3>
              <p className="text-xs text-zinc-400">
                Structure your product ideas, fabrics, fits and details before sampling.
              </p>
            </a>

            {/* Refund & Exchange Policy */}
            <a
              href="/pdfs/Refund_and_Exchange_Policy_Template.docx.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Refund &amp; Exchange Policy
              </h3>
              <p className="text-xs text-zinc-400">
                Ready-to-edit policy to protect your brand and set clear rules for customers.
              </p>
            </a>

            {/* Shopify Product Description Template */}
            <a
              href="/pdfs/Shopify-product-description-template(3).pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Shopify Product Description
              </h3>
              <p className="text-xs text-zinc-400">
                Framework to write high-converting product pages for your store.
              </p>
            </a>

            {/* Size Chart Template */}
            <a
              href="/pdfs/size-chart-template.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Size Chart Template
              </h3>
              <p className="text-xs text-zinc-400">
                Fillable size chart to reduce returns and keep customers happy.
              </p>
            </a>

            {/* Supplier Outreach Email Template */}
            <a
              href="/pdfs/supplier-outreach-email-template.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Supplier Outreach Email
              </h3>
              <p className="text-xs text-zinc-400">
                Professional outreach script to contact manufacturers and suppliers.
              </p>
            </a>

            {/* Weekly Content Calendar */}
            <a
              href="/pdfs/weekly-content-calendar.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Weekly Content Calendar
              </h3>
              <p className="text-xs text-zinc-400">
                Plan your TikTok, Reels and posts for the whole week in one place.
              </p>
            </a>

            {/* Label & Invoice Template (Arabic / English) */}
            <a
              href="/pdfs/label-invoice-template-arabic-english(1).docx.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white text-sm">
                Label &amp; Invoice Template (Arabic / English)
              </h3>
              <p className="text-xs text-zinc-400">
                Editable Google Docs template for invoices and shipping labels in Arabic &amp; English.
              </p>
            </a>
          </div>
        </div>

        {/* Upgrade Tease */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Upgrade when you&apos;re ready</h2>
          <p className="text-zinc-400 mb-4 text-sm">
            Stay on Free as long as you want. When you&apos;re ready to use full calculators, bookkeeping,
            dashboards and Fashion Mentor AI Pro, you can upgrade to a paid plan in a few seconds.
          </p>

          <button
            onClick={() => router.push("/plans")}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            View all plans
          </button>
        </div>
      </section>
    </main>
  );
}

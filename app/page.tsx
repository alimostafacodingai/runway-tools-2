"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Top nav with logo + login */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold">Runway Tools 🚀</div>

        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg border border-white/40 hover:bg-white hover:text-black transition"
          >
            Log in
          </Link>
        </nav>
      </header>

      {/* Center hero section (your existing layout, with both buttons) */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-extrabold mb-6">Runway Tools 🚀</h1>

        <p className="text-white/70 text-lg max-w-2xl mb-10">
          All-in-one fashion business toolkit — pricing, cash flow, and brand
          growth tools.
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/plans"
            className="inline-block bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            View Pricing Plans
          </Link>

          <Link
            href="/tools"
            className="inline-block border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition"
          >
            Explore Free Tools
          </Link>
        </div>
      </section>
    </main>
  );
}

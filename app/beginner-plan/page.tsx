// app/beginner/page.tsx

export default function BeginnerPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      {/* Hero */}
      <section className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-bold mb-3">
          Runway Tools – Beginner Plan
        </h1>
        <p className="text-zinc-300">
          Welcome! Your <span className="font-semibold">Beginner</span> plan is active.
          This page gives you access to all templates, calculators, and the AI
          included in this tier.
        </p>
      </section>

      <section className="max-w-4xl mx-auto space-y-10">

        {/* AI section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">AI Fashion Mentor Lite</h2>
          <p className="text-zinc-400 mb-4">
            Use the AI to ask questions about pricing, launching, content ideas,
            and basic brand strategy.
          </p>

          {/* TODO: change this button to the real AI link or embed */}
          <a
            href="https://your-ai-lite-link-here.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
          >
            Open AI Mentor Lite
          </a>

          {/* If later you want to EMBED the AI instead of link, you can use an iframe here */}
        </div>

        {/* Templates section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Templates & PDFs</h2>

          <p className="text-zinc-400 mb-4">
            Download your Beginner templates. You can host the real files on
            Whop, Google Drive, or inside the app and just update these links.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {/* Change hrefs to the real download URLs */}
            <a
              href="https://link-to-business-plan-template.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white">
                Business Plan Template
              </h3>
              <p className="text-xs text-zinc-400">
                Editable structure for your brand’s business plan.
              </p>
            </a>

            <a
              href="https://link-to-brand-identity-template.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white">
                Brand Identity Template
              </h3>
              <p className="text-xs text-zinc-400">
                Define your logo, colours, tone of voice, and positioning.
              </p>
            </a>

            <a
              href="https://link-to-size-chart-template.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white">
                Size Chart Template
              </h3>
              <p className="text-xs text-zinc-400">
                Create consistent sizing for your products.
              </p>
            </a>

            <a
              href="https://link-to-email-template.pdf"
              className="block group rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="font-semibold group-hover:text-white">
                Email Marketing Template
              </h3>
              <p className="text-xs text-zinc-400">
                Basic flows for welcome, drop launch and post-purchase emails.
              </p>
            </a>
          </div>
        </div>

        {/* Calculators section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Beginner Calculators</h2>
          <p className="text-zinc-400 mb-4">
            Quick tools to help you price products and understand basic numbers.
          </p>

          <div className="space-y-6">
            {/* Example 1: embed a calculator from a separate URL with iframe */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">
                Pricing Calculator
              </h3>
              <div className="aspect-[4/3] w-full rounded-xl border border-zinc-800 overflow-hidden bg-black">
                {/* Replace src with your real calculator URL (e.g. CodePen, your other app, etc.) */}
                <iframe
                  src="https://your-pricing-calculator-url-here.com"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Example 2: just link out to a calculator */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <h3 className="font-semibold text-sm">Simple Income Statement</h3>
                <p className="text-xs text-zinc-400">
                  Open the calculator in a new tab.
                </p>
              </div>
              <a
                href="https://your-income-statement-calculator-url.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-zinc-100 underline underline-offset-4"
              >
                Open
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

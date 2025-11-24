"use client";

import { useRouter } from "next/navigation";

export default function Plans() {
  const router = useRouter();

  const beginnerCheckout =
    "https://whop.com/checkout/plan_LTyeLxIoU6b0l";
  const proCheckout =
    "https://whop.com/checkout/plan_ni4U7dhxJpJPk";

  async function handlePaidPlanClick(
  plan: "beginner" | "pro",
  checkoutUrl: string
) {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    const data = await res.json();
    const next = encodeURIComponent(checkoutUrl);

    if (data.loggedIn) {
      // ✅ User already has an account → send to LOGIN
      router.push(`/login?plan=${plan}&next=${next}&reason=already_have_account`);
      return;
    }

    // ❌ Not logged in → send to SIGNUP
    router.push(`/signup?plan=${plan}&next=${next}`);
  } catch (e) {
    // If something breaks, be safe and send to signup
    const next = encodeURIComponent(checkoutUrl);
    router.push(`/signup?plan=${plan}&next=${next}`);
  }
}


  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Choose your plan
      </h1>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {/* 🧢 Free Plan */}
        <div className="border border-white/20 rounded-2xl p-8 bg-zinc-900 w-full">
          <h3 className="text-2xl font-semibold mb-2">
            🧢 Free Plan — 0 EGP
          </h3>
          <p className="text-white/70 mb-6">
            Perfect for: Anyone just starting their clothing brand.
          </p>

          <h4 className="text-lg font-semibold mb-3">Unlocks:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/80 mb-6">
            <li>✅ All templates & PDFs</li>
            <li>Business plan template</li>
            <li>Branding & brand-identity template</li>
            <li>Size-chart template</li>
            <li>Shopify product-description template</li>
            <li>Refund & exchange-policy template</li>
            <li>Email-marketing template</li>
            <li>Label & invoice template (Arabic / English)</li>
            <li>✅ AI Fashion Mentor Lite</li>
            <li>
              Chat with the AI for <strong>quick answers</strong>
            </li>
          </ul>

          {/* Free can go straight to tools – no signup required if you want */}
          <a
            href="/tools"
            className="block text-center bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue Free
          </a>
        </div>

        {/* 💼 Beginner Plan */}
        <div className="border border-yellow-400/40 rounded-2xl p-8 bg-zinc-900 w-full shadow-[0_0_25px_rgba(255,255,0,0.15)]">
          <h3 className="text-2xl font-semibold mb-2">
            💼 Beginner Plan — 250 EGP
          </h3>
          <p className="text-white/70 mb-6">
            Perfect for: Small Egyptian brands (selling 10–50 pcs / month)
            ready to manage operations professionally.
          </p>

          <h4 className="text-lg font-semibold mb-3">
            Includes everything in Free, plus:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/80 mb-6">
            <li>✅ All Calculators & Business Tools</li>
            <li>Pricing Calculator (EGP)</li>
            <li>Cash-Flow Tracker</li>
            <li>Break-Even & Profit Estimator</li>
            <li>Income-Statement Calculator</li>
            <li>ROAS / CPA Break-Even Calculator</li>
            <li>Returns / Exchange Cost Model</li>
            <li>Packaging Cost Builder</li>
            <li>✅ Production Planner + MOQ Optimizer</li>
          </ul>

          <button
            type="button"
            onClick={() => handlePaidPlanClick("beginner", beginnerCheckout)}
            className="block w-full text-center bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Get Beginner Plan
          </button>
        </div>

        {/* 👑 Pro Plan */}
        <div className="border border-purple-400/40 rounded-2xl p-8 bg-zinc-900 w-full shadow-[0_0_25px_rgba(168,85,247,0.15)]">
          <h3 className="text-2xl font-semibold mb-2">
            👑 Pro Plan — 300 EGP
          </h3>
          <p className="text-white/70 mb-6">
            Perfect for: Founders scaling up or running serious drops (50–200
            pcs / month).
          </p>

          <h4 className="text-lg font-semibold mb-3">
            Includes everything in Free + Beginner, plus:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/80 mb-6">
            <li>✅ Full AI Fashion Mentor (Advanced)</li>
            <li>Unlimited chat</li>
            <li>✅ Runway dashboard</li>
            <li>✅ Manufacturing Cost Tool</li>
           
          </ul>

          <button
            type="button"
            onClick={() => handlePaidPlanClick("pro", proCheckout)}
            className="block w-full text-center bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-400 transition"
          >
            Get Pro Plan
          </button>
        </div>
      </div>
    </main>
  );
}

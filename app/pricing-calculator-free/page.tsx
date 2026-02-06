"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PricingCalculatorFreePage() {
  useEffect(() => {
    // Currency symbols map
    const currencyMap: Record<string, string> = {
      EGP: "E£",
      USD: "$",
      EUR: "€",
      GBP: "£",
      SAR: "﷼",
      AED: "د.إ",
    };

    function setCurrencySymbol(code: string) {
      const sym = currencyMap[code] || "";
      document.documentElement.style.setProperty("--curSym", `"${sym}"`);
    }

    function val(id: string): number {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return 0;
      const v = parseFloat(el.value || "0");
      return isNaN(v) ? 0 : v;
    }

    function fmt(n: number): string {
      if (!isFinite(n)) n = 0;
      return Number(n).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    function compute() {
      const materials = val("materials");
      const labor = val("labor");
      const packaging = val("packaging");
      const inbound = val("inbound");
      const overhead = val("overhead");

      const marketing = val("marketing");
      const outbound = val("outbound");
      const feePct = val("feePct") / 100;
      const discountPct = val("discountPct") / 100;

      const cogs = materials + labor + packaging + inbound + overhead;
      const sellingCosts = outbound + marketing;
      const totalUnitCost = cogs + sellingCosts;

      const setText = (id: string, text: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      // Allowed in free: cost totals only
      setText("cogsTotal", fmt(cogs));
      setText("sellingTotal", fmt(sellingCosts));
      setText("totalCost", fmt(totalUnitCost));

      // Locked: everything decision + outcome
      [
        "netRevenue",
        "fees",
        "outCost",
        "prodCost",
        "sellCost",
        "totalUnitCostResult",
        "profit",
        "marginOut",
        "markupOut",
        "finalBefore",
        "finalAfter",
        "basePrice",
        "priceInclTax",
        // middle locks (optional hidden ids keep enforcement consistent)
        "locked_markup",
        "locked_margin",
        "locked_mode",
      ].forEach((id) => setText(id, "—"));

      void feePct;
      void discountPct;
    }

    function bind(id: string, fn: () => void) {
      const el = document.getElementById(id) as HTMLElement | null;
      if (!el) return;
      el.addEventListener("input", fn);
      el.addEventListener("change", fn);
    }

    const sel = document.getElementById("currencySelect") as HTMLSelectElement | null;
    if (!sel) return;

    setCurrencySymbol(sel.value);

    [
      "materials",
      "labor",
      "packaging",
      "inbound",
      "overhead",
      "marketing",
      "outbound",
      "feePct",
      "discountPct",
      "vatPct",
    ].forEach((id) => bind(id, compute));

    sel.addEventListener("change", () => {
      setCurrencySymbol(sel.value);
      compute();
    });

    compute();
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #0f1226;
          --card: #141834;
          --muted: #a4a9c8;
          --text: #e9ecff;
          --accent: #7c5cff;
          --accent2: #00d4ff;
          --border: rgba(255, 255, 255, 0.08);
          --radius: 16px;
          --curSym: "E£";
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 28px;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
            Helvetica, Arial;
          background:
            radial-gradient(1200px 800px at 0% 0%, #251b63 0%, transparent 60%),
            radial-gradient(1200px 800px at 100% 0%, #0b6c9a33 0%, transparent 60%),
            var(--bg);
          color: var(--text);
          line-height: 1.45;
        }
        h1 {
          margin: 0 0 8px 0;
          font-size: 26px;
        }
        .topbar {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          margin: 8px 0 18px 0;
          flex-wrap: wrap;
        }
        .currency {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(
            90deg,
            rgba(124, 92, 255, 0.15),
            rgba(0, 212, 255, 0.12)
          );
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .currency label {
          font-size: 14px;
          color: #cfd3ff;
        }
        select {
          background: #0e1230;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 8px 10px;
          min-width: 140px;
        }
        .grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }
        .card {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.01)
          );
          border-radius: var(--radius);
          padding: 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px var(--border);
          backdrop-filter: blur(4px);
          min-height: 420px;
          display: flex;
          flex-direction: column;
        }
        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: -4px 0 8px 0;
        }
        .title {
          font-weight: 700;
          letter-spacing: 0.2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .badge {
          font-size: 12px;
          color: #cfd3ff;
          border: 1px solid var(--border);
          padding: 2px 10px;
          border-radius: 999px;
          background: rgba(124, 92, 255, 0.12);
        }
        label {
          font-size: 14px;
          color: #cfd3ff;
        }
        input[type="number"] {
          width: 160px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: #0e1230;
          color: var(--text);
        }
        input[type="number"]:focus {
          border-color: #6f84ff;
          box-shadow: 0 0 0 3px rgba(127, 152, 255, 0.2);
        }
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 10px 0;
        }
        .section {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed var(--border);
        }
        .priceCard {
          background: linear-gradient(
            135deg,
            rgba(124, 92, 255, 0.25),
            rgba(0, 212, 255, 0.25)
          );
          border-radius: var(--radius);
          padding: 14px;
          margin-top: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px var(--border);
        }
        .priceRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 6px 0;
          font-size: 18px;
        }
        .priceValue {
          font-weight: 800;
        }
        .hint {
          margin-top: 8px;
          font-size: 12px;
          color: #cfd3ff;
          opacity: 0.85;
        }
        .money::before {
          content: var(--curSym) " ";
          font-variant-numeric: tabular-nums;
        }
        .lockedValue {
          font-weight: 800;
          opacity: 0.85;
        }

        /* NEW: static "radio pill" row like paid UI (but non-interactive) */
        .pillRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .pill {
          user-select: none;
          pointer-events: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.05);
          color: #cfd3ff;
          font-size: 13px;
        }
        .pillDot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.06);
        }

        .ctaWrap {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px dashed var(--border);
        }
        .ctaBtn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: linear-gradient(
            90deg,
            rgba(124, 92, 255, 0.25),
            rgba(0, 212, 255, 0.22)
          );
          color: var(--text);
          text-decoration: none;
          font-weight: 800;
        }
        .ctaBtn:hover {
          filter: brightness(1.1);
        }
      `}</style>

      <main>
        <h1>RunwayToRevenue – Fashion Pricing Calculator</h1>

        <div className="topbar">
          <div className="currency">
            <label htmlFor="currencySelect">Currency</label>
            <select id="currencySelect" title="Choose currency">
              <option value="EGP" defaultValue="EGP">
                EGP – Egyptian Pound (E£)
              </option>
              <option value="USD">USD – US Dollar ($)</option>
              <option value="EUR">EUR – Euro (€)</option>
              <option value="GBP">GBP – British Pound (£)</option>
              <option value="SAR">SAR – Saudi Riyal (﷼)</option>
              <option value="AED">AED – UAE Dirham (د.إ)</option>
            </select>
            <span className="badge">Symbol updates instantly</span>
          </div>
        </div>

        <div className="grid">
          {/* LEFT — Costs (keep editable + totals visible + warning text) */}
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">Unit Costs</h3>
              <span className="badge">Production (COGS)</span>
            </div>

            <div className="row">
              <label>Materials</label>
              <input id="materials" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>Labor / Manufacturing</label>
              <input id="labor" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>Packaging</label>
              <input id="packaging" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>Inbound Shipping (to you)</label>
              <input id="inbound" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>Allocated Overhead (per unit)</label>
              <input id="overhead" type="number" step="0.01" defaultValue={0} />
            </div>

            <div className="row">
              <label>Total COGS</label>
              <span id="cogsTotal" className="money">
                0.00
              </span>
            </div>
            <div className="hint">
              This is your real cost base. Pricing decisions are locked in the full decision view.
            </div>

            <div className="section">
              <div className="cardHeader">
                <h3 className="title">Unit Costs</h3>
                <span className="badge">Selling Costs</span>
              </div>

              <div className="row">
                <label>Outbound Shipping</label>
                <input id="outbound" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="row">
                <label>Marketing per Unit</label>
                <input id="marketing" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="row">
                <label>Platform/Processor Fee %</label>
                <input id="feePct" type="number" step="0.01" defaultValue={3.29} />
              </div>
              <div className="row">
                <label>Expected Discount %</label>
                <input id="discountPct" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="row">
                <label>VAT/Sales Tax %</label>
                <input id="vatPct" type="number" step="0.01" defaultValue={0} />
              </div>

              <div className="row">
                <label>Total Selling Costs</label>
                <span id="sellingTotal" className="money">
                  0.00
                </span>
              </div>
              <div className="hint">
                Fees/discount/VAT affect the final price decision. That part is locked.
              </div>
            </div>

            <div className="priceCard">
              <div className="priceRow">
                <span>Total Unit Cost (COGS + Selling)</span>
                <span className="priceValue money" id="totalCost">
                  0.00
                </span>
              </div>
              <div className="hint">You can trust this number. Everything else is a decision layer.</div>
            </div>
          </div>

          {/* MIDDLE — Target (same UI rhythm as paid, but locked like Results) */}
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">Target</h3>
              <span className="badge">Locked</span>
            </div>

            <div className="row">
              <label>Markup %</label>
              <span id="locked_markup" className="lockedValue">
                —
              </span>
            </div>

            <div className="row">
              <label>Margin %</label>
              <span id="locked_margin" className="lockedValue">
                —
              </span>
            </div>

            <div className="section">
              <div className="row" style={{ marginBottom: 6 }}>
                <label>Pricing Mode</label>
                <span id="locked_mode" className="lockedValue">
                  —
                </span>
              </div>

              {/* Static pills to match paid radio UI (non-interactive) */}
              <div className="pillRow">
                <div className="pill">
                  <span className="pillDot" />
                  Markup on <strong>COGS + Outbound</strong>
                </div>
                <div className="pill">
                  <span className="pillDot" />
                  Markup on <strong>All-in Cost</strong>
                </div>
              </div>

              <div className="hint">
                Targets and pricing logic are locked in the full decision view.
              </div>
            </div>

            <div className="priceCard">
              <div className="priceRow">
                <span>Base Price (pre-tax)</span>
                <span className="priceValue lockedValue" id="basePrice">
                  —
                </span>
              </div>
              <div className="priceRow">
                <span>Price incl. VAT</span>
                <span className="priceValue lockedValue" id="priceInclTax">
                  —
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Results (labels visible, values are —, CTA at bottom) */}
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">Results</h3>
              <span className="badge">Locked</span>
            </div>

            <div className="row">
              <label>Revenue (after discounts)</label>
              <span id="netRevenue" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Payment/Platform Fees</label>
              <span id="fees" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Outbound Shipping</label>
              <span id="outCost" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Production Costs (COGS)</label>
              <span id="prodCost" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Selling Costs</label>
              <span id="sellCost" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Total Unit Cost</label>
              <span id="totalUnitCostResult" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Profit</label>
              <span id="profit" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Profit Margin %</label>
              <span id="marginOut" className="lockedValue">
                —
              </span>
            </div>
            <div className="row">
              <label>Markup %</label>
              <span id="markupOut" className="lockedValue">
                —
              </span>
            </div>
            <div className="section">
              <div className="row">
                <label>Final Price (Before VAT)</label>
                <span id="finalBefore" className="lockedValue">
                  —
                </span>
              </div>
              <div className="row">
                <label>Final Price (After VAT)</label>
                <span id="finalAfter" className="lockedValue">
                  —
                </span>
              </div>
            </div>

            <div className="ctaWrap">
              <Link className="ctaBtn" href="/plans">
                Unlock full decision view
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

"use client";

import { useState } from "react";

export default function BreakEvenPage() {
  const [price, setPrice] = useState(0);
  const [variable, setVariable] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [unitsPlanned, setUnitsPlanned] = useState(0);
  const [targetProfit, setTargetProfit] = useState(0);

  const SYMBOL = "E£";

  function money(n: number) {
    if (!isFinite(n)) n = 0;
    return (
      SYMBOL +
      Number(n).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  const margin = price - variable;
  const hasMargin = margin > 0;
  const showWarning = (price > 0 || variable > 0) && !hasMargin;

  // Break-even
  const beUnits = hasMargin ? fixed / margin : 0;
  const beRevenue = beUnits * price;

  // Profit at planned units
  const revenue = price * unitsPlanned;
  const varTotal = variable * unitsPlanned;
  const profit = revenue - varTotal - fixed;

  // Target profit
  const tpUnits = targetProfit > 0 && hasMargin ? (fixed + targetProfit) / margin : 0;
  const tpRevenue = tpUnits * price;

  const profitClass =
    profit > 0 ? "summaryValue good" : profit < 0 ? "summaryValue bad" : "summaryValue";

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
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 28px;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica,
            Arial;
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
        .sub {
          color: var(--muted);
          margin-top: 0;
          max-width: 720px;
        }
        .grid {
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
        .card {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
          border-radius: var(--radius);
          padding: 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 0 0 1px var(--border);
          backdrop-filter: blur(4px);
        }
        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: -4px 0 14px 0;
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
          display: block;
          font-size: 13px;
          color: #cfd3ff;
          margin-bottom: 4px;
        }
        input[type="number"] {
          width: 100%;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #0e1230;
          color: var(--text);
          font-size: 13px;
          outline: none;
        }
        input[type="number"]:focus {
          border-color: #6f84ff;
          box-shadow: 0 0 0 3px rgba(127, 152, 255, 0.2);
        }
        .muted {
          color: var(--muted);
          font-size: 12px;
        }
        .twoCol {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
        }
        .sectionTitle {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--muted);
          margin: 10px 0 6px 0;
        }
        .smallNote {
          font-size: 11px;
          color: #a7acd4;
          margin-top: 6px;
        }
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 6px 0;
          font-size: 13px;
        }
        .row span {
          font-size: 13px;
        }
        .divider {
          border-top: 1px solid var(--border);
          margin: 10px 0;
          padding-top: 10px;
        }
        .summaryLabel {
          color: #cfd3ff;
        }
        .summaryValue {
          font-weight: 600;
        }
        .summaryValue.good {
          color: #aef7d0;
        }
        .summaryValue.bad {
          color: #ffb3b3;
        }
        .pill {
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          border: 1px solid var(--border);
          background: rgba(39, 217, 128, 0.12);
          color: #aef7d0;
        }
        .warning {
          margin-top: 10px;
          border-radius: 10px;
          border: 1px solid rgba(248, 113, 113, 0.6);
          background: rgba(127, 29, 29, 0.55);
          padding: 8px 10px;
          font-size: 11px;
          color: #fee2e2;
        }
      `}</style>

      <main>
        <h1>RunwayToRevenue – Break-Even &amp; Profit Estimator</h1>
        <p className="sub">
          See how many units you need to sell to cover your costs and hit a profit target. Use the
          same numbers you use in your pricing and bookkeeping tools.
        </p>

        <div className="grid">
          {/* LEFT: Inputs */}
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">Inputs</h3>
              <span className="badge">Your assumptions</span>
            </div>

            <div className="twoCol">
              <div>
                <label htmlFor="price">Selling price per unit</label>
                <input
                  type="number"
                  id="price"
                  placeholder="Ex: 700"
                  step="0.01"
                  value={price || ""}
                  onChange={(e) => setPrice(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">The price your customer pays for one piece.</p>
              </div>

              <div>
                <label htmlFor="variable">Variable cost per unit</label>
                <input
                  type="number"
                  id="variable"
                  placeholder="Ex: 250"
                  step="0.01"
                  value={variable || ""}
                  onChange={(e) => setVariable(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">
                  All costs that move with each unit: fabric, cut &amp; sew, packaging,
                  shipping-to-customer, etc.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label htmlFor="fixed">Fixed costs for the period</label>
              <input
                type="number"
                id="fixed"
                placeholder="Ex: 10000"
                step="0.01"
                value={fixed || ""}
                onChange={(e) => setFixed(parseFloat(e.target.value || "0"))}
              />
              <p className="smallNote">
                Costs you pay even if you sell 0 units (rent, apps, salaries, etc.) for this month
                or collection.
              </p>
            </div>

            <div className="twoCol" style={{ marginTop: 10 }}>
              <div>
                <label htmlFor="unitsPlanned">Units you plan to sell</label>
                <input
                  type="number"
                  id="unitsPlanned"
                  placeholder="Ex: 120"
                  step="1"
                  value={unitsPlanned || ""}
                  onChange={(e) => setUnitsPlanned(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">We&apos;ll show you the profit if you hit this number.</p>
              </div>

              <div>
                <label htmlFor="targetProfit">Target profit (optional)</label>
                <input
                  type="number"
                  id="targetProfit"
                  placeholder="Ex: 20000"
                  step="0.01"
                  value={targetProfit || ""}
                  onChange={(e) => setTargetProfit(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">
                  How much money you want to make after all costs.
                </p>
              </div>
            </div>

            {showWarning && (
              <div id="warningBox" className="warning">
                Your variable cost is higher than or equal to your price. Increase price or reduce
                cost per unit – otherwise you will never break even.
              </div>
            )}
          </div>

          {/* RIGHT: Results */}
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">Results</h3>
              <span className="pill">Live</span>
            </div>

            <div className="row">
              <span className="summaryLabel">Contribution margin / unit</span>
              <span className="summaryValue" id="marginOut">
                {money(margin)}
              </span>
            </div>

            <div className="divider">
              <p className="sectionTitle" style={{ marginTop: 0 }}>
                Break-even
              </p>
              <div className="row">
                <span className="summaryLabel">Units to break even</span>
                <span className="summaryValue" id="beUnitsOut">
                  {hasMargin ? Math.ceil(beUnits).toString() : "—"}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">Revenue at break even</span>
                <span className="summaryValue" id="beRevenueOut">
                  {hasMargin ? money(beRevenue) : "—"}
                </span>
              </div>
            </div>

            <div className="divider">
              <p className="sectionTitle" style={{ marginTop: 0 }}>
                Profit at planned units
              </p>
              <div className="row">
                <span className="summaryLabel">Revenue</span>
                <span className="summaryValue" id="revOut">
                  {money(revenue)}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">Total variable costs</span>
                <span className="summaryValue" id="varOut">
                  {money(varTotal)}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">Fixed costs</span>
                <span className="summaryValue" id="fixOut">
                  {money(fixed)}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">Profit</span>
                <span className={profitClass} id="profitOut">
                  {money(profit)}
                </span>
              </div>
            </div>

            <div className="divider">
              <p className="sectionTitle" style={{ marginTop: 0 }}>
                Target profit
              </p>
              <div className="row">
                <span className="summaryLabel">Units for target profit</span>
                <span className="summaryValue" id="tpUnitsOut">
                  {targetProfit > 0 && hasMargin ? Math.ceil(tpUnits).toString() : "—"}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">Revenue for target profit</span>
                <span className="summaryValue" id="tpRevenueOut">
                  {targetProfit > 0 && hasMargin ? money(tpRevenue) : "—"}
                </span>
              </div>
            </div>

            <p className="smallNote" style={{ marginTop: 10 }}>
              Tip: use your <strong>Manufacturing Cost Tool</strong> + shipping-to-customer to get
              your real variable cost per unit. Fixed costs are things like rent, apps, salaries and
              content costs for this period.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

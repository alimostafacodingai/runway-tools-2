"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProductionPlannerFreePage() {
  useEffect(() => {
    const SYMBOL: Record<string, string> = {
      EGP: "E£",
      USD: "$",
      EUR: "€",
      GBP: "£",
      AED: "د.إ",
      SAR: "﷼",
    };

    let curr = "EGP";

    function num(id: string): number {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return 0;
      const v = parseFloat(el.value);
      return isNaN(v) ? 0 : v;
    }

    function nfmt(x: number): string {
      if (!isFinite(x)) x = 0;
      return Number(x).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }

    function money(x: number): string {
      if (!isFinite(x)) x = 0;
      return (SYMBOL[curr] || curr) + Number(x).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    function setText(id: string, val: string) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    function setHTML(id: string, val: string) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = val;
    }

    function compute() {
      const unitCost = Math.max(0, num("unitCost"));
      const moqPerStyle = Math.max(0, num("moqPerStyle"));
      const styles = Math.max(0, num("styles"));
      const demandUnits = Math.max(0, num("demandUnits"));
      const safetyPct = Math.max(0, num("safetyPct"));
      const budget = Math.max(0, num("budget"));
      const leadTime = Math.max(0, num("leadTime"));

      const totalMOQUnits = moqPerStyle * styles;
      const demandWithSafety = demandUnits * (1 + safetyPct / 100);

      // Budget capacity in units (visibility, not recommendation)
      let budgetMaxUnits = Infinity;
      if (budget > 0 && unitCost > 0) {
        budgetMaxUnits = Math.floor(budget / unitCost);
      }

      // We KEEP total production cost in Free (value prop),
      // but we DO NOT show recommendations/plans.
      const floorUnits = Math.max(totalMOQUnits || 0, demandWithSafety || 0);
      const effectiveUnits =
        budgetMaxUnits === Infinity ? floorUnits : Math.min(floorUnits, budgetMaxUnits);

      const totalCost = effectiveUnits * unitCost;

      // LEFT + shared visibility outputs
      setText("totalMOQUnitsOut", nfmt(totalMOQUnits));
      setText("demandWithSafetyOut", nfmt(demandWithSafety));
      setText("leadTimeOut", leadTime > 0 ? `${leadTime} weeks` : "Not set");
      setText("totalCostOut", money(totalCost));

      // Conflicts (YES, show them in Free)
      const conflicts: string[] = [];

      // Demand vs MOQ
      if (totalMOQUnits > 0 && demandWithSafety > 0) {
        if (demandWithSafety > totalMOQUnits) {
          conflicts.push(
            `Demand + safety is <strong>${nfmt(demandWithSafety)}</strong> units, but MOQ floor is <strong>${nfmt(
              totalMOQUnits
            )}</strong>.`
          );
        } else if (totalMOQUnits > demandWithSafety) {
          conflicts.push(
            `MOQ forces <strong>${nfmt(totalMOQUnits)}</strong> units, but demand + safety is <strong>${nfmt(
              demandWithSafety
            )}</strong>.`
          );
        }
      }

      // Budget conflicts
      if (budgetMaxUnits !== Infinity) {
        if (totalMOQUnits > 0 && budgetMaxUnits < totalMOQUnits) {
          conflicts.push(
            `Budget caps below MOQ: budget allows <strong>${nfmt(
              budgetMaxUnits
            )}</strong> units, but MOQ needs <strong>${nfmt(totalMOQUnits)}</strong>.`
          );
        }
        if (demandWithSafety > 0 && budgetMaxUnits < demandWithSafety) {
          conflicts.push(
            `Budget caps below demand + safety: budget allows <strong>${nfmt(
              budgetMaxUnits
            )}</strong> units, but demand + safety is <strong>${nfmt(
              demandWithSafety
            )}</strong>.`
          );
        }
      }

      // Input completeness nudges
      if (styles === 0 && moqPerStyle > 0) {
        conflicts.push(`Set <strong>Number of styles</strong> to calculate total MOQ units.`);
      }
      if (unitCost <= 0 && budget > 0) {
        conflicts.push(`Set <strong>Unit manufacturing cost</strong> to translate budget into units.`);
      }

      if (conflicts.length === 0) {
        setHTML(
          "conflictsOut",
          `<span style="opacity:.85;">No conflicts detected from your current constraints.</span>`
        );
      } else {
        setHTML(
          "conflictsOut",
          `<ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;">
            ${conflicts.map((c) => `<li>${c}</li>`).join("")}
          </ul>`
        );
      }

      // LOCKED OUTPUTS (right panel should show dashes like paid layout)
      setText("baseRecommendedOut", "—");
      setText("plannedUnitsOut", "—");
      setText("plannedPerStyleOut", "—");
      setText("budgetUsageOut", "—");
      setText("driverOut", "—");
    }

    const inputIds = [
      "unitCost",
      "moqPerStyle",
      "styles",
      "demandUnits",
      "safetyPct",
      "budget",
      "leadTime",
    ];

    const listeners: { el: HTMLInputElement; handler: () => void }[] = [];

    inputIds.forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      const handler = () => compute();
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
      listeners.push({ el, handler });
    });

    const currSel = document.getElementById("currency") as HTMLSelectElement | null;
    const currHandler = () => {
      if (!currSel) return;
      curr = currSel.value;
      compute();
    };
    if (currSel) currSel.addEventListener("change", currHandler);

    compute();

    return () => {
      listeners.forEach(({ el, handler }) => {
        el.removeEventListener("input", handler);
        el.removeEventListener("change", handler);
      });
      if (currSel) currSel.removeEventListener("change", currHandler);
    };
  }, []);

  const styles = `
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

    * { box-sizing: border-box; }

    .prod-root {
      min-height: 100vh;
      width: 100vw;
      margin: 0;
      padding: 28px 28px 40px;
      background:
        radial-gradient(1200px 800px at 0% 0%, #251b63 0%, transparent 60%),
        radial-gradient(1200px 800px at 100% 0%, #0b6c9a33 0%, transparent 60%),
        var(--bg);
      line-height: 1.45;
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif;
      overflow-x: hidden;
    }

    .prod-root h1 { margin: 0 0 8px 0; font-size: 26px; }
    .sub { color: var(--muted); margin: 6px 0 18px 0; max-width: 780px; }

    .toolbar {
      display: flex;
      gap: 12px;
      align-items: center;
      margin: 8px 0 18px 0;
      flex-wrap: wrap;
    }

    .toolbar select {
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: #0e1230;
      color: #e9ecff;
      font-size: 13px;
    }

    .muted { color: var(--muted); font-size: 12px; }

    .grid {
      display: grid;
      gap: 18px;
      grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }

    .card {
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
      border-radius: var(--radius);
      padding: 18px;
      box-shadow: none;
      backdrop-filter: blur(4px);
    }

    .cardHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: -4px 0 12px 0;
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

    label { display:block; font-size: 13px; color: #cfd3ff; margin-bottom: 4px; }

    input[type="number"] {
      width: 100%;
      max-width: 170px;
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
      box-shadow: 0 0 0 3px rgba(127,152,255,0.2);
    }

    .smallNote { font-size: 11px; color: #a7acd4; margin-top: 4px; }

    .sectionTitle {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #9fa4d6;
      margin: 10px 0 6px 0;
    }

    .divider {
      border-top: 1px solid var(--border);
      margin: 10px 0;
      padding-top: 8px;
    }

    .twoCol {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
    }

    .row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin: 8px 0;
      font-size: 13px;
    }

    .summaryLabel { color: #cfd3ff; }
    .summaryValue { font-weight: 600; }

    .priceCard {
      background: linear-gradient(135deg, rgba(124, 92, 255, 0.25), rgba(0, 212, 255, 0.25));
      border-radius: var(--radius);
      padding: 14px;
      margin-top: 10px;
      box-shadow: none;
    }

    .priceRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 4px 0;
      font-size: 16px;
    }

    .priceValue { font-weight: 800; }

    .explain {
      font-size: 12px;
      color: #cfd3ff;
      background: rgba(255,255,255,0.05);
      padding: 10px;
      border-radius: 12px;
      margin-top: 10px;
      line-height: 1.5;
    }

    .lockLine {
      margin-top: 10px;
      font-size: 12px;
      color: #cfd3ff;
      opacity: 0.85;
    }

    .ctaWrap { margin-top: 12px; }

    .ctaBtn {
      display: block;
      width: 100%;
      text-align: center;
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: linear-gradient(90deg, rgba(124,92,255,0.25), rgba(0,212,255,0.22));
      color: var(--text);
      text-decoration: none;
      font-weight: 800;
    }

    .ctaBtn:hover { filter: brightness(1.1); }
  `;

  return (
    <div className="prod-root">
      <h1>RunwayToRevenue – Production Planner &amp; MOQ Optimizer</h1>

      <div className="toolbar">
        <label htmlFor="currency">Currency</label>
        <select id="currency" defaultValue="EGP">
          <option value="EGP">EGP – Egyptian Pound</option>
          <option value="USD">USD – US Dollar</option>
          <option value="EUR">EUR – Euro</option>
          <option value="GBP">GBP – British Pound</option>
          <option value="AED">AED – UAE Dirham</option>
          <option value="SAR">SAR – Saudi Riyal</option>
        </select>
        <span className="muted">
          Use the same currency you use in your manufacturing &amp; pricing tools.
        </span>
      </div>

      <p className="sub">
        Plug in your constraints and see MOQ + demand visibility, total production cost, and where
        your inputs conflict. Final planning and allocations unlock in the full decision view.
      </p>

      <div className="grid">
        {/* LEFT – Inputs (KEEP ALL) */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">Production Inputs</h3>
            <span className="badge">Per launch / collection</span>
          </div>

          <div className="twoCol">
            <div>
              <label htmlFor="unitCost">Unit manufacturing cost</label>
              <input id="unitCost" type="number" step="0.01" defaultValue={0} />
              <p className="smallNote">
                Full landed cost per unit (fabric, cut &amp; sew, trims, packaging, etc.).
              </p>
            </div>
            <div>
              <label htmlFor="styles">Number of styles / colourways</label>
              <input id="styles" type="number" step={1} defaultValue={1} />
              <p className="smallNote">Total distinct products in this drop.</p>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">MOQ from manufacturer</p>
            <div className="twoCol">
              <div>
                <label htmlFor="moqPerStyle">MOQ per style (units)</label>
                <input id="moqPerStyle" type="number" step={1} defaultValue={0} />
                <p className="smallNote">For example: 50 pcs per style, or 80 pcs per colourway.</p>
              </div>
              <div>
                <label>Calculated total MOQ units</label>
                <p className="smallNote">
                  <span id="totalMOQUnitsOut">0</span> units minimum across all styles.
                </p>
              </div>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">Demand &amp; safety stock</p>
            <div className="twoCol">
              <div>
                <label htmlFor="demandUnits">Expected units sold for this drop</label>
                <input id="demandUnits" type="number" step={1} defaultValue={0} />
                <p className="smallNote">Your best estimate of total units you can sell.</p>
              </div>
              <div>
                <label htmlFor="safetyPct">Safety stock (%)</label>
                <input id="safetyPct" type="number" step={1} defaultValue={20} />
                <p className="smallNote">Extra buffer above demand (e.g. 20% = demand × 1.2).</p>
              </div>
            </div>

            <p className="smallNote" style={{ marginTop: 6 }}>
              Demand with safety: <strong id="demandWithSafetyOut">0</strong> units.
            </p>
          </div>

          <div className="divider">
            <p className="sectionTitle">Budget &amp; timing (optional)</p>
            <div className="twoCol">
              <div>
                <label htmlFor="budget">Max production budget</label>
                <input id="budget" type="number" step="0.01" defaultValue={0} />
                <p className="smallNote">Leave as 0 if you don&apos;t want the budget to cap anything.</p>
              </div>
              <div>
                <label htmlFor="leadTime">Production lead time (weeks)</label>
                <input id="leadTime" type="number" step={1} defaultValue={0} />
                <p className="smallNote">For example: 6–8 weeks from deposit to finished goods.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT – Results (MATCH PAID LAYOUT, LOCK VALUES AS —) */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">Plan &amp; MOQ Optimization</h3>
            <span className="badge">Free</span>
          </div>

          <p className="sectionTitle" style={{ marginTop: 0 }}>
            Recommended quantities
          </p>

          <div className="row">
            <span className="summaryLabel">Base recommendation (MOQ vs demand)</span>
            <span className="summaryValue" id="baseRecommendedOut">—</span>
          </div>

          <div className="priceCard">
            <div className="priceRow">
              <span>Final planned units</span>
              <span className="priceValue" id="plannedUnitsOut">—</span>
            </div>
            <div className="priceRow">
              <span>Planned units per style (avg)</span>
              <span className="priceValue" id="plannedPerStyleOut">—</span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              Cost &amp; budget
            </p>
            <div className="row">
              <span className="summaryLabel">Total production cost</span>
              <span className="summaryValue" id="totalCostOut">E£0.00</span>
            </div>
            <div className="row">
              <span className="summaryLabel">Budget usage</span>
              <span className="summaryValue" id="budgetUsageOut">—</span>
            </div>
            <div className="row">
              <span className="summaryLabel">Lead time</span>
              <span className="summaryValue" id="leadTimeOut">Not set</span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              Conflicts between constraints
            </p>
            <div className="explain" id="conflictsOut">
              <span style={{ opacity: 0.85 }}>No conflicts detected from your current constraints.</span>
            </div>

            <p className="lockLine">
              Final planned units, per-style splits, and recommendations unlock in the full decision view.
            </p>
          </div>

          <div className="explain">
            <p><strong>What&apos;s driving this plan?</strong></p>
            <p id="driverOut">—</p>
            <p style={{ marginTop: 6 }}>
              Use the <strong>final planned units</strong> and <strong>units per style</strong> when talking to your
              manufacturer, and make sure the plan still respects size curves and colourway splits.
            </p>
          </div>

          <div className="ctaWrap">
            <Link className="ctaBtn" href="/plans">
              Unlock full decision view
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function ProductionPlannerFreePage() {
  const t = useTranslations("productionPlannerFreePage");
  const locale = useLocale();

  const href = (path: string) => `/${locale}${path}`;

  useEffect(() => {
    const SYMBOL: Record<string, string> = {
      EGP: "EÂ£",
      USD: "$",
      EUR: "€",
      GBP: "Â£",
      AED: "AED ",
      SAR: "SAR ",
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

      let budgetMaxUnits = Infinity;
      if (budget > 0 && unitCost > 0) {
        budgetMaxUnits = Math.floor(budget / unitCost);
      }

      const floorUnits = Math.max(totalMOQUnits || 0, demandWithSafety || 0);
      const effectiveUnits =
        budgetMaxUnits === Infinity ? floorUnits : Math.min(floorUnits, budgetMaxUnits);

      const totalCost = effectiveUnits * unitCost;

      setText("totalMOQUnitsOut", nfmt(totalMOQUnits));
      setText("demandWithSafetyOut", nfmt(demandWithSafety));
      setText("leadTimeOut", leadTime > 0 ? t("results.leadTime", { weeks: leadTime }) : t("results.leadTimeNotSet"));
      setText("totalCostOut", money(totalCost));

      const conflicts: string[] = [];

      if (totalMOQUnits > 0 && demandWithSafety > 0) {
        if (demandWithSafety > totalMOQUnits) {
          conflicts.push(
            t("conflicts.demandHigher", {
              demand: nfmt(demandWithSafety),
              moq: nfmt(totalMOQUnits),
            })
          );
        } else if (totalMOQUnits > demandWithSafety) {
          conflicts.push(
            t("conflicts.moqHigher", {
              moq: nfmt(totalMOQUnits),
              demand: nfmt(demandWithSafety),
            })
          );
        }
      }

      if (budgetMaxUnits !== Infinity) {
        if (totalMOQUnits > 0 && budgetMaxUnits < totalMOQUnits) {
          conflicts.push(
            t("conflicts.budgetMoq", {
              budget: nfmt(budgetMaxUnits),
              moq: nfmt(totalMOQUnits),
            })
          );
        }
        if (demandWithSafety > 0 && budgetMaxUnits < demandWithSafety) {
          conflicts.push(
            t("conflicts.budgetDemand", {
              budget: nfmt(budgetMaxUnits),
              demand: nfmt(demandWithSafety),
            })
          );
        }
      }

      if (styles === 0 && moqPerStyle > 0) {
        conflicts.push(t("conflicts.needStyles"));
      }
      if (unitCost <= 0 && budget > 0) {
        conflicts.push(t("conflicts.needUnitCost"));
      }

      if (conflicts.length === 0) {
        setHTML("conflictsOut", `<span style="opacity:.85;">${t("conflicts.none")}</span>`);
      } else {
        setHTML(
          "conflictsOut",
          `<ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;">
            ${conflicts.map((c) => `<li>${c}</li>`).join("")}
          </ul>`
        );
      }

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
  }, [t]);

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
      <h1>{t("title")}</h1>

      <div className="toolbar">
        <label htmlFor="currency">{t("currency.label")}</label>
        <select id="currency" defaultValue="EGP">
          <option value="EGP">{t("currency.egp")}</option>
          <option value="USD">{t("currency.usd")}</option>
          <option value="EUR">{t("currency.eur")}</option>
          <option value="GBP">{t("currency.gbp")}</option>
          <option value="AED">{t("currency.aed")}</option>
          <option value="SAR">{t("currency.sar")}</option>
        </select>
        <span className="muted">{t("currency.hint")}</span>
      </div>

      <p className="sub">{t("subtitle")}</p>

      <div className="grid">
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">{t("inputs.title")}</h3>
            <span className="badge">{t("inputs.badge")}</span>
          </div>

          <div className="twoCol">
            <div>
              <label htmlFor="unitCost">{t("inputs.unitCost.label")}</label>
              <input id="unitCost" type="number" step="0.01" defaultValue={0} />
              <p className="smallNote">{t("inputs.unitCost.note")}</p>
            </div>
            <div>
              <label htmlFor="styles">{t("inputs.styles.label")}</label>
              <input id="styles" type="number" step={1} defaultValue={1} />
              <p className="smallNote">{t("inputs.styles.note")}</p>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("moq.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="moqPerStyle">{t("moq.label")}</label>
                <input id="moqPerStyle" type="number" step={1} defaultValue={0} />
                <p className="smallNote">{t("moq.note")}</p>
              </div>
              <div>
                <label>{t("moq.totalLabel")}</label>
                <p className="smallNote">
                  <span id="totalMOQUnitsOut">0</span> {t("moq.totalNote")}
                </p>
              </div>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("demand.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="demandUnits">{t("demand.units")}</label>
                <input id="demandUnits" type="number" step={1} defaultValue={0} />
                <p className="smallNote">{t("demand.unitsNote")}</p>
              </div>
              <div>
                <label htmlFor="safetyPct">{t("demand.safety")}</label>
                <input id="safetyPct" type="number" step={1} defaultValue={20} />
                <p className="smallNote">{t("demand.safetyNote")}</p>
              </div>
            </div>

            <p className="smallNote" style={{ marginTop: 6 }}>
              {t("demand.withSafety")} <strong id="demandWithSafetyOut">0</strong> {t("demand.unitsLabel")}
            </p>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("budget.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="budget">{t("budget.max")}</label>
                <input id="budget" type="number" step="0.01" defaultValue={0} />
                <p className="smallNote">{t("budget.maxNote")}</p>
              </div>
              <div>
                <label htmlFor="leadTime">{t("budget.lead")}</label>
                <input id="leadTime" type="number" step={1} defaultValue={0} />
                <p className="smallNote">{t("budget.leadNote")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="title">{t("results.title")}</h3>
            <span className="badge">{t("results.badge")}</span>
          </div>

          <p className="sectionTitle" style={{ marginTop: 0 }}>
            {t("results.recommended")}
          </p>

          <div className="row">
            <span className="summaryLabel">{t("results.base")}</span>
            <span className="summaryValue" id="baseRecommendedOut">—</span>
          </div>

          <div className="priceCard">
            <div className="priceRow">
              <span>{t("results.plannedUnits")}</span>
              <span className="priceValue" id="plannedUnitsOut">—</span>
            </div>
            <div className="priceRow">
              <span>{t("results.perStyle")}</span>
              <span className="priceValue" id="plannedPerStyleOut">—</span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              {t("results.costTitle")}
            </p>
            <div className="row">
              <span className="summaryLabel">{t("results.totalCost")}</span>
              <span className="summaryValue" id="totalCostOut">EÂ£0.00</span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.budgetUsageLabel")}</span>
              <span className="summaryValue" id="budgetUsageOut">—</span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.leadTimeLabel")}</span>
              <span className="summaryValue" id="leadTimeOut">{t("results.leadTimeNotSet")}</span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              {t("conflicts.title")}
            </p>
            <div className="explain" id="conflictsOut">
              <span style={{ opacity: 0.85 }}>{t("conflicts.none")}</span>
            </div>

            <p className="lockLine">
              {t("results.lockLine")}
            </p>
          </div>

          <div className="explain">
            <p><strong>{t("driver.title")}</strong></p>
            <p id="driverOut">—</p>
            <p style={{ marginTop: 6 }}>{t("driver.note")}</p>
          </div>

          <div className="ctaWrap">
            <Link className="ctaBtn" href={href("/plans")}>
              {t("results.cta")}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}


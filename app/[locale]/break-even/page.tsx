"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function BreakEvenPage() {
  const t = useTranslations("breakEvenPage");

  const [price, setPrice] = useState(0);
  const [variable, setVariable] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [unitsPlanned, setUnitsPlanned] = useState(0);
  const [targetProfit, setTargetProfit] = useState(0);

  const CURRENCIES = {
    EGP: { symbol: "EÂ£", label: t("currency.egp") },
    USD: { symbol: "$", label: t("currency.usd") },
    EUR: { symbol: "€", label: t("currency.eur") },
    GBP: { symbol: "Â£", label: t("currency.gbp") },
    SAR: { symbol: "SAR ", label: t("currency.sar") },
    AED: { symbol: "AED ", label: t("currency.aed") },
  } as const;

  const [currency, setCurrency] = useState<keyof typeof CURRENCIES>("EGP");
  const SYMBOL = CURRENCIES[currency].symbol;

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

  const beUnits = hasMargin ? fixed / margin : 0;
  const beRevenue = beUnits * price;

  const revenue = price * unitsPlanned;
  const varTotal = variable * unitsPlanned;
  const profit = revenue - varTotal - fixed;

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

        .headerRight {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .currencySelect {
          height: 28px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #0e1230;
          color: #e9ecff;
          font-size: 12px;
          outline: none;
          cursor: pointer;
        }
        .currencySelect:focus {
          border-color: #6f84ff;
          box-shadow: 0 0 0 3px rgba(127, 152, 255, 0.2);
        }
      `}</style>

      <main>
        <h1>{t("title")}</h1>
        <p className="sub">{t("subtitle")}</p>

        <div className="grid">
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("inputs.title")}</h3>
              <span className="badge">{t("inputs.badge")}</span>
            </div>

            <div className="twoCol">
              <div>
                <label htmlFor="price">{t("inputs.price.label")}</label>
                <input
                  type="number"
                  id="price"
                  placeholder={t("inputs.price.placeholder")}
                  step="0.01"
                  value={price || ""}
                  onChange={(e) => setPrice(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">{t("inputs.price.note")}</p>
              </div>

              <div>
                <label htmlFor="variable">{t("inputs.variable.label")}</label>
                <input
                  type="number"
                  id="variable"
                  placeholder={t("inputs.variable.placeholder")}
                  step="0.01"
                  value={variable || ""}
                  onChange={(e) => setVariable(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">{t("inputs.variable.note")}</p>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label htmlFor="fixed">{t("inputs.fixed.label")}</label>
              <input
                type="number"
                id="fixed"
                placeholder={t("inputs.fixed.placeholder")}
                step="0.01"
                value={fixed || ""}
                onChange={(e) => setFixed(parseFloat(e.target.value || "0"))}
              />
              <p className="smallNote">{t("inputs.fixed.note")}</p>
            </div>

            <div className="twoCol" style={{ marginTop: 10 }}>
              <div>
                <label htmlFor="unitsPlanned">{t("inputs.units.label")}</label>
                <input
                  type="number"
                  id="unitsPlanned"
                  placeholder={t("inputs.units.placeholder")}
                  step="1"
                  value={unitsPlanned || ""}
                  onChange={(e) => setUnitsPlanned(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">{t("inputs.units.note")}</p>
              </div>

              <div>
                <label htmlFor="targetProfit">{t("inputs.target.label")}</label>
                <input
                  type="number"
                  id="targetProfit"
                  placeholder={t("inputs.target.placeholder")}
                  step="0.01"
                  value={targetProfit || ""}
                  onChange={(e) => setTargetProfit(parseFloat(e.target.value || "0"))}
                />
                <p className="smallNote">{t("inputs.target.note")}</p>
              </div>
            </div>

            {showWarning && (
              <div id="warningBox" className="warning">
                {t("inputs.warning")}
              </div>
            )}
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("results.title")}</h3>

              <div className="headerRight">
                <select
                  className="currencySelect"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as keyof typeof CURRENCIES)}
                  aria-label={t("results.currencyLabel")}
                >
                  {Object.entries(CURRENCIES).map(([code, meta]) => (
                    <option key={code} value={code}>
                      {meta.label}
                    </option>
                  ))}
                </select>

                <span className="pill">{t("results.live")}</span>
              </div>
            </div>

            <div className="row">
              <span className="summaryLabel">{t("results.margin.label")}</span>
              <span className="summaryValue" id="marginOut">
                {money(margin)}
              </span>
            </div>

            <div className="divider">
              <p className="sectionTitle" style={{ marginTop: 0 }}>
                {t("results.breakEven.title")}
              </p>
              <div className="row">
                <span className="summaryLabel">{t("results.breakEven.units")}</span>
                <span className="summaryValue" id="beUnitsOut">
                  {hasMargin ? Math.ceil(beUnits).toString() : "—"}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">{t("results.breakEven.revenue")}</span>
                <span className="summaryValue" id="beRevenueOut">
                  {hasMargin ? money(beRevenue) : "—"}
                </span>
              </div>
            </div>

            <div className="divider">
              <p className="sectionTitle" style={{ marginTop: 0 }}>
                {t("results.planned.title")}
              </p>
              <div className="row">
                <span className="summaryLabel">{t("results.planned.revenue")}</span>
                <span className="summaryValue" id="revOut">
                  {money(revenue)}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">{t("results.planned.variable")}</span>
                <span className="summaryValue" id="varOut">
                  {money(varTotal)}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">{t("results.planned.fixed")}</span>
                <span className="summaryValue" id="fixOut">
                  {money(fixed)}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">{t("results.planned.profit")}</span>
                <span className={profitClass} id="profitOut">
                  {money(profit)}
                </span>
              </div>
            </div>

            <div className="divider">
              <p className="sectionTitle" style={{ marginTop: 0 }}>
                {t("results.target.title")}
              </p>
              <div className="row">
                <span className="summaryLabel">{t("results.target.units")}</span>
                <span className="summaryValue" id="tpUnitsOut">
                  {targetProfit > 0 && hasMargin ? Math.ceil(tpUnits).toString() : "—"}
                </span>
              </div>
              <div className="row">
                <span className="summaryLabel">{t("results.target.revenue")}</span>
                <span className="summaryValue" id="tpRevenueOut">
                  {targetProfit > 0 && hasMargin ? money(tpRevenue) : "—"}
                </span>
              </div>
            </div>

            <p className="smallNote" style={{ marginTop: 10 }}>
              {t("results.tip")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}


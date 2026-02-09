"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function PricingCalculatorPage() {
  const t = useTranslations("pricingCalculatorPage");

  useEffect(() => {
    const currencyMap: Record<string, string> = {
      EGP: "E£",
      USD: "$",
      EUR: "€",
      GBP: "£",
      SAR: "SAR ",
      AED: "AED ",
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
      const vatPct = val("vatPct") / 100;

      const markupPct = val("markupPct") / 100;
      const marginPct = val("marginPct") / 100;

      const cogs = materials + labor + packaging + inbound + overhead;
      const sellingCosts = outbound + marketing;
      const C = cogs + sellingCosts;

      const A = (1 - discountPct) * (1 - feePct);
      const df = discountPct + feePct - discountPct * feePct;
      const modeAllIn = (
        document.getElementById("mode_allin") as HTMLInputElement | null
      )?.checked;

      let price = 0;

      if (marginPct > 0) {
        const denom = (1 - discountPct) * ((1 - feePct) - marginPct);
        price = denom > 0 ? C / denom : 0;
      } else {
        if (modeAllIn) {
          const denom2 = A - markupPct * df;
          price = denom2 > 0 ? (C * (1 + markupPct)) / denom2 : 0;
        } else {
          const denom1 = A;
          price = denom1 > 0 ? ((1 + markupPct) * C) / denom1 : 0;
        }
      }

      const priceInclVAT = price * (1 + vatPct);
      const realized = price * (1 - discountPct);
      const fees = realized * feePct;
      const revenueNet = realized;
      const profit = revenueNet - fees - sellingCosts - cogs;

      const margin = revenueNet > 0 ? profit / revenueNet : 0;
      const markup = C > 0 ? profit / C : 0;

      const setText = (id: string, text: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setText("cogsTotal", fmt(cogs));
      setText("sellingTotal", fmt(sellingCosts));
      setText("totalCost", fmt(C));
      setText("basePrice", fmt(price));
      setText("priceInclTax", fmt(priceInclVAT));
      setText("netRevenue", fmt(revenueNet));
      setText("fees", fmt(fees));
      setText("outCost", fmt(outbound));
      setText("prodCost", fmt(cogs));
      setText("sellCost", fmt(sellingCosts));
      setText("totalUnitCostResult", fmt(C));
      setText("profit", fmt(profit));
      setText("finalBefore", fmt(price));
      setText("finalAfter", fmt(priceInclVAT));

      setText("marginOut", fmt(margin * 100) + "%");
      setText("markupOut", fmt(markup * 100) + "%");
    }

    function bind(id: string, fn: () => void) {
      const el = document.getElementById(id) as HTMLElement | null;
      if (el) {
        el.addEventListener("input", fn);
        el.addEventListener("change", fn);
      }
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
      "markupPct",
      "marginPct",
      "mode_cogs",
      "mode_allin",
    ].forEach((id) => bind(id, compute));

    sel.addEventListener("change", () => {
      setCurrencySymbol(sel.value);
      compute();
    });

    const clearMarginBtn = document.getElementById("clearMargin");
    const clearMarkupBtn = document.getElementById("clearMarkup");

    if (clearMarginBtn) {
      clearMarginBtn.addEventListener("click", () => {
        const marginInput = document.getElementById("marginPct") as HTMLInputElement | null;
        if (marginInput) marginInput.value = "";
        compute();
      });
    }

    if (clearMarkupBtn) {
      clearMarkupBtn.addEventListener("click", () => {
        const markupInput = document.getElementById("markupPct") as HTMLInputElement | null;
        if (markupInput) markupInput.value = "";
        compute();
      });
    }

    compute();
  }, [t]);

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
        .radioRow {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .radioRow label {
          display: flex;
          gap: 8px;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
        }
        .btn {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: linear-gradient(
            90deg,
            rgba(124, 92, 255, 0.2),
            rgba(0, 212, 255, 0.18)
          );
          color: var(--text);
          cursor: pointer;
        }
        .btn:hover {
          filter: brightness(1.1);
        }
        .money::before {
          content: var(--curSym) " ";
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <main>
        <h1>{t("title")}</h1>

        <div className="topbar">
          <div className="currency">
            <label htmlFor="currencySelect">{t("currency.label")}</label>
            <select id="currencySelect" title={t("currency.title")}>
              <option value="EGP" defaultValue="EGP">
                {t("currency.egp")}
              </option>
              <option value="USD">{t("currency.usd")}</option>
              <option value="EUR">{t("currency.eur")}</option>
              <option value="GBP">{t("currency.gbp")}</option>
              <option value="SAR">{t("currency.sar")}</option>
              <option value="AED">{t("currency.aed")}</option>
            </select>
            <span className="badge">{t("currency.badge")}</span>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("costs.title")}</h3>
              <span className="badge">{t("costs.badge")}</span>
            </div>
            <div className="row">
              <label>{t("costs.materials")}</label>
              <input id="materials" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("costs.labor")}</label>
              <input id="labor" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("costs.packaging")}</label>
              <input id="packaging" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("costs.inbound")}</label>
              <input id="inbound" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("costs.overhead")}</label>
              <input id="overhead" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row total">
              <label>{t("costs.cogsTotal")}</label>
              <span id="cogsTotal" className="money">
                0.00
              </span>
            </div>

            <div className="section">
              <div className="cardHeader">
                <h3 className="title">{t("selling.title")}</h3>
                <span className="badge">{t("selling.badge")}</span>
              </div>
              <div className="row">
                <label>{t("selling.outbound")}</label>
                <input id="outbound" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="row">
                <label>{t("selling.marketing")}</label>
                <input id="marketing" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="row">
                <label>{t("selling.fee")}</label>
                <input id="feePct" type="number" step="0.01" defaultValue={3.29} />
              </div>
              <div className="row">
                <label>{t("selling.discount")}</label>
                <input id="discountPct" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="row">
                <label>{t("selling.vat")}</label>
                <input id="vatPct" type="number" step="0.01" defaultValue={0} />
              </div>
              <div className="row total">
                <label>{t("selling.total")}</label>
                <span id="sellingTotal" className="money">
                  0.00
                </span>
              </div>
            </div>

            <div className="priceCard">
              <div className="priceRow">
                <span>{t("costs.totalUnit")}</span>
                <span className="priceValue money" id="totalCost">
                  0.00
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("target.title")}</h3>
              <span className="badge">{t("target.badge")}</span>
            </div>
            <div className="row">
              <label>
                {t("target.markup")}{" "}
                <span style={{ fontSize: "12px", color: "#9ca5e0" }}>
                  {t("target.markupNote")}
                </span>
              </label>
              <input id="markupPct" type="number" step="0.01" defaultValue={50} />
            </div>
            <div className="row">
              <label>
                {t("target.margin")}{" "}
                <span style={{ fontSize: "12px", color: "#9ca5e0" }}>
                  {t("target.marginNote")}
                </span>
              </label>
              <input id="marginPct" type="number" step="0.01" />
            </div>
            <div className="radioRow">
              <label>
                <input type="radio" name="markupMode" id="mode_cogs" defaultChecked />{" "}
                {t("target.modeCogs")}
              </label>
              <label>
                <input type="radio" name="markupMode" id="mode_allin" />{" "}
                {t("target.modeAllIn")}
              </label>
            </div>
            <div className="row">
              <button className="btn" id="clearMargin" type="button">
                {t("target.useMarkup")}
              </button>
              <button className="btn" id="clearMarkup" type="button">
                {t("target.useMargin")}
              </button>
            </div>
            <div className="priceCard">
              <div className="priceRow">
                <span>{t("target.basePrice")}</span>
                <span className="priceValue money" id="basePrice">
                  0.00
                </span>
              </div>
              <div className="priceRow">
                <span>{t("target.priceInclTax")}</span>
                <span className="priceValue money" id="priceInclTax">
                  0.00
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("results.title")}</h3>
              <span className="badge">{t("results.badge")}</span>
            </div>
            <div className="row">
              <label>{t("results.revenue")}</label>
              <span id="netRevenue" className="money">
                0.00
              </span>
            </div>
            <div className="row">
              <label>{t("results.fees")}</label>
              <span id="fees" className="money">
                0.00
              </span>
            </div>
            <div className="row">
              <label>{t("results.outbound")}</label>
              <span id="outCost" className="money">
                0.00
              </span>
            </div>
            <div className="row">
              <label>{t("results.production")}</label>
              <span id="prodCost" className="money">
                0.00
              </span>
            </div>
            <div className="row">
              <label>{t("results.selling")}</label>
              <span id="sellCost" className="money">
                0.00
              </span>
            </div>
            <div className="row">
              <label>{t("results.totalUnit")}</label>
              <span id="totalUnitCostResult" className="money">
                0.00
              </span>
            </div>
            <div className="row total">
              <label>{t("results.profit")}</label>
              <span id="profit" className="money">
                0.00
              </span>
            </div>
            <div className="row">
              <label>{t("results.margin")}</label>
              <span id="marginOut">0.00%</span>
            </div>
            <div className="row">
              <label>{t("results.markup")}</label>
              <span id="markupOut">0.00%</span>
            </div>
            <div className="section">
              <div className="row">
                <label>{t("results.finalBefore")}</label>
                <span id="finalBefore" className="money">
                  0.00
                </span>
              </div>
              <div className="row">
                <label>{t("results.finalAfter")}</label>
                <span id="finalAfter" className="money">
                  0.00
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

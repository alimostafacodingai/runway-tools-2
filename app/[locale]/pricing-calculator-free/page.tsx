"use client";



import { useEffect } from "react";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";



export default function PricingCalculatorFreePage() {

  const t = useTranslations("pricingCalculatorFreePage");

  const locale = useLocale();



  const href = (path: string) => `/${locale}${path}`;



  useEffect(() => {    const currencyMap: Record<string, string> = {
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



      const cogs = materials + labor + packaging + inbound + overhead;

      const sellingCosts = outbound + marketing;

      const totalUnitCost = cogs + sellingCosts;



      const setText = (id: string, text: string) => {

        const el = document.getElementById(id);

        if (el) el.textContent = text;

      };



      setText("cogsTotal", fmt(cogs));

      setText("sellingTotal", fmt(sellingCosts));

      setText("totalCost", fmt(totalUnitCost));



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



            <div className="row">

              <label>{t("costs.cogsTotal")}</label>

              <span id="cogsTotal" className="money">

                0.00

              </span>

            </div>

            <div className="hint">{t("costs.cogsHint")}</div>



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



              <div className="row">

                <label>{t("selling.total")}</label>

                <span id="sellingTotal" className="money">

                  0.00

                </span>

              </div>

              <div className="hint">{t("selling.hint")}</div>

            </div>



            <div className="priceCard">

              <div className="priceRow">

                <span>{t("costs.totalUnit")}</span>

                <span className="priceValue money" id="totalCost">

                  0.00

                </span>

              </div>

              <div className="hint">{t("costs.totalHint")}</div>

            </div>

          </div>



          <div className="card">

            <div className="cardHeader">

              <h3 className="title">{t("target.title")}</h3>

              <span className="badge">{t("target.badge")}</span>

            </div>



            <div className="row">

              <label>{t("target.markup")}</label>

              <span id="locked_markup" className="lockedValue">

                —

              </span>

            </div>



            <div className="row">

              <label>{t("target.margin")}</label>

              <span id="locked_margin" className="lockedValue">

                —

              </span>

            </div>



            <div className="section">

              <div className="row" style={{ marginBottom: 6 }}>

                <label>{t("target.mode")}</label>

                <span id="locked_mode" className="lockedValue">

                  —

                </span>

              </div>



              <div className="pillRow">

                <div className="pill">

                  <span className="pillDot" />

                  {t("target.pillCogs")}

                </div>

                <div className="pill">

                  <span className="pillDot" />

                  {t("target.pillAllIn")}

                </div>

              </div>



              <div className="hint">{t("target.hint")}</div>

            </div>



            <div className="priceCard">

              <div className="priceRow">

                <span>{t("target.basePrice")}</span>

                <span className="priceValue lockedValue" id="basePrice">

                  —

                </span>

              </div>

              <div className="priceRow">

                <span>{t("target.priceInclTax")}</span>

                <span className="priceValue lockedValue" id="priceInclTax">

                  —

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

              <span id="netRevenue" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.fees")}</label>

              <span id="fees" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.outbound")}</label>

              <span id="outCost" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.production")}</label>

              <span id="prodCost" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.selling")}</label>

              <span id="sellCost" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.totalUnit")}</label>

              <span id="totalUnitCostResult" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.profit")}</label>

              <span id="profit" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.margin")}</label>

              <span id="marginOut" className="lockedValue">

                —

              </span>

            </div>

            <div className="row">

              <label>{t("results.markup")}</label>

              <span id="markupOut" className="lockedValue">

                —

              </span>

            </div>

            <div className="section">

              <div className="row">

                <label>{t("results.finalBefore")}</label>

                <span id="finalBefore" className="lockedValue">

                  —

                </span>

              </div>

              <div className="row">

                <label>{t("results.finalAfter")}</label>

                <span id="finalAfter" className="lockedValue">

                  —

                </span>

              </div>

            </div>



            <div className="ctaWrap">

              <Link className="ctaBtn" href={href("/plans")}>

                {t("results.cta")}

              </Link>

            </div>

          </div>

        </div>

      </main>

    </>

  );

}




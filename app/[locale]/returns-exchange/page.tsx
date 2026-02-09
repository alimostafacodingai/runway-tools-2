"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

const pageStyles = `
  :root{
    --bg:#0f1226;
    --card:#141834;
    --muted:#a4a9c8;
    --text:#e9ecff;
    --accent:#7c5cff;
    --accent2:#00d4ff;
    --border:rgba(255,255,255,0.08);
    --radius:16px;
  }
  *{box-sizing:border-box}
  body.runway-returns-page-body{
    margin:28px;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial;
    background:
      radial-gradient(1200px 800px at 0% 0%,#251b63 0%,transparent 60%),
      radial-gradient(1200px 800px at 100% 0%,#0b6c9a33 0%,transparent 60%),
      var(--bg);
    color:var(--text);
    line-height:1.45;
  }
  .runway-returns-root h1{margin:0 0 8px 0;font-size:26px}
  .runway-returns-root .sub{color:var(--muted);margin:6px 0 18px 0;max-width:780px}

  .runway-returns-root .toolbar{
    display:flex;
    gap:12px;
    align-items:center;
    margin:8px 0 18px 0;
    flex-wrap:wrap;
  }
  .runway-returns-root select{
    padding:8px 10px;
    border-radius:10px;
    border:1px solid var(--border);
    background:#0e1230;
    color:#e9ecff;
    font-size:13px;
  }

  .runway-returns-root .grid{
    display:grid;
    gap:18px;
    grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);
  }
  @media (max-width:900px){
    .runway-returns-root .grid{grid-template-columns:1fr;}
  }

  .runway-returns-root .card{
    background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));
    border-radius:var(--radius);
    padding:18px;
    box-shadow:0 8px 24px rgba(0,0,0,0.35),inset 0 0 0 1px var(--border);
    backdrop-filter:blur(4px);
  }
  .runway-returns-root .cardHeader{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    margin:-4px 0 12px 0;
  }
  .runway-returns-root .title{
    font-weight:700;
    letter-spacing:.2px;
    background:linear-gradient(90deg,var(--accent),var(--accent2));
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
  }
  .runway-returns-root .badge{
    font-size:12px;
    color:#cfd3ff;
    border:1px solid var(--border);
    padding:2px 10px;
    border-radius:999px;
    background:rgba(124,92,255,0.12);
  }

  .runway-returns-root label{
    display:block;
    font-size:13px;
    color:#cfd3ff;
    margin-bottom:4px;
  }
  .runway-returns-root input[type="number"]{
    width:100%;
    max-width:160px;
    padding:8px 10px;
    border-radius:10px;
    border:1px solid var(--border);
    background:#0e1230;
    color:var(--text);
    font-size:13px;
    outline:none;
  }
  .runway-returns-root input[type="number"]:focus{
    border-color:#6f84ff;
    box-shadow:0 0 0 3px rgba(127,152,255,0.2);
  }

  .runway-returns-root .muted{color:var(--muted);font-size:12px}
  .runway-returns-root .smallNote{
    font-size:11px;
    color:#a7acd4;
    margin-top:4px;
  }

  .runway-returns-root .twoCol{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:10px;
  }

  .runway-returns-root .row{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:12px;
    margin:8px 0;
    font-size:13px;
  }
  .runway-returns-root .row span{font-size:13px}
  .runway-returns-root .summaryLabel{color:#cfd3ff}
  .runway-returns-root .summaryValue{font-weight:600}
  .runway-returns-root .summaryValue.good{color:#aef7d0;}
  .runway-returns-root .summaryValue.bad{color:#fecaca;}

  .runway-returns-root .sectionTitle{
    font-size:11px;
    text-transform:uppercase;
    letter-spacing:.12em;
    color:#9fa4d6;
    margin:10px 0 6px 0;
  }
  .runway-returns-root .divider{
    border-top:1px solid var(--border);
    margin:10px 0;
    padding-top:8px;
  }

  .runway-returns-root .priceCard{
    background:linear-gradient(135deg,rgba(124,92,255,0.25),rgba(0,212,255,0.25));
    border-radius:var(--radius);
    padding:14px;
    margin-top:10px;
    box-shadow:0 10px 30px rgba(0,0,0,0.3),inset 0 0 0 1px var(--border);
  }
  .runway-returns-root .priceRow{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    margin:4px 0;
    font-size:16px;
  }
  .runway-returns-root .priceValue{font-weight:800}

  .runway-returns-root .explain{
    font-size:12px;
    color:#cfd3ff;
    background:rgba(255,255,255,0.05);
    padding:10px;
    border-radius:12px;
    border:1px solid var(--border);
    margin-top:10px;
    line-height:1.5;
  }
`;

export default function ReturnsExchangePage() {
  const t = useTranslations("returnsExchangePage");

  useEffect(() => {
    // add a class to body so styles don't affect the whole app globally
    document.body.classList.add("runway-returns-page-body");    const SYMBOL: Record<string, string> = {
      EGP: "E\u00a3",
      USD: "$",
      EUR: "\u20ac",
      GBP: "\u00a3",
      AED: "\u062f.\u0625",
      SAR: "\u0631.\u0633",
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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    function money(x: number): string {
      return (SYMBOL[curr] || curr) + nfmt(x);
    }

    function setText(id: string, val: string) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    function compute() {
      const aov = num("aov");
      const cogs = num("cogs");
      const otherVar = num("otherVar");
      const ordersMonth = num("ordersMonth");

      const returnRate = num("returnRate") / 100;
      const exchangeRate = num("exchangeRate") / 100;

      const retShip = num("retShip");
      const retHandling = num("retHandling");
      const retLoss = num("retLoss");

      const exShip = num("exShip");
      const exHandling = num("exHandling");
      const exDiscount = num("exDiscount");

      // Base per-order economics (no returns yet)
      const revenue = aov;
      const nonAdCost = cogs + otherVar;
      const baseProfit = revenue - nonAdCost;

      // Expected additional cost per order from returns & exchanges
      const costPerReturn = retShip + retHandling + retLoss;
      const costPerExchange = exShip + exHandling + exDiscount;

      const extraCostPerOrder =
        returnRate * costPerReturn + exchangeRate * costPerExchange;

      const profitAfter = baseProfit - extraCostPerOrder;

      const marginBefore = revenue > 0 ? baseProfit / revenue : 0;
      const marginAfter = revenue > 0 ? profitAfter / revenue : 0;
      const marginDrop = (marginBefore - marginAfter) * 100;

      // Monthly impact
      const returnsPerMonth = ordersMonth * returnRate;
      const exchangesPerMonth = ordersMonth * exchangeRate;

      const monthlyExtraCost = ordersMonth * extraCostPerOrder;
      const monthlyProfitBefore = ordersMonth * baseProfit;
      const monthlyProfitAfter = ordersMonth * profitAfter;

      // --- Update UI ---

      // per order
      setText("revOut", money(revenue));
      setText("nonAdOut", money(nonAdCost));
      setText("baseProfitOut", money(baseProfit));
      setText("extraPerOrderOut", money(extraCostPerOrder));
      setText("profitAfterOut", money(profitAfter));

      // margins
      setText("marginBeforeOut", nfmt(marginBefore * 100) + "%");
      setText("marginAfterOut", nfmt(marginAfter * 100) + "%");
      setText("marginDropOut", nfmt(marginDrop) + " pts");

      // monthly
      setText(
        "ordersMonthOut",
        isFinite(ordersMonth) ? Math.round(ordersMonth).toString() : "0"
      );
      setText(
        "returnsCountOut",
        isFinite(returnsPerMonth) ? Math.round(returnsPerMonth).toString() : "0"
      );
      setText(
        "exchangesCountOut",
        isFinite(exchangesPerMonth)
          ? Math.round(exchangesPerMonth).toString()
          : "0"
      );
      setText("monthlyExtraOut", money(monthlyExtraCost));
      setText("monthlyProfitBeforeOut", money(monthlyProfitBefore));
      setText("monthlyProfitAfterOut", money(monthlyProfitAfter));

      // color profit after returns (per order + monthly)
      const profitAfterEl = document.getElementById(
        "profitAfterOut"
      ) as HTMLElement | null;
      const monthlyAfterEl = document.getElementById(
        "monthlyProfitAfterOut"
      ) as HTMLElement | null;

      [profitAfterEl, monthlyAfterEl].forEach((el) => {
        if (!el) return;
        el.classList.remove("good", "bad");
        if (profitAfter > 0) el.classList.add("good");
        if (profitAfter < 0) el.classList.add("bad");
      });
    }

    const ids = [
      "aov",
      "cogs",
      "otherVar",
      "ordersMonth",
      "returnRate",
      "exchangeRate",
      "retShip",
      "retHandling",
      "retLoss",
      "exShip",
      "exHandling",
      "exDiscount",
    ];

    const listeners: { el: HTMLElement; type: string; fn: any }[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) return;
      const fn = () => compute();
      el.addEventListener("input", fn);
      el.addEventListener("change", fn);
      listeners.push({ el, type: "input", fn });
      listeners.push({ el, type: "change", fn });
    });

    const currSel = document.getElementById(
      "currency"
    ) as HTMLSelectElement | null;
    let currChangeHandler: ((e: Event) => void) | null = null;
    if (currSel) {
      currChangeHandler = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        curr = target.value;
        compute();
      };
      currSel.addEventListener("change", currChangeHandler);
    }

    compute();

    return () => {
      // cleanup listeners + body class
      listeners.forEach(({ el, type, fn }) => {
        el.removeEventListener(type, fn);
      });
      if (currSel && currChangeHandler) {
        currSel.removeEventListener("change", currChangeHandler);
      }
      document.body.classList.remove("runway-returns-page-body");
    };
  }, [t]);

  return (
    <div className="runway-returns-root">
      {/* inject styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: pageStyles,
        }}
      />
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
        {/* LEFT: Inputs */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">{t("inputs.title")}</h3>
            <span className="badge">{t("inputs.badge")}</span>
          </div>

          <div className="twoCol">
            <div>
              <label htmlFor="aov">{t("inputs.aov.label")}</label>
              <input id="aov" type="number" step="0.01" defaultValue={0} />
              <p className="smallNote">{t("inputs.aov.note")}</p>
            </div>

            <div>
              <label htmlFor="cogs">{t("inputs.cogs.label")}</label>
              <input id="cogs" type="number" step="0.01" defaultValue={0} />
              <p className="smallNote">{t("inputs.cogs.note")}</p>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <label htmlFor="otherVar">{t("inputs.other.label")}</label>
            <input id="otherVar" type="number" step="0.01" defaultValue={0} />
            <p className="smallNote">{t("inputs.other.note")}</p>
          </div>

          <div style={{ marginTop: 10 }}>
            <label htmlFor="ordersMonth">{t("inputs.orders.label")}</label>
            <input id="ordersMonth" type="number" step="1" defaultValue={0} />
            <p className="smallNote">{t("inputs.orders.note")}</p>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("rates.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="returnRate">{t("rates.return")}</label>
                <input id="returnRate" type="number" step="0.1" defaultValue={0} />
                <p className="smallNote">{t("rates.returnNote")}</p>
              </div>
              <div>
                <label htmlFor="exchangeRate">{t("rates.exchange")}</label>
                <input id="exchangeRate" type="number" step="0.1" defaultValue={0} />
                <p className="smallNote">{t("rates.exchangeNote")}</p>
              </div>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("costReturn.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="retShip">{t("costReturn.shipping")}</label>
                <input id="retShip" type="number" step="0.01" defaultValue={0} />
              </div>
              <div>
                <label htmlFor="retHandling">{t("costReturn.handling")}</label>
                <input id="retHandling" type="number" step="0.01" defaultValue={0} />
              </div>
              <div>
                <label htmlFor="retLoss">{t("costReturn.loss")}</label>
                <input id="retLoss" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>
            <p className="smallNote">{t("costReturn.note")}</p>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("costExchange.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="exShip">{t("costExchange.shipping")}</label>
                <input id="exShip" type="number" step="0.01" defaultValue={0} />
              </div>
              <div>
                <label htmlFor="exHandling">{t("costExchange.handling")}</label>
                <input id="exHandling" type="number" step="0.01" defaultValue={0} />
              </div>
              <div>
                <label htmlFor="exDiscount">{t("costExchange.discount")}</label>
                <input id="exDiscount" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>
          </div>

          <div className="explain">
            <p>
              <strong>{t("explain.title")}</strong>
            </p>
            <p>{t("explain.step1")}</p>
            <p>{t("explain.step2")}</p>
            <p>{t("explain.step3")}</p>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">{t("results.title")}</h3>
            <span className="badge">{t("results.badge")}</span>
          </div>

          <p className="sectionTitle" style={{ marginTop: 0 }}>
            {t("results.perOrderTitle")}
          </p>
          <div className="row">
            <span className="summaryLabel">{t("results.revenue")}</span>
            <span className="summaryValue" id="revOut">
              E£0.00
            </span>
          </div>
          <div className="row">
            <span className="summaryLabel">{t("results.nonAd")}</span>
            <span className="summaryValue" id="nonAdOut">
              E£0.00
            </span>
          </div>
          <div className="row">
            <span className="summaryLabel">{t("results.baseProfit")}</span>
            <span className="summaryValue" id="baseProfitOut">
              E£0.00
            </span>
          </div>

          <div className="priceCard">
            <div className="priceRow">
              <span>{t("results.extraPerOrder")}</span>
              <span className="priceValue" id="extraPerOrderOut">
                E£0.00
              </span>
            </div>
            <div className="priceRow">
              <span>{t("results.profitAfter")}</span>
              <span className="priceValue" id="profitAfterOut">
                E£0.00
              </span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              {t("results.marginTitle")}
            </p>
            <div className="row">
              <span className="summaryLabel">{t("results.marginBefore")}</span>
              <span className="summaryValue" id="marginBeforeOut">
                0.00%
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.marginAfter")}</span>
              <span className="summaryValue" id="marginAfterOut">
                0.00%
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.marginDrop")}</span>
              <span className="summaryValue" id="marginDropOut">
                0.00 pts
              </span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              {t("results.monthlyTitle")}
            </p>
            <div className="row">
              <span className="summaryLabel">{t("results.orders")}</span>
              <span className="summaryValue" id="ordersMonthOut">
                0
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.returns")}</span>
              <span className="summaryValue" id="returnsCountOut">
                0
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.exchanges")}</span>
              <span className="summaryValue" id="exchangesCountOut">
                0
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.monthlyExtra")}</span>
              <span className="summaryValue" id="monthlyExtraOut">
                E£0.00
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.monthlyBefore")}</span>
              <span className="summaryValue" id="monthlyProfitBeforeOut">
                E£0.00
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.monthlyAfter")}</span>
              <span className="summaryValue" id="monthlyProfitAfterOut">
                E£0.00
              </span>
            </div>
          </div>

          <p className="smallNote" style={{ marginTop: 10 }}>
            {t("results.tip")}
          </p>
        </div>
      </div>
    </div>
  );
}

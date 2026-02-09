"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function PackagingCostBuilderFreePage() {
  const t = useTranslations("packagingCostBuilderFreePage");

  useEffect(() => {
    const SYMBOL: Record<string, string> = {
      EGP: "E£",
      USD: "$",
      EUR: "€",
      GBP: "£",
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
      const itemsPerOrderRaw = num("itemsPerOrder");
      const itemsPerOrder = itemsPerOrderRaw > 0 ? itemsPerOrderRaw : 1;

      const ordersMonth = num("ordersMonth");

      const outerBox = num("outerBox");
      const polybag = num("polybag");
      const tissue = num("tissue");
      const insert = num("insert");
      const sticker = num("sticker");
      const labelTape = num("labelTape");
      const extraPack = num("extraPack");

      const labourMinutes = num("labourMinutes");
      const labourHourly = num("labourHourly");

      const materialPerOrder =
        outerBox +
        tissue +
        insert +
        sticker +
        labelTape +
        extraPack +
        polybag * itemsPerOrder;

      const labourPerOrder = (labourHourly / 60) * labourMinutes;

      const totalPerOrder = materialPerOrder + labourPerOrder;
      const perItem = totalPerOrder / itemsPerOrder;

      const monthlyCost = totalPerOrder * ordersMonth;

      setText("packMaterialsPerOrderOut", money(materialPerOrder));
      setText("labourPerOrderOut", money(labourPerOrder));
      setText("totalPackPerOrderOut", money(totalPerOrder));
      setText("packPerItemOut", money(perItem));

      setText(
        "monthlyOrdersOut",
        isFinite(ordersMonth) ? Math.round(ordersMonth).toString() : "0"
      );
      setText("monthlyPackCostOut", money(monthlyCost));
    }

    const ids = [
      "itemsPerOrder",
      "ordersMonth",
      "outerBox",
      "polybag",
      "tissue",
      "insert",
      "sticker",
      "labelTape",
      "extraPack",
      "labourMinutes",
      "labourHourly",
    ];

    const listeners: { el: HTMLInputElement; handler: () => void }[] = [];

    ids.forEach((id) => {
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
    if (currSel) {
      currSel.addEventListener("change", currHandler);
    }

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
    .packaging-page-root{
      margin:0;
      padding:28px 28px 40px;
      font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial;
      background:
        radial-gradient(1200px 800px at 0% 0%,#251b63 0%,transparent 60%),
        radial-gradient(1200px 800px at 100% 0%,#0b6c9a33 0%,transparent 60%),
        var(--bg);
      color:var(--text);
      line-height:1.45;
      min-height:100vh;
    }
    h1{margin:0 0 8px 0;font-size:26px}
    .sub{color:var(--muted);margin:6px 0 18px 0;max-width:780px}

    .toolbar{
      display:flex;
      gap:12px;
      align-items:center;
      margin:8px 0 18px 0;
      flex-wrap:wrap;
    }
    select{
      padding:8px 10px;
      border-radius:10px;
      border:1px solid var(--border);
      background:#0e1230;
      color:#e9ecff;
      font-size:13px;
    }
    .muted{color:var(--muted);font-size:12px}

    .grid{
      display:grid;
      gap:18px;
      grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);
    }
    @media (max-width:900px){
      .grid{grid-template-columns:1fr;}
    }

    .card{
      background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));
      border-radius:var(--radius);
      padding:18px;
      box-shadow:none;
      backdrop-filter:blur(4px);
    }
    .cardHeader{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:8px;
      margin:-4px 0 12px 0;
    }
    .title{
      font-weight:700;
      letter-spacing:.2px;
      background:linear-gradient(90deg,var(--accent),var(--accent2));
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
    }
    .badge{
      font-size:12px;
      color:#cfd3ff;
      border:1px solid var(--border);
      padding:2px 10px;
      border-radius:999px;
      background:rgba(124,92,255,0.12);
    }

    label{
      display:block;
      font-size:13px;
      color:#cfd3ff;
      margin-bottom:4px;
    }
    input[type="number"]{
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
    input[type="number"]:focus{
      border-color:#6f84ff;
      box-shadow:0 0 0 3px rgba(127,152,255,0.2);
    }

    .smallNote{
      font-size:11px;
      color:#a7acd4;
      margin-top:4px;
    }
    .sectionTitle{
      font-size:11px;
      text-transform:uppercase;
      letter-spacing:.12em;
      color:#9fa4d6;
      margin:10px 0 6px 0;
    }
    .divider{
      border-top:1px solid var(--border);
      margin:10px 0;
      padding-top:8px;
    }

    .twoCol{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
      gap:10px;
    }

    .row{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
      margin:8px 0;
      font-size:13px;
    }
    .row span{font-size:13px}
    .summaryLabel{color:#cfd3ff}
    .summaryValue{font-weight:600}

    .priceCard{
      background:linear-gradient(135deg,rgba(124,92,255,0.25),rgba(0,212,255,0.25));
      border-radius:var(--radius);
      padding:14px;
      margin-top:10px;
      box-shadow:none;
    }
    .priceRow{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:8px;
      margin:4px 0;
      font-size:16px;
    }
    .priceValue{font-weight:800}

    .explain{
      font-size:12px;
      color:#cfd3ff;
      background:rgba(255,255,255,0.05);
      padding:10px;
      border-radius:12px;
      margin-top:10px;
      line-height:1.5;
    }
  `;

  return (
    <div className="packaging-page-root">
      <h1>{t("title")}</h1>
      <div className="toolbar">
        <label htmlFor="currency">{t("currency.label")}</label>
        <select id="currency">
          <option value="EGP" defaultValue="EGP">
            {t("currency.egp")}
          </option>
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
              <label htmlFor="itemsPerOrder">{t("inputs.items.label")}</label>
              <input id="itemsPerOrder" type="number" step="1" defaultValue={1} />
              <p className="smallNote">{t("inputs.items.note")}</p>
            </div>

            <div>
              <label htmlFor="ordersMonth">{t("inputs.orders.label")}</label>
              <input id="ordersMonth" type="number" step="1" defaultValue={0} />
              <p className="smallNote">{t("inputs.orders.note")}</p>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("materials.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="outerBox">{t("materials.outerBox.label")}</label>
                <input id="outerBox" type="number" step="0.01" defaultValue={0} />
                <p className="smallNote">{t("materials.outerBox.note")}</p>
              </div>

              <div>
                <label htmlFor="polybag">{t("materials.polybag.label")}</label>
                <input id="polybag" type="number" step="0.01" defaultValue={0} />
                <p className="smallNote">{t("materials.polybag.note")}</p>
              </div>
            </div>

            <div className="twoCol" style={{ marginTop: "10px" }}>
              <div>
                <label htmlFor="tissue">{t("materials.tissue")}</label>
                <input id="tissue" type="number" step="0.01" defaultValue={0} />
              </div>

              <div>
                <label htmlFor="insert">{t("materials.insert")}</label>
                <input id="insert" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>

            <div className="twoCol" style={{ marginTop: "10px" }}>
              <div>
                <label htmlFor="sticker">{t("materials.sticker")}</label>
                <input id="sticker" type="number" step="0.01" defaultValue={0} />
              </div>

              <div>
                <label htmlFor="labelTape">{t("materials.labelTape")}</label>
                <input id="labelTape" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label htmlFor="extraPack">{t("materials.extraPack.label")}</label>
              <input id="extraPack" type="number" step="0.01" defaultValue={0} />
              <p className="smallNote">{t("materials.extraPack.note")}</p>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">{t("labour.title")}</p>
            <div className="twoCol">
              <div>
                <label htmlFor="labourMinutes">{t("labour.minutes")}</label>
                <input id="labourMinutes" type="number" step="0.1" defaultValue={0} />
              </div>
              <div>
                <label htmlFor="labourHourly">{t("labour.hourly")}</label>
                <input id="labourHourly" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>
            <p className="smallNote">{t("labour.note")}</p>
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

        <div className="card">
          <div className="cardHeader">
            <h3 className="title">{t("results.title")}</h3>
            <span className="badge">{t("results.badge")}</span>
          </div>

          <p className="sectionTitle" style={{ marginTop: 0 }}>
            {t("results.perOrder.title")}
          </p>
          <div className="row">
            <span className="summaryLabel">{t("results.perOrder.materials")}</span>
            <span className="summaryValue" id="packMaterialsPerOrderOut">
              E£0.00
            </span>
          </div>
          <div className="row">
            <span className="summaryLabel">{t("results.perOrder.labour")}</span>
            <span className="summaryValue" id="labourPerOrderOut">
              E£0.00
            </span>
          </div>

          <div className="priceCard">
            <div className="priceRow">
              <span>{t("results.perOrder.total")}</span>
              <span className="priceValue" id="totalPackPerOrderOut">
                E£0.00
              </span>
            </div>
            <div className="priceRow">
              <span>{t("results.perOrder.perItem")}</span>
              <span className="priceValue" id="packPerItemOut">
                E£0.00
              </span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              {t("results.monthly.title")}
            </p>
            <div className="row">
              <span className="summaryLabel">{t("results.monthly.orders")}</span>
              <span className="summaryValue" id="monthlyOrdersOut">
                0
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">{t("results.monthly.cost")}</span>
              <span className="summaryValue" id="monthlyPackCostOut">
                E£0.00
              </span>
            </div>
          </div>

          <div className="explain">
            <p>
              <strong>{t("results.how.title")}</strong>
            </p>
            <p>{t("results.how.step1")}</p>
            <p>{t("results.how.step2")}</p>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

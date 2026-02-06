"use client";

import { useEffect } from "react";

export default function PackagingCostBuilderPage() {
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

      // materials
      const materialPerOrder =
        outerBox +
        tissue +
        insert +
        sticker +
        labelTape +
        extraPack +
        polybag * itemsPerOrder; // polybag per item

      // labour
      const labourPerOrder = (labourHourly / 60) * labourMinutes;

      const totalPerOrder = materialPerOrder + labourPerOrder;
      const perItem = totalPerOrder / itemsPerOrder;

      const monthlyCost = totalPerOrder * ordersMonth;

      // Update UI
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

    // Cleanup on unmount
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
      margin:0;                       /* removed black frame */
      padding:28px 28px 40px;         /* inner spacing instead */
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
      box-shadow:none;       /* no outline */
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
      box-shadow:none;      /* no outline */
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
      <h1>RunwayToRevenue – Packaging Cost Builder</h1>
      <div className="toolbar">
        <label htmlFor="currency">Currency</label>
        <select id="currency">
          <option value="EGP" defaultValue="EGP">
            EGP – Egyptian Pound
          </option>
          <option value="USD">USD – US Dollar</option>
          <option value="EUR">EUR – Euro</option>
          <option value="GBP">GBP – British Pound</option>
          <option value="AED">AED – UAE Dirham</option>
          <option value="SAR">SAR – Saudi Riyal</option>
        </select>
        <span className="muted">
          Use the same currency you use in your pricing &amp; manufacturing tools.
        </span>
      </div>

      <p className="sub">
        Build your <strong>full packaging cost per order</strong> and per item. Plug this
        into your pricing calculator so you don&apos;t underestimate COGS.
      </p>

      <div className="grid">
        {/* LEFT: Inputs */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">Packaging Inputs</h3>
            <span className="badge">Per Order / Per Item</span>
          </div>

          <div className="twoCol">
            <div>
              <label htmlFor="itemsPerOrder">Average items per order</label>
              <input id="itemsPerOrder" type="number" step="1" defaultValue={1} />
              <p className="smallNote">
                For example: many brands average 1–3 items per order.
              </p>
            </div>

            <div>
              <label htmlFor="ordersMonth">Orders per month (optional)</label>
              <input id="ordersMonth" type="number" step="1" defaultValue={0} />
              <p className="smallNote">
                We&apos;ll show your total monthly packaging spend using this.
              </p>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">Core materials</p>
            <div className="twoCol">
              <div>
                <label htmlFor="outerBox">Outer mailer / box – cost per order</label>
                <input id="outerBox" type="number" step="0.01" defaultValue={0} />
                <p className="smallNote">
                  Custom mailer, shipping box or polymailer used once per order.
                </p>
              </div>

              <div>
                <label htmlFor="polybag">Inner poly bag – cost per item</label>
                <input id="polybag" type="number" step="0.01" defaultValue={0} />
                <p className="smallNote">
                  Cost for one product bag. We multiply by items per order.
                </p>
              </div>
            </div>

            <div className="twoCol" style={{ marginTop: "10px" }}>
              <div>
                <label htmlFor="tissue">Tissue / wrapping – per order</label>
                <input id="tissue" type="number" step="0.01" defaultValue={0} />
              </div>

              <div>
                <label htmlFor="insert">Thank-you card / insert – per order</label>
                <input id="insert" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>

            <div className="twoCol" style={{ marginTop: "10px" }}>
              <div>
                <label htmlFor="sticker">Stickers / branding – per order</label>
                <input id="sticker" type="number" step="0.01" defaultValue={0} />
              </div>

              <div>
                <label htmlFor="labelTape">Label + tape + misc – per order</label>
                <input id="labelTape" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <label htmlFor="extraPack">Extra / custom packaging – per order</label>
              <input id="extraPack" type="number" step="0.01" defaultValue={0} />
              <p className="smallNote">
                Ribbons, dust bags, special boxes, limited drop extras, etc.
              </p>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle">Fulfilment labour</p>
            <div className="twoCol">
              <div>
                <label htmlFor="labourMinutes">
                  Packing time per order (minutes)
                </label>
                <input id="labourMinutes" type="number" step="0.1" defaultValue={0} />
              </div>
              <div>
                <label htmlFor="labourHourly">Hourly wage for packing</label>
                <input id="labourHourly" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>
            <p className="smallNote">
              Example: if it takes 5 minutes to pack and the packer is paid 60 per hour,
              labour cost per order ≈ (5 ÷ 60) × 60 = 5.
            </p>
          </div>

          <div className="explain">
            <p>
              <strong>How this model works:</strong>
            </p>
            <p>
              1️⃣ We build your <strong>material cost per order</strong> from the outer
              mailer, poly bags, tissue, inserts, stickers, labels, tape and any extras.
            </p>
            <p>
              2️⃣ We convert your <strong>packing time</strong> and hourly wage into a{" "}
              <strong>labour cost per order</strong>.
            </p>
            <p>
              3️⃣ We add them together to get{" "}
              <strong>total packaging cost per order</strong> and divide by your average
              items per order to get <strong>packaging cost per item</strong>.
            </p>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">Results</h3>
            <span className="badge">Live</span>
          </div>

          <p className="sectionTitle" style={{ marginTop: 0 }}>
            Per order packaging cost
          </p>
          <div className="row">
            <span className="summaryLabel">Packaging materials per order</span>
            <span className="summaryValue" id="packMaterialsPerOrderOut">
              E£0.00
            </span>
          </div>
          <div className="row">
            <span className="summaryLabel">Fulfilment labour per order</span>
            <span className="summaryValue" id="labourPerOrderOut">
              E£0.00
            </span>
          </div>

          <div className="priceCard">
            <div className="priceRow">
              <span>Total packaging cost per order</span>
              <span className="priceValue" id="totalPackPerOrderOut">
                E£0.00
              </span>
            </div>
            <div className="priceRow">
              <span>Packaging cost per item (avg)</span>
              <span className="priceValue" id="packPerItemOut">
                E£0.00
              </span>
            </div>
          </div>

          <div className="divider">
            <p className="sectionTitle" style={{ marginTop: 0 }}>
              Monthly impact
            </p>
            <div className="row">
              <span className="summaryLabel">Orders per month</span>
              <span className="summaryValue" id="monthlyOrdersOut">
                0
              </span>
            </div>
            <div className="row">
              <span className="summaryLabel">Total monthly packaging spend</span>
              <span className="summaryValue" id="monthlyPackCostOut">
                E£0.00
              </span>
            </div>
          </div>

          <div className="explain">
            <p>
              <strong>How to use this with your other tools:</strong>
            </p>
            <p>
              • Take the <strong>packaging cost per item</strong> and add it into your{" "}
              <strong>Manufacturing Cost Tool</strong> or directly into your{" "}
              <strong>Pricing Calculator</strong> as part of COGS.
              <br />
            </p>
            <p>
              • If you upgrade your packaging (new box, dust bag, thank-you kit), update
              these numbers so your prices always match your real costs.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}



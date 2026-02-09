"use client";

import { useEffect, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import { useTranslations } from "next-intl";

type BookEntry = {
  id?: string;
  date?: string;
  description?: string;
  category: string;
  amount: number;
};

export default function IncomeStatementPage() {
  const t = useTranslations("incomeStatementPage");

  const currencyOptions = t.raw("currencyOptions") as {
    code: string;
    label: string;
    symbol: string;
  }[];

  const symbolMap = useMemo(() => {
    const map: Record<string, string> = {};
    currencyOptions.forEach((c) => {
      map[c.code] = c.symbol;
    });
    return map;
  }, [currencyOptions]);

  const currRef = useRef<string>(currencyOptions[0]?.code ?? "EGP");

  function val(id: string): number {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return 0;
    const v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function numFmt(n: number): string {
    if (!isFinite(n)) n = 0;
    return Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function money(n: number): string {
    const curr = currRef.current;
    return (symbolMap[curr] || curr) + numFmt(n);
  }

  function setMoney(id: string, n: number) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = money(n);
    }
  }

  function compute() {
    const units = val("units");
    const ppu = val("ppu");
    const salesManual = val("salesTotal");
    const sales = salesManual > 0 ? salesManual : units * ppu;

    const cogs =
      val("c_mat") +
      val("c_lab") +
      val("c_pack") +
      val("c_inb") +
      val("c_other");
    const gross = sales - cogs;

    const opex =
      val("o_mkt") +
      val("o_web") +
      val("o_rent") +
      val("o_sal") +
      val("o_other");
    const net = gross - opex;

    const drawings = val("drawings");
    const retained = net - drawings;

    setMoney("salesOut", sales);
    setMoney("cogsOut", cogs);
    setMoney("grossOut", gross);
    setMoney("opexOut", opex);
    setMoney("netOut", net);
    setMoney("retainedOut", retained);

    setMoney("s1", sales);
    setMoney("s2", cogs);
    setMoney("s3", gross);
    setMoney("s4", opex);
    setMoney("s5", net);
    setMoney("s6", drawings);
    setMoney("s7", retained);
  }

  useEffect(() => {
    const ids = [
      "units",
      "ppu",
      "salesTotal",
      "c_mat",
      "c_lab",
      "c_pack",
      "c_inb",
      "c_other",
      "o_mkt",
      "o_web",
      "o_rent",
      "o_sal",
      "o_other",
      "drawings",
    ];

    const listeners: { el: HTMLInputElement; fn: () => void }[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) {
        const fn = () => compute();
        el.addEventListener("input", fn);
        el.addEventListener("change", fn);
        listeners.push({ el, fn });
      }
    });

    const sel = document.getElementById("currency") as HTMLSelectElement | null;
    const handleCurrencyChange = () => {
      if (!sel) return;
      currRef.current = sel.value;
      compute();
    };
    if (sel) {
      sel.addEventListener("change", handleCurrencyChange);
    }

    compute();

    return () => {
      listeners.forEach(({ el, fn }) => {
        el.removeEventListener("input", fn);
        el.removeEventListener("change", fn);
      });
      if (sel) {
        sel.removeEventListener("change", handleCurrencyChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleImportFromBookkeeping() {
    try {
      const res = await fetch("/api/bookkeeping");

      if (res.status === 401) {
        alert(t("alerts.loginRequired"));
        return;
      }

      if (!res.ok) {
        alert(t("alerts.loadFailed"));
        return;
      }

      const json = await res.json();

      const entries: BookEntry[] = Array.isArray(json)
        ? json
        : Array.isArray(json.entries)
        ? json.entries
        : [];

      const totals: Record<string, number> = {
        sales: 0,
        c_mat: 0,
        c_lab: 0,
        c_pack: 0,
        c_inb: 0,
        c_other: 0,
        o_mkt: 0,
        o_web: 0,
        o_rent: 0,
        o_sal: 0,
        o_other: 0,
        drawings: 0,
      };

      for (const e of entries) {
        if (Object.prototype.hasOwnProperty.call(totals, e.category)) {
          totals[e.category] += Number(e.amount || 0);
        }
      }

      function setInput(id: string, value: number) {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) {
          el.value = value ? value.toFixed(2) : "0";
        }
      }

      setInput("salesTotal", totals.sales);

      setInput("c_mat", totals.c_mat);
      setInput("c_lab", totals.c_lab);
      setInput("c_pack", totals.c_pack);
      setInput("c_inb", totals.c_inb);
      setInput("c_other", totals.c_other);

      setInput("o_mkt", totals.o_mkt);
      setInput("o_web", totals.o_web);
      setInput("o_rent", totals.o_rent);
      setInput("o_sal", totals.o_sal);
      setInput("o_other", totals.o_other);

      setInput("drawings", totals.drawings);

      compute();
    } catch (err) {
      console.error(err);
      alert(t("alerts.serverError"));
    }
  }

  function handleExportPdf() {
    const doc = new jsPDF();

    const units = val("units");
    const ppu = val("ppu");
    const salesManual = val("salesTotal");
    const sales = salesManual > 0 ? salesManual : units * ppu;

    const cMat = val("c_mat");
    const cLab = val("c_lab");
    const cPack = val("c_pack");
    const cInb = val("c_inb");
    const cOther = val("c_other");

    const cogs = cMat + cLab + cPack + cInb + cOther;
    const gross = sales - cogs;

    const oMkt = val("o_mkt");
    const oWeb = val("o_web");
    const oRent = val("o_rent");
    const oSal = val("o_sal");
    const oOther = val("o_other");

    const opex = oMkt + oWeb + oRent + oSal + oOther;
    const net = gross - opex;

    const drawings = val("drawings");
    const retained = net - drawings;

    const currSymbol = symbolMap[currRef.current] || currRef.current;

    function fmt(n: number) {
      if (!isFinite(n)) n = 0;
      return currSymbol + n.toFixed(2);
    }

    let y = 20;

    doc.setFontSize(18);
    doc.text(t("pdf.title"), 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(t("pdf.periodLine"), 20, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(t("pdf.sales.title"), 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`${t("pdf.sales.revenue")}: ${fmt(sales)}`, 30, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(t("pdf.cogs.title"), 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`${t("pdf.cogs.materials")}: ${fmt(cMat)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.cogs.labor")}: ${fmt(cLab)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.cogs.packaging")}: ${fmt(cPack)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.cogs.inbound")}: ${fmt(cInb)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.cogs.other")}: ${fmt(cOther)}`, 30, y);
    y += 8;
    doc.text(`${t("pdf.cogs.total")}: ${fmt(cogs)}`, 30, y);
    y += 8;
    doc.text(`${t("pdf.cogs.gross")}: ${fmt(gross)}`, 30, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(t("pdf.opex.title"), 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`${t("pdf.opex.marketing")}: ${fmt(oMkt)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.opex.web")}: ${fmt(oWeb)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.opex.rent")}: ${fmt(oRent)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.opex.salaries")}: ${fmt(oSal)}`, 30, y);
    y += 6;
    doc.text(`${t("pdf.opex.other")}: ${fmt(oOther)}`, 30, y);
    y += 8;
    doc.text(`${t("pdf.opex.total")}: ${fmt(opex)}`, 30, y);
    y += 8;
    doc.text(`${t("pdf.opex.net")}: ${fmt(net)}`, 30, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(t("pdf.owner.title"), 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`${t("pdf.owner.drawings")}: ${fmt(drawings)}`, 30, y);
    y += 8;
    doc.text(`${t("pdf.owner.retained")}: ${fmt(retained)}`, 30, y);
    y += 10;

    doc.save("income-statement.pdf");
  }

  return (
    <>
      <main className="income-page">
        <h1>{t("title")}</h1>

        <div className="toolbar">
          <label htmlFor="currency">{t("toolbar.currency")}</label>
          <select id="currency" defaultValue={currencyOptions[0]?.code ?? "EGP"}>
            {currencyOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="muted">{t("toolbar.hint")}</span>

          <button
            type="button"
            onClick={handleImportFromBookkeeping}
            className="btnPrimary"
            style={{ fontSize: 12, padding: "6px 12px", borderRadius: 9999 }}
          >
            {t("toolbar.import")}
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="btnGhost"
            style={{ fontSize: 12, padding: "6px 12px", borderRadius: 9999 }}
          >
            {t("toolbar.download")}
          </button>
        </div>

        <p className="sub">{t("flow")}</p>

        <div className="grid">
          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("sales.title")}</h3>
              <span className="badge">{t("sales.badge")}</span>
            </div>
            <div className="twoCol">
              <div className="row">
                <label>{t("sales.units")}</label>
                <input id="units" type="number" step="1" defaultValue={0} />
              </div>
              <div className="row">
                <label>{t("sales.ppu")}</label>
                <input id="ppu" type="number" step="0.01" defaultValue={0} />
              </div>
            </div>
            <div className="row">
              <label>{t("sales.orTotal")}</label>
              <input id="salesTotal" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row total">
              <label>{t("sales.revenue")}</label>
              <span id="salesOut">E£0.00</span>
            </div>
            <p className="muted">{t("sales.note")}</p>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("cogs.title")}</h3>
              <span className="badge">{t("cogs.badge")}</span>
            </div>
            <div className="row">
              <label>{t("cogs.materials")}</label>
              <input id="c_mat" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("cogs.labor")}</label>
              <input id="c_lab" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("cogs.packaging")}</label>
              <input id="c_pack" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("cogs.inbound")}</label>
              <input id="c_inb" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("cogs.other")}</label>
              <input id="c_other" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row total">
              <label>{t("cogs.total")}</label>
              <span id="cogsOut">E£0.00</span>
            </div>
            <div className="priceCard">
              <div className="priceRow">
                <span>{t("cogs.gross")}</span>
                <span className="priceValue" id="grossOut">
                  E£0.00
                </span>
              </div>
            </div>
            <p className="muted">{t("cogs.note")}</p>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("opex.title")}</h3>
              <span className="badge">{t("opex.badge")}</span>
            </div>
            <div className="row">
              <label>{t("opex.marketing")}</label>
              <input id="o_mkt" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("opex.web")}</label>
              <input id="o_web" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("opex.rent")}</label>
              <input id="o_rent" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("opex.salaries")}</label>
              <input id="o_sal" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row">
              <label>{t("opex.other")}</label>
              <input id="o_other" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="row total">
              <label>{t("opex.total")}</label>
              <span id="opexOut">E£0.00</span>
            </div>
            <div className="priceCard">
              <div className="priceRow">
                <span>{t("opex.net")}</span>
                <span className="priceValue" id="netOut">
                  E£0.00
                </span>
              </div>
            </div>
            <p className="muted">{t("opex.note")}</p>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("owner.title")}</h3>
              <span className="badge">{t("owner.badge")}</span>
            </div>
            <div className="row">
              <label>{t("owner.drawings")}</label>
              <input id="drawings" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="priceCard">
              <div className="priceRow">
                <span>{t("owner.retained")}</span>
                <span className="priceValue" id="retainedOut">
                  E£0.00
                </span>
              </div>
            </div>
            <div className="explain" id="explainBox">
              <p>
                <strong>{t("owner.explain.drawingsTitle")}</strong>{" "}
                {t("owner.explain.drawingsBody")}
              </p>
              <p>
                <strong>{t("owner.explain.retainedTitle")}</strong>{" "}
                {t("owner.explain.retainedBody")}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="title">{t("summary.title")}</h3>
              <span className="pill">{t("summary.badge")}</span>
            </div>
            <div className="row">
              <label>{t("summary.sales")}</label>
              <span id="s1">E£0.00</span>
            </div>
            <div className="row">
              <label>{t("summary.cogs")}</label>
              <span id="s2">E£0.00</span>
            </div>
            <div className="row">
              <label>{t("summary.gross")}</label>
              <span id="s3">E£0.00</span>
            </div>
            <div className="row">
              <label>{t("summary.opex")}</label>
              <span id="s4">E£0.00</span>
            </div>
            <div className="row">
              <label>{t("summary.net")}</label>
              <span id="s5">E£0.00</span>
            </div>
            <div className="row">
              <label>{t("summary.drawings")}</label>
              <span id="s6">E£0.00</span>
            </div>
            <div className="row total">
              <label>{t("summary.retained")}</label>
              <span id="s7">E£0.00</span>
            </div>
          </div>
        </div>
      </main>

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
        .income-page {
          min-height: 100vh;
          margin: 0;
          padding: 28px;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
            Roboto, Helvetica, Arial;
          background:
            radial-gradient(1200px 800px at 0% 0%, #251b63 0%, transparent 60%),
            radial-gradient(
              1200px 800px at 100% 0%,
              #0b6c9a33 0%,
              transparent 60%
            ),
            var(--bg);
          color: var(--text);
          line-height: 1.45;
        }
        .income-page h1 {
          margin: 0 0 8px 0;
          font-size: 26px;
        }
        .sub {
          color: var(--muted);
          margin-top: 0;
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
          margin: -4px 0 10px 0;
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
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 10px 0;
        }
        label {
          font-size: 14px;
          color: #cfd3ff;
        }
        input[type="number"] {
          width: 100px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: #0e1230;
          color: var(--text);
        }
        input[type="number"]:focus {
          border-color: #6f84ff;
          box-shadow: 0 0 0 3px rgba(127, 152, 255, 0.2);
          outline: none;
        }
        .muted {
          color: var(--muted);
          font-size: 12px;
        }
        .total {
          font-weight: 700;
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
        .explain {
          font-size: 12px;
          color: #cfd3ff;
          background: rgba(255, 255, 255, 0.05);
          padding: 10px;
          border-radius: 12px;
          border: 1px solid var(--border);
          margin-top: 10px;
          line-height: 1.5;
        }
        .pill {
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid var(--border);
          background: rgba(39, 217, 128, 0.12);
          color: #aef7d0;
        }
        .twoCol {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          margin: 8px 0 18px 0;
          flex-wrap: wrap;
        }
        select {
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #0e1230;
          color: var(--text);
        }
        .btnPrimary {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #fff;
          border: none;
          cursor: pointer;
        }
        .btnGhost {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

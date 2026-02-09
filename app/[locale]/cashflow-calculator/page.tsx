"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function CashflowCalculatorPage() {
  const t = useTranslations("cashflowCalculatorPage");

  const currencies = t.raw("currencyOptions") as {
    code: string;
    label: string;
    symbol: string;
  }[];

  const months = t.raw("months") as string[];

  const [currency, setCurrency] = useState(currencies[0]?.code ?? "EGP");
  const [month, setMonth] = useState(months[0] ?? "");

  const [opening, setOpening] = useState("0");
  const [inflows, setInflows] = useState("0");
  const [outflows, setOutflows] = useState("0");

  const symbol = useMemo(() => {
    const found = currencies.find((c) => c.code === currency);
    return found?.symbol ?? "";
  }, [currency, currencies]);

  const parseNumber = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  };

  const openingNum = parseNumber(opening);
  const inflowsNum = parseNumber(inflows);
  const outflowsNum = parseNumber(outflows);

  const net = inflowsNum - outflowsNum;
  const closing = openingNum + net;

  const formatMoney = (n: number) => {
    const safe = Number.isFinite(n) ? n : 0;
    return (
      symbol +
      safe.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "28px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        background:
          "radial-gradient(1200px 800px at 0% 0%, #251b63 0%, transparent 60%), " +
          "radial-gradient(1200px 800px at 100% 0%, #0b6c9a33 0%, transparent 60%), " +
          "#0f1226",
        color: "#e9ecff",
        lineHeight: 1.45,
      }}
    >
      <h1 style={{ margin: "0 0 8px 0", fontSize: 26 }}>
        {t("title")}
      </h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "8px 0 18px 0",
          flexWrap: "wrap",
        }}
      >
        <label htmlFor="currency" style={{ fontSize: 14, color: "#a4a9c8" }}>
          {t("labels.currency")}
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0e1230",
            color: "#e9ecff",
          }}
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <label htmlFor="month" style={{ fontSize: 14, color: "#a4a9c8" }}>
          {t("labels.month")}
        </label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0e1230",
            color: "#e9ecff",
          }}
        >
          {months.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <p style={{ color: "#a4a9c8", margin: "6px 0 18px 0" }}>
        <strong>{t("formula.opening")}</strong> +{" "}
        <strong>{t("formula.net")}</strong> ={" "}
        <strong>{t("formula.closing")}</strong>.
      </p>

      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
            borderRadius: 16,
            padding: 18,
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              margin: "-4px 0 10px 0",
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                letterSpacing: 0.2,
                background:
                  "linear-gradient(90deg, #7c5cff, #00d4ff)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {t("card.title")}
            </h3>
            <span
              style={{
                fontSize: 12,
                color: "#cfd3ff",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "2px 10px",
                borderRadius: 999,
                background: "rgba(124,92,255,0.12)",
              }}
            >
              {t("card.badge")}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              margin: "10px 0",
            }}
          >
            <label htmlFor="opening" style={{ fontSize: 14, color: "#cfd3ff" }}>
              {t("inputs.opening")}
            </label>
            <input
              id="opening"
              type="number"
              step="0.01"
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              style={{
                width: 140,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0e1230",
                color: "#e9ecff",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              margin: "10px 0",
            }}
          >
            <label htmlFor="inflows" style={{ fontSize: 14, color: "#cfd3ff" }}>
              {t("inputs.inflows")}
            </label>
            <input
              id="inflows"
              type="number"
              step="0.01"
              value={inflows}
              onChange={(e) => setInflows(e.target.value)}
              style={{
                width: 140,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0e1230",
                color: "#e9ecff",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              margin: "10px 0",
            }}
          >
            <label htmlFor="outflows" style={{ fontSize: 14, color: "#cfd3ff" }}>
              {t("inputs.outflows")}
            </label>
            <input
              id="outflows"
              type="number"
              step="0.01"
              value={outflows}
              onChange={(e) => setOutflows(e.target.value)}
              style={{
                width: 140,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0e1230",
                color: "#e9ecff",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(124,92,255,0.25), rgba(0,212,255,0.25))",
              borderRadius: 16,
              padding: 14,
              marginTop: 10,
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                margin: "6px 0",
                fontSize: 18,
              }}
            >
              <span>
                <strong>{t("summary.net.title")}</strong>{" "}
                <span style={{ fontSize: 14, color: "#d0d3ff" }}>
                  {t("summary.net.note")}
                </span>
              </span>
              <span style={{ fontWeight: 800 }} id="net">
                {formatMoney(net)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                margin: "6px 0",
                fontSize: 18,
              }}
            >
              <span>{t("summary.closing.title")}</span>
              <span style={{ fontWeight: 800 }} id="closing">
                {formatMoney(closing)}
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#cfd3ff",
              background: "rgba(255,255,255,0.05)",
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              marginTop: 10,
              lineHeight: 1.5,
            }}
          >
            <p>
              <strong>{t("help.q1.title")}</strong> {t("help.q1.body")}
            </p>
            <p>
              <strong>{t("help.q2.title")}</strong> {t("help.q2.body")}
            </p>
            <p>
              <strong>{t("help.q3.title")}</strong> {t("help.q3.body")}
            </p>
            <p>
              <strong>{t("help.q4.title")}</strong> {t("help.q4.body")}
            </p>
            <p>
              <strong>{t("help.q5.title")}</strong> {t("help.q5.body")}
            </p>
            <p>
              <strong>{t("help.q6.title")}</strong>{" "}
              <em>{t("help.q6.body")}</em>
            </p>
            <p>
              <strong>{t("help.q7.title")}</strong> {t("help.q7.body")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

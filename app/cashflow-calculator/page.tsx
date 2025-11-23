"use client";

import { useState } from "react";

const CURRENCY_SYMBOLS: Record<string, string> = {
  EGP: "E£",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SAR: "﷼",
};

export default function CashflowCalculatorPage() {
  const [currency, setCurrency] = useState("EGP");
  const [month, setMonth] = useState("January");

  const [opening, setOpening] = useState("0");
  const [inflows, setInflows] = useState("0");
  const [outflows, setOutflows] = useState("0");

  const symbol = CURRENCY_SYMBOLS[currency] || currency;

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
        RunwayToRevenue – Monthly Cash Flow Calculator
      </h1>

      {/* Toolbar: currency + month */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "8px 0 18px 0",
          flexWrap: "wrap",
        }}
      >
        <label
          htmlFor="currency"
          style={{ fontSize: 14, color: "#a4a9c8" }}
        >
          Currency
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
          <option value="EGP">EGP – Egyptian Pound</option>
          <option value="USD">USD – US Dollar</option>
          <option value="EUR">EUR – Euro</option>
          <option value="GBP">GBP – British Pound</option>
          <option value="AED">AED – UAE Dirham</option>
          <option value="SAR">SAR – Saudi Riyal</option>
        </select>

        <label htmlFor="month" style={{ fontSize: 14, color: "#a4a9c8" }}>
          Month
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
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
      </div>

      <p
        style={{
          color: "#a4a9c8",
          margin: "6px 0 18px 0",
        }}
      >
        <strong>Opening Cash</strong> + <strong>Net Cash Flow (Inflows − Outflows)</strong> ={" "}
        <strong>Closing Cash</strong>.
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
          {/* Card Header */}
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
              Cash Flow Inputs
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
              For Selected Month
            </span>
          </div>

          {/* Opening Cash */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              margin: "10px 0",
            }}
          >
            <label
              htmlFor="opening"
              style={{ fontSize: 14, color: "#cfd3ff" }}
            >
              Opening Cash
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

          {/* Inflows */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              margin: "10px 0",
            }}
          >
            <label
              htmlFor="inflows"
              style={{ fontSize: 14, color: "#cfd3ff" }}
            >
              Total Inflows
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

          {/* Outflows */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              margin: "10px 0",
            }}
          >
            <label
              htmlFor="outflows"
              style={{ fontSize: 14, color: "#cfd3ff" }}
            >
              Total Outflows
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

          {/* Summary card */}
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
                <strong>Net Cash Flow</strong>{" "}
                <span style={{ fontSize: 14, color: "#d0d3ff" }}>
                  (Total Inflows − Total Outflows)
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
              <span>Closing Cash</span>
              <span style={{ fontWeight: 800 }} id="closing">
                {formatMoney(closing)}
              </span>
            </div>
          </div>

          {/* Explanation */}
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
              <strong>What is monthly cash flow?</strong> Cash flow = cash
              received − cash paid. It shows if your business generated or lost
              cash in this month.
            </p>
            <p>
              <strong>Opening Cash:</strong> 💡 This is the amount of cash you
              already have at the start of the month — usually the closing cash
              from the previous month.
            </p>
            <p>
              <strong>Closing Cash:</strong> 🧾 The closing cash shows how much
              money your business has left at the end of the month — after all
              inflows and outflows are accounted for.
            </p>
            <p>
              <strong>Total Inflows:</strong> 💰 This represents all the actual
              cash your business received during the month — like cash from
              sales, investor funding, or any other money that physically
              entered your account or cash box.
            </p>
            <p>
              <strong>Total Outflows:</strong> 💸 This represents all the actual
              cash your business paid out during the month — such as product
              costs, salaries, marketing, rent, or any expense that was truly
              paid in cash or deducted from your bank balance.
            </p>
            <p>
              <strong>Important:</strong> These numbers only track{" "}
              <em>real cash movement</em> — the actual money that went in and
              out during this month.
            </p>
            <p>
              <strong>How to use:</strong> Enter all inflows (sales, other
              income) and outflows (COGS, salaries, marketing, taxes, owner
              pay). This calculator gives your net and closing cash instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

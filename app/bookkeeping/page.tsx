"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BookEntry = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
};

type Totals = {
  sales: number;
  c_mat: number;
  c_lab: number;
  c_pack: number;
  c_inb: number;
  c_other: number;
  o_mkt: number;
  o_web: number;
  o_rent: number;
  o_sal: number;
  o_other: number;
  drawings: number;
};

const SYMBOL = "E£";

const initialTotals: Totals = {
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

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    sales: "Sales revenue",
    c_mat: "COGS – Materials / Fabric",
    c_lab: "COGS – Labor / Production",
    c_pack: "COGS – Packaging & Labels",
    c_inb: "COGS – Inbound Shipping",
    c_other: "COGS – Other Product Costs",
    o_mkt: "OPEX – Marketing / Ads",
    o_web: "OPEX – Website & Apps",
    o_rent: "OPEX – Rent / Utilities",
    o_sal: "OPEX – Salaries / Freelancers",
    o_other: "OPEX – Other Operating Expenses",
    drawings: "Owner's Withdrawals",
  };
  return map[cat] || cat;
}

export default function BookkeepingPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<BookEntry[]>([]);
  const [totals, setTotals] = useState<Totals>(initialTotals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("sales");
  const [amount, setAmount] = useState("");

  // Load from backend on mount
  useEffect(() => {
  async function load() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/bookkeeping");
      if (!res.ok) {
        setError("Could not load your bookkeeping data.");
        return;
      }

      const json = await res.json();

      // ✅ our API returns { entries: [...] }
      const data: BookEntry[] = Array.isArray(json.entries)
        ? json.entries
        : [];

      // ✅ this is the only place we set transactions
      setTransactions(data);
      recomputeSummary(data);
    } catch (err) {
      console.error(err);
      setError("Server error while loading bookkeeping.");
    } finally {
      setLoading(false);
    }
  }

  load();
}, []); // <-- no router in the dependency array


  function recomputeSummary(list: BookEntry[]) {
    const t: Totals = { ...initialTotals };
    for (const tx of list) {
      if (tx.category in t) {
        // @ts-ignore – we know category matches keys
        t[tx.category] += tx.amount;
      }
    }
    setTotals(t);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(amount);
    if (!date || !description.trim() || !amount || isNaN(amountNum)) {
      setError("Please fill date, description, and a valid amount.");
      return;
    }

    const entry: BookEntry = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(36) + Math.random().toString(36).slice(2),
      date,
      description: description.trim(),
      category,
      amount: amountNum,
    };

    // 1) Optimistic UI
    setTransactions((prev) => {
      const updated = [...prev, entry];
      recomputeSummary(updated);
      return updated;
    });

    // 2) Save to backend
    try {
      const res = await fetch("/api/bookkeeping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry }),
      });

      if (!res.ok) {
        console.error("Failed to save entry:", await res.text());
        setError("Could not save entry to server.");
      } else {
        // reset some fields
        setAmount("");
        setDescription("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while saving entry.");
    }
  }

  async function handleClearAll() {
    if (!confirm("Clear all bookkeeping transactions?")) return;

    // Optional: if you later add DELETE /api/bookkeeping, call it here.
    // For now we just clear in memory, you can upgrade backend later.
    setTransactions([]);
    recomputeSummary([]);
    // TODO (later): call DELETE /api/bookkeeping to clear server data.
  }

  return (
    <main className="rtr-bookkeeping-page">
      {/* Scoped styles based on your CodePen CSS */}
      <style jsx>{`
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
        .rtr-bookkeeping-page {
          min-height: 100vh;
          padding: 28px;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
            Roboto, Helvetica, Arial;
          background:
            radial-gradient(1200px 800px at 0% 0%, #251b63 0%, transparent 60%),
            radial-gradient(1200px 800px at 100% 0%, #0b6c9a33 0%, transparent 60%),
            var(--bg);
          color: var(--text);
          line-height: 1.45;
        }
        .rtr-bookkeeping-page h1 {
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
          grid-template-columns: 2fr 1.4fr;
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
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
        .pill {
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid var(--border);
          background: rgba(39, 217, 128, 0.12);
          color: #aef7d0;
        }
        label {
          font-size: 13px;
          color: #cfd3ff;
          display: block;
          margin-bottom: 4px;
        }
        input,
        select {
          width: 100%;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #0e1230;
          color: var(--text);
          font-size: 13px;
          outline: none;
        }
        input:focus,
        select:focus {
          border-color: #6f84ff;
          box-shadow: 0 0 0 3px rgba(127, 152, 255, 0.2);
        }
        .muted {
          color: var(--muted);
          font-size: 12px;
        }
        .formGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
        }
        button {
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        .btnPrimary {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #fff;
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }
        .btnPrimary:hover {
          opacity: 0.9;
        }
        .btnGhost {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th,
        td {
          padding: 6px 8px;
          text-align: left;
        }
        th {
          color: #cfd3ff;
          border-bottom: 1px solid var(--border);
          font-weight: 500;
        }
        tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.02);
        }
        .textRight {
          text-align: right;
        }
        .summaryRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 6px 0;
          font-size: 14px;
        }
        .summaryLabel {
          color: #cfd3ff;
        }
        .summaryValue {
          font-weight: 600;
        }
        .sectionTitle {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
          margin-top: 12px;
        }
        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          margin: 8px 0 18px 0;
          flex-wrap: wrap;
        }
      `}</style>

      <h1>RunwayToRevenue – Bookkeeping</h1>
      <p className="sub">
        Every transaction goes here. Later, your Income Statement calculator will
        pull totals for: Sales, COGS (materials, labor, packaging, inbound,
        other), OPEX (marketing, website, rent, salaries, other), and Owner&apos;s
        withdrawals.
      </p>

      <div className="toolbar">
        <span className="muted">
          Currency is visual only – match it with your Income Statement currency
          (EGP / USD / etc.).
        </span>
      </div>

      <div className="grid">
        {/* LEFT: add + list transactions */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">Bookkeeping Entries</h3>
            <span className="badge">Detail</span>
          </div>

          {/* Add transaction form */}
          <form className="formGrid" autoComplete="off" onSubmit={handleAdd}>
            <div>
              <label htmlFor="txDate">Date</label>
              <input
                type="date"
                id="txDate"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="txDesc">Description</label>
              <input
                type="text"
                id="txDesc"
                placeholder="Example: January drop sales"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="txCategory">Category</label>
              <select
                id="txCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="sales">Sales revenue</option>

                <option value="c_mat">COGS – Materials / Fabric</option>
                <option value="c_lab">COGS – Labor / Production</option>
                <option value="c_pack">COGS – Packaging & Labels</option>
                <option value="c_inb">COGS – Inbound Shipping</option>
                <option value="c_other">COGS – Other Product Costs</option>

                <option value="o_mkt">OPEX – Marketing / Ads</option>
                <option value="o_web">OPEX – Website & Apps</option>
                <option value="o_rent">OPEX – Rent / Utilities</option>
                <option value="o_sal">OPEX – Salaries / Freelancers</option>
                <option value="o_other">OPEX – Other Operating Expenses</option>

                <option value="drawings">Owner&apos;s Withdrawals</option>
              </select>
            </div>
            <div>
              <label htmlFor="txAmount">Amount</label>
              <input
                type="number"
                id="txAmount"
                step="0.01"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label>&nbsp;</label>
              <button
                type="submit"
                className="btnPrimary"
                style={{ width: "100%" }}
              >
                Add Transaction
              </button>
            </div>
          </form>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className="muted">
              These are the raw entries that will feed your Income Statement.
            </span>
            <button
              type="button"
              className="btnGhost"
              onClick={handleClearAll}
            >
              Clear all
            </button>
          </div>

          {/* Transaction table */}
          <div
            style={{
              marginTop: 14,
              maxHeight: 340,
              overflow: "auto",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>Date</th>
                  <th style={{ width: "35%" }}>Description</th>
                  <th style={{ width: "25%" }}>Category</th>
                  <th style={{ width: "15%" }} className="textRight">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="muted">
                      Loading...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="muted">
                      No transactions yet. Add your first one above.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td>{categoryLabel(t.category)}</td>
                      <td className="textRight">{money(t.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {error && (
            <p style={{ marginTop: 8 }} className="muted" aria-live="polite">
              {error}
            </p>
          )}
        </div>

        {/* RIGHT: summary that matches Income Statement */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="title">Summary for Income Statement</h3>
            <span className="pill">Matches calculator</span>
          </div>

          <p className="muted">
            Copy these totals into the matching fields in your Income Statement
            calculator (or later, this will import automatically).
          </p>

          <div className="sectionTitle">Sales</div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Sales Revenue (use in Sales Total)
            </span>
            <span className="summaryValue">{money(totals.sales)}</span>
          </div>

          <div className="sectionTitle">COGS (Cost of Sales)</div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Materials / Fabric (c_mat)
            </span>
            <span className="summaryValue">{money(totals.c_mat)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Labor / Production (c_lab)
            </span>
            <span className="summaryValue">{money(totals.c_lab)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Packaging & Labels (c_pack)
            </span>
            <span className="summaryValue">{money(totals.c_pack)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Inbound Shipping (c_inb)
            </span>
            <span className="summaryValue">{money(totals.c_inb)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Other Product Costs (c_other)
            </span>
            <span className="summaryValue">{money(totals.c_other)}</span>
          </div>

          <div className="sectionTitle">Operating Expenses (OPEX)</div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Marketing / Ads (o_mkt)
            </span>
            <span className="summaryValue">{money(totals.o_mkt)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Website & Apps (o_web)
            </span>
            <span className="summaryValue">{money(totals.o_web)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Rent / Utilities (o_rent)
            </span>
            <span className="summaryValue">{money(totals.o_rent)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Salaries / Freelancers (o_sal)
            </span>
            <span className="summaryValue">{money(totals.o_sal)}</span>
          </div>
          <div className="summaryRow">
            <span className="summaryLabel">Other OPEX (o_other)</span>
            <span className="summaryValue">{money(totals.o_other)}</span>
          </div>

          <div className="sectionTitle">Owner</div>
          <div className="summaryRow">
            <span className="summaryLabel">
              Owner&apos;s Withdrawals (drawings)
            </span>
            <span className="summaryValue">{money(totals.drawings)}</span>
          </div>

          <p className="muted" style={{ marginTop: 14 }}>
            For now you can manually copy these into the Income Statement
            calculator:
            <br />
            Sales → "Sales Total", COGS → each COGS field, OPEX → each OPEX
            field, Withdrawals → "Owner&apos;s Withdrawals".
            <br />
            Later we can connect this directly so the import is automatic.
          </p>
        </div>
      </div>
    </main>
  );
}

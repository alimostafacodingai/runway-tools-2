"use client";

import React, { useEffect, useState } from "react";

type BookEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  amount: number;
};

type Totals = Record<string, number>;

const CATEGORIES: { id: string; label: string }[] = [
  { id: "sales", label: "Sales revenue (use in Sales Total)" },

  // COGS
  { id: "c_mat", label: "Materials / Fabric (c_mat)" },
  { id: "c_lab", label: "Labor / Production (c_lab)" },
  { id: "c_pack", label: "Packaging & Labels (c_pack)" },
  { id: "c_inb", label: "Inbound Shipping (c_inb)" },
  { id: "c_other", label: "Other Product Costs (c_other)" },

  // OPEX
  { id: "o_mkt", label: "Marketing / Ads (o_mkt)" },
  { id: "o_web", label: "Website & Apps (o_web)" },
  { id: "o_rent", label: "Rent (o_rent)" },
  { id: "o_salary", label: "Salaries & Staff (o_salary)" },
  { id: "o_other", label: "Other OPEX (o_other)" },

  // Owner
  { id: "owner", label: "Owner's withdrawals / drawings" },
];

function recomputeTotals(list: BookEntry[]): Totals {
  const totals: Totals = {};
  for (const tx of list) {
    const key = tx.category || "other";
    totals[key] = (totals[key] ?? 0) + tx.amount;
  }
  return totals;
}

function formatMoney(n: number | undefined): string {
  const value = n ?? 0;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function BookkeepingPage() {
  // Form state
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("sales");
  const [amount, setAmount] = useState("");

  // Data state
  const [transactions, setTransactions] = useState<BookEntry[]>([]);
  const [totals, setTotals] = useState<Totals>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from backend on mount
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/bookkeeping");
        if (!res.ok) {
          setError("Could not load your bookkeeping data.");
          return;
        }

        const json = await res.json();
        const data: BookEntry[] = Array.isArray(json.entries)
          ? json.entries
          : [];

        setTransactions(data);
        setTotals(recomputeTotals(data));
      } catch (err) {
        console.error("Error loading bookkeeping:", err);
        setError("Server error while loading bookkeeping.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amountNum = parseFloat(amount);
    if (!date || !description.trim() || Number.isNaN(amountNum)) {
      setError("Please fill date, description, and a valid amount.");
      return;
    }

    const entry: BookEntry = {
      id:
        typeof crypto !== "undefined" && (crypto as any).randomUUID
          ? (crypto as any).randomUUID()
          : Date.now().toString(36) + Math.random().toString(36).slice(2),
      date,
      description: description.trim(),
      category,
      amount: amountNum,
    };

    // 1) Optimistic UI
    setTransactions(prev => {
      const updated = [...prev, entry];
      setTotals(recomputeTotals(updated));
      return updated;
    });

    // 2) Save to backend
    try {
      const res = await fetch("/api/bookkeeping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      if (!res.ok) {
        console.error("Failed to save entry:", await res.text());
        setError("Could not save entry to server (but it was added locally).");
      } else {
        // all good
      }

      // reset form
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Server error while saving entry:", err);
      setError("Server error while saving entry (but it was added locally).");
    }
  }

  function handleClearAll() {
    if (!confirm("Clear all bookkeeping transactions (local view only)?")) {
      return;
    }
    setTransactions([]);
    setTotals({});
    // If you want, you can later add a DELETE /api/bookkeeping route
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <section className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          RunwayToRevenue – Bookkeeping
        </h1>
        <p className="text-zinc-300 max-w-3xl">
          Every transaction goes here. Later, your Income Statement calculator
          will pull totals for Sales, COGS, OPEX, and Owner&apos;s withdrawals.
        </p>
        {error && (
          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}
        {loading && (
          <p className="mt-2 text-sm text-zinc-400">
            Loading your bookkeeping…
          </p>
        )}
      </section>

      <section className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        {/* Left: form + table */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-6">
          <h2 className="text-xl font-semibold mb-1">Add transaction</h2>

          <form
            onSubmit={handleAdd}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Date</label>
              <input
                type="date"
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm text-zinc-400">Description</label>
              <input
                type="text"
                placeholder="Example: January drop sales"
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Amount</label>
              <input
                type="number"
                step="0.01"
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm text-zinc-400">Category</label>
              <select
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="sm:col-span-2 lg:col-span-1 mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition"
            >
              Add Transaction
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <h3 className="text-sm font-medium text-zinc-300">
              These are the raw entries that feed your Income Statement.
            </h3>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear all (local)
            </button>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td
                      className="px-3 py-3 text-zinc-500 text-sm"
                      colSpan={4}
                    >
                      No transactions yet. Add your first one above.
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr
                      key={tx.id}
                      className="border-t border-zinc-800 hover:bg-zinc-900/60"
                    >
                      <td className="px-3 py-2 text-zinc-300">
                        {tx.date}
                      </td>
                      <td className="px-3 py-2 text-zinc-200">
                        {tx.description}
                      </td>
                      <td className="px-3 py-2 text-zinc-400 text-xs">
                        {
                          CATEGORIES.find(c => c.id === tx.category)
                            ?.label ?? tx.category
                        }
                      </td>
                      <td className="px-3 py-2 text-right">
                        {formatMoney(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: summary */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Summary (matches Income Statement)</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-zinc-300 font-medium mb-1">SALES</h3>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Sales Revenue (use in Sales Total)</span>
                <span className="font-mono text-zinc-100">
                  {formatMoney(totals["sales"])}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-zinc-300 font-medium mb-1">
                COGS (COST OF SALES)
              </h3>
              {[
                "c_mat",
                "c_lab",
                "c_pack",
                "c_inb",
                "c_other",
              ].map(id => {
                const label =
                  CATEGORIES.find(c => c.id === id)?.label ?? id;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between text-zinc-400"
                  >
                    <span>{label}</span>
                    <span className="font-mono text-zinc-100">
                      {formatMoney(totals[id])}
                    </span>
                  </div>
                );
              })}
            </div>

            <div>
              <h3 className="text-zinc-300 font-medium mb-1">
                OPERATING EXPENSES (OPEX)
              </h3>
              {["o_mkt", "o_web", "o_rent", "o_salary", "o_other"].map(
                id => {
                  const label =
                    CATEGORIES.find(c => c.id === id)?.label ?? id;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between text-zinc-400"
                    >
                      <span>{label}</span>
                      <span className="font-mono text-zinc-100">
                        {formatMoney(totals[id])}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <div>
              <h3 className="text-zinc-300 font-medium mb-1">
                OWNER
              </h3>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Owner&apos;s withdrawals / drawings</span>
                <span className="font-mono text-zinc-100">
                  {formatMoney(totals["owner"])}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

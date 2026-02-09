"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type BookEntry = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
};

type Totals = Record<string, number>;

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
  const t = useTranslations("bookkeepingPage");

  const categories = useMemo(
    () => [
      { id: "sales", label: t("categories.sales") },
      { id: "c_mat", label: t("categories.c_mat") },
      { id: "c_lab", label: t("categories.c_lab") },
      { id: "c_pack", label: t("categories.c_pack") },
      { id: "c_inb", label: t("categories.c_inb") },
      { id: "c_other", label: t("categories.c_other") },
      { id: "o_mkt", label: t("categories.o_mkt") },
      { id: "o_web", label: t("categories.o_web") },
      { id: "o_rent", label: t("categories.o_rent") },
      { id: "o_salary", label: t("categories.o_salary") },
      { id: "o_other", label: t("categories.o_other") },
      { id: "drawings", label: t("categories.drawings") },
    ],
    [t]
  );

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("sales");
  const [amount, setAmount] = useState("");

  const [transactions, setTransactions] = useState<BookEntry[]>([]);
  const [totals, setTotals] = useState<Totals>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/bookkeeping");
        if (!res.ok) {
          setError(t("errors.loadFailed"));
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
        setError(t("errors.serverLoad"));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [t]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amountNum = parseFloat(amount);
    if (!date || !description.trim() || Number.isNaN(amountNum)) {
      setError(t("errors.validation"));
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

    setTransactions((prev) => {
      const updated = [...prev, entry];
      setTotals(recomputeTotals(updated));
      return updated;
    });

    try {
      const res = await fetch("/api/bookkeeping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      if (!res.ok) {
        console.error("Failed to save entry:", await res.text());
        setError(t("errors.saveFailed"));
      }

      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Server error while saving entry:", err);
      setError(t("errors.serverSave"));
    }
  }

  function handleClearAll() {
    if (!confirm(t("confirm.clearAll"))) {
      return;
    }
    setTransactions([]);
    setTotals({});
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <section className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {t("title")}
        </h1>
        <p className="text-zinc-300 max-w-3xl">{t("subtitle")}</p>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {loading && (
          <p className="mt-2 text-sm text-zinc-400">{t("loading")}</p>
        )}
      </section>

      <section className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-6">
          <h2 className="text-xl font-semibold mb-1">{t("form.title")}</h2>

          <form
            onSubmit={handleAdd}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">
                {t("form.date")}
              </label>
              <input
                type="date"
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm text-zinc-400">
                {t("form.description")}
              </label>
              <input
                type="text"
                placeholder={t("form.descriptionPlaceholder")}
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">
                {t("form.amount")}
              </label>
              <input
                type="number"
                step="0.01"
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm text-zinc-400">
                {t("form.category")}
              </label>
              <select
                className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
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
              {t("form.cta")}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <h3 className="text-sm font-medium text-zinc-300">
              {t("table.note")}
            </h3>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-400 hover:text-red-300"
            >
              {t("table.clear")}
            </button>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-3 py-2 text-left">{t("table.headers.date")}</th>
                  <th className="px-3 py-2 text-left">
                    {t("table.headers.description")}
                  </th>
                  <th className="px-3 py-2 text-left">
                    {t("table.headers.category")}
                  </th>
                  <th className="px-3 py-2 text-right">
                    {t("table.headers.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-zinc-500 text-sm" colSpan={4}>
                      {t("table.empty")}
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-t border-zinc-800 hover:bg-zinc-900/60"
                    >
                      <td className="px-3 py-2 text-zinc-300">{tx.date}</td>
                      <td className="px-3 py-2 text-zinc-200">
                        {tx.description}
                      </td>
                      <td className="px-3 py-2 text-zinc-400 text-xs">
                        {categories.find((c) => c.id === tx.category)?.label ??
                          tx.category}
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

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("summary.title")}</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-zinc-300 font-medium mb-1">
                {t("summary.sales.title")}
              </h3>
              <div className="flex items-center justify-between text-zinc-400">
                <span>{t("summary.sales.label")}</span>
                <span className="font-mono text-zinc-100">
                  {formatMoney(totals["sales"])}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-zinc-300 font-medium mb-1">
                {t("summary.cogs.title")}
              </h3>
              {["c_mat", "c_lab", "c_pack", "c_inb", "c_other"].map((id) => {
                const label = categories.find((c) => c.id === id)?.label ?? id;
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
                {t("summary.opex.title")}
              </h3>
              {["o_mkt", "o_web", "o_rent", "o_salary", "o_other"].map((id) => {
                const label = categories.find((c) => c.id === id)?.label ?? id;
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
                {t("summary.owner.title")}
              </h3>
              <div className="flex items-center justify-between text-zinc-400">
                <span>{t("summary.owner.label")}</span>
                <span className="font-mono text-zinc-100">
                  {formatMoney(totals["drawings"])}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

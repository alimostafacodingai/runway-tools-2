"use client";

import { useEffect, useMemo, useState } from "react";

type Category =
  | "sales"
  | "c_mat"
  | "c_lab"
  | "c_pack"
  | "c_inb"
  | "c_other"
  | "o_mkt"
  | "o_web"
  | "o_rent"
  | "o_sal"
  | "o_other"
  | "drawings";

type Transaction = {
  id: string;
  date: string; // "YYYY-MM-DD"
  description: string;
  category: Category;
  amount: number;
};

type Totals = {
  revenue: number;
  cogs: number;
  opex: number;
  grossProfit: number;
  netProfit: number;
  drawings: number;
  retainedProfit: number;
};

export default function RunwayDashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load bookkeeping data for the LOGGED IN USER
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/bookkeeping");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load bookkeeping data");
        }

        const data = await res.json();

        // Support both shapes: [] OR { items: [] } OR { transactions: [] }
        const items: Transaction[] = Array.isArray(data)
          ? data
          : data.items || data.transactions || [];

        setTransactions(items || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const monthLabel = now.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  // 🔹 Filter only this month's entries
  const thisMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.date) return false;
      // Expect "YYYY-MM-DD"
      const d = new Date(t.date + "T00:00:00");
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
  }, [transactions, currentMonth, currentYear]);

  // 🔹 Compute totals from this month's data
  const totals: Totals = useMemo(() => {
    let revenue = 0;
    let cogs = 0;
    let opex = 0;
    let drawings = 0;

    for (const t of thisMonthTransactions) {
      const amt = Number(t.amount) || 0;

      if (t.category === "sales") {
        revenue += amt;
      } else if (
        t.category === "c_mat" ||
        t.category === "c_lab" ||
        t.category === "c_pack" ||
        t.category === "c_inb" ||
        t.category === "c_other"
      ) {
        cogs += amt;
      } else if (
        t.category === "o_mkt" ||
        t.category === "o_web" ||
        t.category === "o_rent" ||
        t.category === "o_sal" ||
        t.category === "o_other"
      ) {
        opex += amt;
      } else if (t.category === "drawings") {
        drawings += amt;
      }
    }

    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - opex;
    const retainedProfit = netProfit - drawings;

    return {
      revenue,
      cogs,
      opex,
      grossProfit,
      netProfit,
      drawings,
      retainedProfit,
    };
  }, [thisMonthTransactions]);

  function fmt(n: number) {
    if (!isFinite(n)) n = 0;
    return "E£" + n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <section className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Runway Dashboard
        </h1>
        <p className="text-sm text-zinc-400">
          Live summary for <span className="font-semibold">{monthLabel}</span>{" "}
          based on your bookkeeping entries. This is your money control centre:
          revenue, costs, profit, and what you keep in the business.
        </p>
      </section>

      <section className="max-w-6xl mx-auto space-y-6">
        {loading && (
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-300">
            Loading your data...
          </div>
        )}

        {error && (
          <div className="bg-red-950/60 border border-red-700 rounded-2xl p-5 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* 🔸 Top KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                title="Revenue this month"
                value={fmt(totals.revenue)}
                subtitle="Total sales (Sales revenue)"
              />
              <StatCard
                title="Net profit this month"
                value={fmt(totals.netProfit)}
                subtitle="After COGS and operating expenses"
                highlight={totals.netProfit >= 0 ? "positive" : "negative"}
              />
              <StatCard
                title="Retained profit"
                value={fmt(totals.retainedProfit)}
                subtitle="Net profit minus owner's withdrawals"
                highlight={
                  totals.retainedProfit >= 0 ? "positive" : "negative"
                }
              />
            </div>

            {/* 🔸 Profit structure + Owner */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h2 className="text-lg font-semibold mb-1">
                  Profit structure
                </h2>
                <p className="text-xs text-zinc-400 mb-2">
                  How your sales turn into profit this month.
                </p>

                <Row label="Revenue" value={fmt(totals.revenue)} />
                <Row label="COGS (product costs)" value={fmt(totals.cogs)} />
                <Row label="Gross profit" value={fmt(totals.grossProfit)} />
                <Row
                  label="Operating expenses (OPEX)"
                  value={fmt(totals.opex)}
                />
                <Row
                  label="Net profit"
                  value={fmt(totals.netProfit)}
                  strong
                  highlight={totals.netProfit >= 0 ? "positive" : "negative"}
                />

                <div className="mt-3 text-[11px] text-zinc-500 space-y-1">
                  <p>
                    • Gross profit = Revenue − COGS (fabric, production,
                    packaging, shipping-to-you).
                  </p>
                  <p>
                    • Net profit = Gross profit − OPEX (marketing, rent,
                    website, salaries, etc.).
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h2 className="text-lg font-semibold mb-1">
                  Owner & retained profit
                </h2>
                <p className="text-xs text-zinc-400 mb-2">
                  How much you take out vs how much stays in the brand.
                </p>

                <Row label="Net profit" value={fmt(totals.netProfit)} />
                <Row
                  label="Owner's withdrawals"
                  value={fmt(totals.drawings)}
                />
                <Row
                  label="Retained profit"
                  value={fmt(totals.retainedProfit)}
                  strong
                  highlight={
                    totals.retainedProfit >= 0 ? "positive" : "negative"
                  }
                />

                <div className="mt-3 text-[11px] text-zinc-500 space-y-1">
                  <p>
                    • Owner&apos;s withdrawals = money you take out for yourself
                    (not a business expense).
                  </p>
                  <p>
                    • Retained profit = Net profit − withdrawals. This is what
                    stays in the company to fund the next drops.
                  </p>
                </div>
              </div>
            </div>

            {/* 🔸 This month's transactions table */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  This month&apos;s entries
                </h2>
                <p className="text-xs text-zinc-400">
                  {thisMonthTransactions.length} transaction
                  {thisMonthTransactions.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-zinc-900/80">
                    <tr>
                      <Th>Date</Th>
                      <Th>Description</Th>
                      <Th>Category</Th>
                      <Th align="right">Amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {thisMonthTransactions.length === 0 && (
                      <tr>
                        <Td
                          colSpan={4}
                          className="text-center text-zinc-500 py-4"
                        >
                          No bookkeeping entries for this month yet.
                        </Td>
                      </tr>
                    )}

                    {thisMonthTransactions.map((t) => (
                      <tr
                        key={t.id}
                        className="odd:bg-zinc-900/40 even:bg-zinc-900/10"
                      >
                        <Td>{t.date}</Td>
                        <Td>{t.description}</Td>
                        <Td>{categoryLabel(t.category)}</Td>
                        <Td align="right">{fmt(Number(t.amount) || 0)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-[11px] text-zinc-500">
                Edit your data from the{" "}
                <span className="font-semibold">Bookkeeping</span> page. This
                dashboard is read-only and always reflects your latest entries
                for this account.
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

/* Small UI helpers */

function StatCard({
  title,
  value,
  subtitle,
  highlight,
}: {
  title: string;
  value: string;
  subtitle?: string;
  highlight?: "positive" | "negative";
}) {
  const highlightClass =
    highlight === "positive"
      ? "text-emerald-400"
      : highlight === "negative"
      ? "text-red-400"
      : "text-white";

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
      <p className="text-xs text-zinc-400 mb-1">{title}</p>
      <p className={`text-xl font-semibold ${highlightClass}`}>{value}</p>
      {subtitle && (
        <p className="text-[11px] text-zinc-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  highlight,
}: {
  label: string;
  value: string;
  strong?: boolean;
  highlight?: "positive" | "negative";
}) {
  const highlightClass =
    highlight === "positive"
      ? "text-emerald-400"
      : highlight === "negative"
      ? "text-red-400"
      : "";

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-400 text-xs">{label}</span>
      <span
        className={`text-sm ${strong ? "font-semibold" : ""} ${highlightClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";

  return (
    <th
      className={`px-3 py-2 border-b border-zinc-800 text-[11px] text-zinc-400 font-medium ${alignClass}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  colSpan,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";

  return (
    <td
      colSpan={colSpan}
      className={`px-3 py-2 border-b border-zinc-800 text-[11px] ${alignClass} ${
        className ?? ""
      }`}
    >
      {children}
    </td>
  );
}

function categoryLabel(cat: Category): string {
  const map: Record<Category, string> = {
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

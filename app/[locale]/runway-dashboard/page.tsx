"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("runwayDashboardPage");

  const CURRENCIES = {
    EGP: { symbol: "EÂ£", label: t("currency.egp") },
    USD: { symbol: "$", label: t("currency.usd") },
    EUR: { symbol: "â‚¬", label: t("currency.eur") },
    GBP: { symbol: "Â£", label: t("currency.gbp") },
    SAR: { symbol: "SAR ", label: t("currency.sar") },
    AED: { symbol: "AED ", label: t("currency.aed") },
  } as const;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Currency (symbol only, no conversion)
  const [currency, setCurrency] = useState<keyof typeof CURRENCIES>("EGP");
  const SYMBOL = CURRENCIES[currency].symbol;

  function fmt(n: number) {
    if (!isFinite(n)) n = 0;
    return (
      SYMBOL +
      n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  // Load bookkeeping data for the LOGGED IN USER
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/bookkeeping");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || t("errors.loadFailed"));
        }

        const data = await res.json();

        // Support [] OR { entries: [] } OR { items: [] } OR { transactions: [] }
        const items: Transaction[] = Array.isArray(data)
          ? data
          : data.entries || data.items || data.transactions || [];

        setTransactions(items || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || t("errors.unknown"));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [t]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const monthLabel = now.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  // Filter only this month's entries
  const thisMonthTransactions = useMemo(() => {
    return transactions.filter((tr) => {
      if (!tr.date) return false;
      const d = new Date(tr.date + "T00:00:00");
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
  }, [transactions, currentMonth, currentYear]);

  // Compute totals from this month's data
  const totals: Totals = useMemo(() => {
    let revenue = 0;
    let cogs = 0;
    let opex = 0;
    let drawings = 0;

    for (const tr of thisMonthTransactions) {
      const amt = Number(tr.amount) || 0;

      if (tr.category === "sales") {
        revenue += amt;
      } else if (
        tr.category === "c_mat" ||
        tr.category === "c_lab" ||
        tr.category === "c_pack" ||
        tr.category === "c_inb" ||
        tr.category === "c_other"
      ) {
        cogs += amt;
      } else if (
        tr.category === "o_mkt" ||
        tr.category === "o_web" ||
        tr.category === "o_rent" ||
        tr.category === "o_sal" ||
        tr.category === "o_other"
      ) {
        opex += amt;
      } else if (tr.category === "drawings") {
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

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <section className="max-w-6xl mx-auto mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("title")}</h1>
            <p className="text-sm text-zinc-400">
              {t("subtitle", { month: monthLabel })}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as keyof typeof CURRENCIES)
              }
              className="h-8 rounded-full border border-zinc-700 bg-zinc-950/60 px-3 text-xs text-zinc-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
              aria-label={t("currency.label")}
            >
              {Object.entries(CURRENCIES).map(([code, meta]) => (
                <option key={code} value={code}>
                  {meta.label}
                </option>
              ))}
            </select>

            <span className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-300 bg-zinc-900/70">
              {t("badge")}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto space-y-6">
        {loading && (
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-300">
            {t("loading")}
          </div>
        )}

        {error && (
          <div className="bg-red-950/60 border border-red-700 rounded-2xl p-5 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Top KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                title={t("kpis.revenue.title")}
                value={fmt(totals.revenue)}
                subtitle={t("kpis.revenue.subtitle")}
              />
              <StatCard
                title={t("kpis.net.title")}
                value={fmt(totals.netProfit)}
                subtitle={t("kpis.net.subtitle")}
                highlight={totals.netProfit >= 0 ? "positive" : "negative"}
              />
              <StatCard
                title={t("kpis.retained.title")}
                value={fmt(totals.retainedProfit)}
                subtitle={t("kpis.retained.subtitle")}
                highlight={totals.retainedProfit >= 0 ? "positive" : "negative"}
              />
            </div>

            {/* Profit structure + Owner */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h2 className="text-lg font-semibold mb-1">{t("profit.title")}</h2>
                <p className="text-xs text-zinc-400 mb-2">{t("profit.subtitle")}</p>

                <Row label={t("profit.rows.revenue")} value={fmt(totals.revenue)} />
                <Row label={t("profit.rows.cogs")} value={fmt(totals.cogs)} />
                <Row label={t("profit.rows.gross")} value={fmt(totals.grossProfit)} />
                <Row label={t("profit.rows.opex")} value={fmt(totals.opex)} />
                <Row
                  label={t("profit.rows.net")}
                  value={fmt(totals.netProfit)}
                  strong
                  highlight={totals.netProfit >= 0 ? "positive" : "negative"}
                />

                <div className="mt-3 text-[11px] text-zinc-500 space-y-1">
                  <p>{t("profit.notes.gross")}</p>
                  <p>{t("profit.notes.net")}</p>
                </div>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h2 className="text-lg font-semibold mb-1">{t("owner.title")}</h2>
                <p className="text-xs text-zinc-400 mb-2">{t("owner.subtitle")}</p>

                <Row label={t("owner.rows.net")} value={fmt(totals.netProfit)} />
                <Row label={t("owner.rows.drawings")} value={fmt(totals.drawings)} />
                <Row
                  label={t("owner.rows.retained")}
                  value={fmt(totals.retainedProfit)}
                  strong
                  highlight={totals.retainedProfit >= 0 ? "positive" : "negative"}
                />

                <div className="mt-3 text-[11px] text-zinc-500 space-y-1">
                  <p>{t("owner.notes.drawings")}</p>
                  <p>{t("owner.notes.retained")}</p>
                </div>
              </div>
            </div>

            {/* This month's transactions table */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{t("table.title")}</h2>
                <p className="text-xs text-zinc-400">
                  {t("table.count", { count: thisMonthTransactions.length })}
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-zinc-900/80">
                    <tr>
                      <Th>{t("table.headers.date")}</Th>
                      <Th>{t("table.headers.desc")}</Th>
                      <Th>{t("table.headers.cat")}</Th>
                      <Th align="right">{t("table.headers.amount")}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {thisMonthTransactions.length === 0 && (
                      <tr>
                        <Td colSpan={4} className="text-center text-zinc-500 py-4">
                          {t("table.empty")}
                        </Td>
                      </tr>
                    )}

                    {thisMonthTransactions.map((tr) => (
                      <tr
                        key={tr.id}
                        className="odd:bg-zinc-900/40 even:bg-zinc-900/10"
                      >
                        <Td>{tr.date}</Td>
                        <Td>{tr.description}</Td>
                        <Td>{categoryLabel(tr.category, t)}</Td>
                        <Td align="right">{fmt(Number(tr.amount) || 0)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-[11px] text-zinc-500">{t("table.note")}</p>
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
      {subtitle && <p className="text-[11px] text-zinc-500 mt-1">{subtitle}</p>}
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
      <span className={`text-sm ${strong ? "font-semibold" : ""} ${highlightClass}`}>
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
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

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
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

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

function categoryLabel(cat: Category, t: ReturnType<typeof useTranslations>): string {
  const map: Record<Category, string> = {
    sales: t("categories.sales"),
    c_mat: t("categories.c_mat"),
    c_lab: t("categories.c_lab"),
    c_pack: t("categories.c_pack"),
    c_inb: t("categories.c_inb"),
    c_other: t("categories.c_other"),
    o_mkt: t("categories.o_mkt"),
    o_web: t("categories.o_web"),
    o_rent: t("categories.o_rent"),
    o_sal: t("categories.o_sal"),
    o_other: t("categories.o_other"),
    drawings: t("categories.drawings"),
  };

  return map[cat] || cat;
}

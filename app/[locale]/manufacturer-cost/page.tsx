"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function toNumber(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

export default function ManufacturerCostPage() {
  const t = useTranslations("manufacturerCostPage");  const CURRENCIES = {
    EGP: { symbol: "E\u00a3", label: t("currency.egp") },
    USD: { symbol: "$", label: t("currency.usd") },
    EUR: { symbol: "\u20ac", label: t("currency.eur") },
    GBP: { symbol: "\u00a3", label: t("currency.gbp") },
    SAR: { symbol: "\u0631.\u0633", label: t("currency.sar") },
    AED: { symbol: "\u062f.\u0625", label: t("currency.aed") },
  } as const;

  // Currency (symbol only, no conversion)
  const [currency, setCurrency] = useState<keyof typeof CURRENCIES>("EGP");
  const CURRENCY = CURRENCIES[currency].symbol;

  function money(n: number): string {
    if (!isFinite(n)) n = 0;
    return (
      CURRENCY +
      n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  // Inputs
  const [units, setUnits] = useState("0");
  const [styleName, setStyleName] = useState("");

  const [puFabric, setPuFabric] = useState("0");
  const [puCut, setPuCut] = useState("0");
  const [puPrint, setPuPrint] = useState("0");
  const [puTrims, setPuTrims] = useState("0");
  const [puPack, setPuPack] = useState("0");

  const [ordShip, setOrdShip] = useState("0");
  const [ordDuty, setOrdDuty] = useState("0");
  const [ordOther, setOrdOther] = useState("0");

  // Calculations
  const unitsNum = Math.max(0, Math.floor(toNumber(units)));

  const puFabricNum = toNumber(puFabric);
  const puCutNum = toNumber(puCut);
  const puPrintNum = toNumber(puPrint);
  const puTrimsNum = toNumber(puTrims);
  const puPackNum = toNumber(puPack);

  const ordShipNum = toNumber(ordShip);
  const ordDutyNum = toNumber(ordDuty);
  const ordOtherNum = toNumber(ordOther);

  const perUnitSum = puFabricNum + puCutNum + puPrintNum + puTrimsNum + puPackNum;
  const orderLevelSum = ordShipNum + ordDutyNum + ordOtherNum;

  const varTotal = perUnitSum * unitsNum;
  const totalOrder = varTotal + orderLevelSum;

  const basePerUnit = perUnitSum;
  const overheadPerUnit = unitsNum > 0 ? orderLevelSum / unitsNum : 0;
  const allInPerUnit = unitsNum > 0 ? totalOrder / unitsNum : 0;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      {/* Heading */}
      <section className="max-w-5xl mx-auto mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("title")}</h1>
        <p className="text-sm md:text-base text-zinc-300 max-w-3xl">
          {t("subtitle")}
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-5xl mx-auto grid gap-5 md:grid-cols-[1.4fr,1fr]">
        {/* LEFT – Inputs */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              {t("inputs.title")}
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-300 bg-zinc-900/70">
              {t("inputs.badge")}
            </span>
          </div>

          {/* Order basics */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">
              {t("inputs.basics.title")}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  {t("inputs.basics.units")}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  {t("inputs.basics.style")}
                </label>
                <input
                  type="text"
                  value={styleName}
                  onChange={(e) => setStyleName(e.target.value)}
                  placeholder={t("inputs.basics.stylePlaceholder")}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40 placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Per-unit production costs */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
              {t("inputs.perUnit.title")}
            </p>
            <p className="text-[11px] text-zinc-500 mb-2">
              {t("inputs.perUnit.note")}
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <NumberInput
                label={t("inputs.perUnit.fabric")}
                value={puFabric}
                onChange={setPuFabric}
              />
              <NumberInput
                label={t("inputs.perUnit.cut")}
                value={puCut}
                onChange={setPuCut}
              />
              <NumberInput
                label={t("inputs.perUnit.print")}
                value={puPrint}
                onChange={setPuPrint}
              />
              <NumberInput
                label={t("inputs.perUnit.trims")}
                value={puTrims}
                onChange={setPuTrims}
              />
              <NumberInput
                label={t("inputs.perUnit.packaging")}
                value={puPack}
                onChange={setPuPack}
              />
            </div>

            <p className="mt-2 text-[11px] text-zinc-400">
              {t("inputs.perUnit.explain")}
            </p>
          </div>

          {/* Order-level costs */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
              {t("inputs.orderLevel.title")}
            </p>
            <p className="text-[11px] text-zinc-500 mb-2">
              {t("inputs.orderLevel.note")}
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <NumberInput
                label={t("inputs.orderLevel.shipping")}
                value={ordShip}
                onChange={setOrdShip}
              />
              <NumberInput
                label={t("inputs.orderLevel.customs")}
                value={ordDuty}
                onChange={setOrdDuty}
              />
              <NumberInput
                label={t("inputs.orderLevel.other")}
                value={ordOther}
                onChange={setOrdOther}
              />
            </div>

            <p className="mt-2 text-[11px] text-zinc-400">
              {t("inputs.orderLevel.examples")}
            </p>
          </div>
        </div>

        {/* RIGHT – Summary */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold">{t("summary.title")}</h2>

              <div className="flex items-center gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as keyof typeof CURRENCIES)}
                  className="h-7 rounded-full border border-zinc-700 bg-zinc-950/60 px-3 text-[11px] text-zinc-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
                  aria-label={t("summary.currencyLabel")}
                >
                  {Object.entries(CURRENCIES).map(([code, meta]) => (
                    <option key={code} value={code}>
                      {meta.label}
                    </option>
                  ))}
                </select>

                <span className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-300 bg-zinc-900/70">
                  {t("summary.badge")}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              {t("summary.note", { symbol: CURRENCY })}
            </p>
          </div>

          <div className="space-y-1">
            <SummaryRow label={t("summary.units")} value={unitsNum.toString()} />
            <SummaryRow label={t("summary.perUnitSum")} value={money(perUnitSum)} />
            <SummaryRow label={t("summary.variableTotal")} value={money(varTotal)} />
            <SummaryRow
              label={t("summary.orderLevelTotal")}
              value={money(orderLevelSum)}
            />
          </div>

          <div className="mt-2 rounded-2xl border border-zinc-700 bg-gradient-to-br from-violet-600/30 via-violet-700/10 to-cyan-500/20 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-zinc-100">{t("summary.allInPerUnit")}</span>
              <span className="text-lg font-extrabold">{money(allInPerUnit)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-200">{t("summary.allInTotal")}</span>
              <span className="font-semibold text-zinc-100">{money(totalOrder)}</span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-200/80">
              {t("summary.allInNote")}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
              {t("summary.breakdownTitle")}
            </p>
            <SummaryRow
              label={t("summary.basePerUnit")}
              value={money(basePerUnit)}
            />
            <SummaryRow
              label={t("summary.overheadPerUnit")}
              value={money(overheadPerUnit)}
            />
            <p className="mt-2 text-[11px] text-zinc-400">
              {t("summary.breakdownNote")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Small components */

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-300 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        step={0.01}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-zinc-400">{label}</span>
      <span className="text-zinc-100 font-medium">{value}</span>
    </div>
  );
}


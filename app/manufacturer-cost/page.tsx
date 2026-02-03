"use client";

import { useState } from "react";

const CURRENCIES = {
  EGP: { symbol: "E£", label: "EGP (E£)" },
  USD: { symbol: "$", label: "USD ($)" },
  EUR: { symbol: "€", label: "EUR (€)" },
  GBP: { symbol: "£", label: "GBP (£)" },
  SAR: { symbol: "SAR ", label: "SAR (SAR)" },
  AED: { symbol: "AED ", label: "AED (AED)" },
} as const;

function toNumber(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

export default function ManufacturerCostPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          RunwayToRevenue – Manufacturing Cost Tool
        </h1>
        <p className="text-sm md:text-base text-zinc-300 max-w-3xl">
          Use this before you send money to a factory. Enter the quantity, per-unit
          costs (fabric, cut &amp; sew, prints, trims, packaging) and order-level
          costs (shipping, duty, other). The tool will give you your real{" "}
          <strong>all-in cost per unit</strong> and total order cost.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-5xl mx-auto grid gap-5 md:grid-cols-[1.4fr,1fr]">
        {/* LEFT – Inputs */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              Production Inputs
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-300 bg-zinc-900/70">
              Order setup
            </span>
          </div>

          {/* Order basics */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">
              Order basics
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  Units in this order
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
                  Style / drop name (optional)
                </label>
                <input
                  type="text"
                  value={styleName}
                  onChange={(e) => setStyleName(e.target.value)}
                  placeholder="Ex: Oversized Hoodie Drop 01"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40 placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Per-unit production costs */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
              Per-unit production costs
            </p>
            <p className="text-[11px] text-zinc-500 mb-2">
              These are costs you pay <strong>per piece</strong>. If you double units,
              this part roughly doubles.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <NumberInput label="Fabric / materials per unit" value={puFabric} onChange={setPuFabric} />
              <NumberInput label="Cut & sew labour per unit" value={puCut} onChange={setPuCut} />
              <NumberInput label="Print / embroidery per unit" value={puPrint} onChange={setPuPrint} />
              <NumberInput label="Trims & labels per unit" value={puTrims} onChange={setPuTrims} />
              <NumberInput label="Packaging per unit" value={puPack} onChange={setPuPack} />
            </div>

            <p className="mt-2 text-[11px] text-zinc-400">
              <strong>Cut &amp; sew = labour</strong> the factory charges to turn
              fabric into a finished garment (cutting panels, stitching, assembling).
              <br />
              <strong>Trims &amp; labels = physical extras</strong> like woven neck
              labels, hem tags, hang tags, patches, etc. If your factory gives you{" "}
              <em>one combined price</em> like &quot;cut, make &amp; trim&quot;, you can
              put that full number in either <strong>Cut &amp; sew</strong>{" "}
              <em>or</em> <strong>Trims &amp; labels</strong> and leave the other at 0.
            </p>
          </div>

          {/* Order-level costs */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
              Order-level costs
            </p>
            <p className="text-[11px] text-zinc-500 mb-2">
              These are one-time costs for the <strong>whole order</strong>, not per
              piece.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <NumberInput label="Bulk shipping to you" value={ordShip} onChange={setOrdShip} />
              <NumberInput label="Customs / duty / tax" value={ordDuty} onChange={setOrdDuty} />
              <NumberInput label="Other order costs" value={ordOther} onChange={setOrdOther} />
            </div>

            <p className="mt-2 text-[11px] text-zinc-400">
              Examples: freight, customs, port fees, bank transfer fees, QC
              inspection, etc.
            </p>
          </div>
        </div>

        {/* RIGHT – Summary */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold">Cost Summary</h2>

              <div className="flex items-center gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as keyof typeof CURRENCIES)}
                  className="h-7 rounded-full border border-zinc-700 bg-zinc-950/60 px-3 text-[11px] text-zinc-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40"
                  aria-label="Currency"
                >
                  {Object.entries(CURRENCIES).map(([code, meta]) => (
                    <option key={code} value={code}>
                      {meta.label}
                    </option>
                  ))}
                </select>

                <span className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-300 bg-zinc-900/70">
                  All-in
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              Numbers below update automatically as you type. Currency is shown as{" "}
              <strong>{CURRENCY}</strong> by default – just think in the same currency
              you use in your pricing and income statement tools.
            </p>
          </div>

          <div className="space-y-1">
            <SummaryRow label="Units in order" value={unitsNum.toString()} />
            <SummaryRow label="Sum of per-unit costs" value={money(perUnitSum)} />
            <SummaryRow label="Total variable (per-unit × units)" value={money(varTotal)} />
            <SummaryRow label="Total order-level costs" value={money(orderLevelSum)} />
          </div>

          <div className="mt-2 rounded-2xl border border-zinc-700 bg-gradient-to-br from-violet-600/30 via-violet-700/10 to-cyan-500/20 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-zinc-100">All-in cost per unit</span>
              <span className="text-lg font-extrabold">{money(allInPerUnit)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-200">Total order cost (all-in)</span>
              <span className="font-semibold text-zinc-100">{money(totalOrder)}</span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-200/80">
              All-in cost per unit = (total per-unit costs × units + all order-level
              costs) ÷ units. Use this number inside your pricing calculator.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-1">
              Per-unit breakdown
            </p>
            <SummaryRow
              label="Base per-unit costs (fabric, cut & sew, etc.)"
              value={money(basePerUnit)}
            />
            <SummaryRow
              label="Order overhead per unit (shipping, duty, other ÷ units)"
              value={money(overheadPerUnit)}
            />
            <p className="mt-2 text-[11px] text-zinc-400">
              Base per-unit + overhead per-unit = all-in cost per unit.
              If you raise or lower your quantity, overhead per unit will change a lot.
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

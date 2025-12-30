type ChatMsg = { role: "user" | "assistant"; text: string };

type RunMentorArgs = {
  message: string;
  history?: ChatMsg[];
};

function normalize(s: string) {
  return (s || "").toLowerCase().trim();
}

function containsAny(text: string, keywords: string[]) {
  return keywords.some((k) => text.includes(k));
}

function pricingSkill(message: string) {
  // very simple starter logic (you can improve later)
  // Extract first number as "cost" if present
  const nums = message.match(/(\d+(\.\d+)?)/g)?.map(Number) ?? [];
  const cost = nums.length ? nums[0] : null;

  if (cost == null) {
    return "Give me your unit cost (EGP), platform fees %, and target margin %, and I’ll price it.";
  }

  // Defaults if not provided
  const feePct = 3; // %
  const marginPct = 60; // %

  // Price formula (simple): price * (1 - fee) - cost = profit
  // profit margin target uses profit/price. We'll use:
  // profit = price * margin
  // so: price*(1-fee) - cost = price*margin
  // price*(1-fee-margin) = cost
  const fee = feePct / 100;
  const margin = marginPct / 100;

  const denom = 1 - fee - margin;
  if (denom <= 0) {
    return "Your fee% + margin% is too high. Reduce one of them.";
  }

  const price = cost / denom;

  return `Quick pricing (basic logic):
- Cost: ${cost} EGP
- Assumed fees: ${feePct}%
- Assumed target margin: ${marginPct}%
Suggested price ≈ ${Math.round(price)} EGP

If you tell me your real fees and margin target, I’ll recalc exactly.`;
}

function defaultSkill(message: string) {
  return `I can help with:
- Pricing (send: cost, fees %, margin %)
- Positioning (brand, audience, why you win)
- Launch plan (timeline + offer + content)
- Manufacturing (MOQ, suppliers, quality checks)

Tell me what you want and give 2–3 details.`;
}

export function runMentor({ message }: RunMentorArgs) {
  const m = normalize(message);

  // route to a "skill"
  if (containsAny(m, ["price", "pricing", "cost", "margin", "fees", "profit"])) {
    return pricingSkill(message);
  }

  return defaultSkill(message);
}

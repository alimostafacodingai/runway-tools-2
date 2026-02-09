"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "en" ? "ar" : "en";

  function onToggle() {
    // If you're on /en/... or /ar/... swap that first segment
    const nextPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${nextLocale}`);
    router.push(nextPath);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 shadow-[0_10px_40px_rgba(0,0,0,.35)] transition hover:bg-white/[0.06] hover:text-white"
      aria-label="Switch language"
      title="Switch language"
    >
      {locale === "en" ? "AR" : "EN"}
    </button>
  );
}

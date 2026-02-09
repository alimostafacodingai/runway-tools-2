import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, type AppLocale } from "@/i18n/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : "en";

  const messages = await getMessages({ locale: safeLocale });
  const dir = safeLocale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={safeLocale} dir={dir}>
      <body>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

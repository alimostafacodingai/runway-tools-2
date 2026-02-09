import {getRequestConfig} from "next-intl/server";
import {defaultLocale, locales, type AppLocale} from "./locales";

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});

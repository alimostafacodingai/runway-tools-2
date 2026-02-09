import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, locales, type AppLocale} from './i18n/locales';

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`./i18n/messages/${resolvedLocale}.json`)).default
  };
});

import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const locales = ["en", "de"];
  const defaultLocale = "en";

  // Fallback if locale is missing/invalid
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale, // 👈 MUST return this
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

import i18n from "../i18n";

export const generateLocalizedRoute = (locale, path) => {
  if (!locale || !i18n.supportedLngs.includes(locale)) {
    locale = i18n.fallbackLng;
  }
  return path ? `/${locale}${path}` : `/${locale}`;
};

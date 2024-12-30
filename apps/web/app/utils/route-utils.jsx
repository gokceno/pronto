
const SUPPORTED_LOCALES = ['en', 'tr'];

export const generateLocalizedRoute = (locale, path) => {
    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
        locale = 'en'; // fallback to English
    }
    console.log(locale, path)
    return path ? `/${locale}${path}` : `/${locale}`;
};

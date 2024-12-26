import i18n from 'i18next';
import Backend from 'i18next-http-backend'; // For fetching translations
import { initReactI18next } from 'react-i18next'; // Integration with React

// Initialize i18n
i18n
  .use(Backend) // Use the HTTP backend to load translation files
  .use(initReactI18next) // Pass the i18next instance to react-i18next
  .init({
    fallbackLng: 'en', // Default language if none is detected
    supportedLngs: ['en', 'tr'], // List of supported languages
    lng: 'en', // Initial language to load (can be changed dynamically)
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    interpolation: {
      escapeValue: false, // React already escapes values, so no need to escape them here
    },
    react: {
      useSuspense: false, // Disable React Suspense for SSR or simpler setups
    },
  });

export default i18n;

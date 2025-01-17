import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next/server";
import i18n from "./i18n";

let i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
    order: ["path"],
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
});

export default i18next;

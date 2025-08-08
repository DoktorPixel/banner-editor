import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en/en.json";
import ua from "./languages/ua/ua.json";
import LanguageDetector from "i18next-browser-languagedetector";
const resources = {
    en: {
        translation: en,
    },
    ua: {
        translation: ua,
    },
};
i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});
export default i18n;

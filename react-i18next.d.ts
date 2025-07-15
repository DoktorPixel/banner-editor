import "react-i18next";
import enTranslation from "./src/locales/en/translation.json";

declare module "react-i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof enTranslation;
    };
  }
}

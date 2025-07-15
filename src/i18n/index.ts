import { createTranslator } from "./lib/languine";
import en from "./locales/en";
import ua from "./locales/ua";
import type { Lang } from "./types";

const translations = {
  en,
  ua,
} as const;

let currentLang: Lang = "en";

export const setLang = (lang: Lang) => {
  currentLang = lang;
};

export const getLang = () => currentLang;

const translators = Object.fromEntries(
  Object.entries(translations).map(([lang, dict]) => [
    lang,
    createTranslator(dict),
  ])
) as Record<Lang, ReturnType<typeof createTranslator<typeof en>>>;

export const t = (...args: Parameters<(typeof translators)["en"]>) =>
  translators[currentLang](...args);

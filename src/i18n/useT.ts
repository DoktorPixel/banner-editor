import { useSyncExternalStore } from "react";
import { t, getLang, setLang } from "./index";

const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useT() {
  useSyncExternalStore(subscribe, getLang);
  return t;
}

export const changeLanguage = (lang: Parameters<typeof setLang>[0]) => {
  setLang(lang);
  listeners.forEach((cb) => cb());
};

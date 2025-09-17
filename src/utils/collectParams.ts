import { BannerObject, BannerChild } from "../types";

type BannerItem = BannerObject | BannerChild;

function extractParamsFromString(str?: string | number): string[] {
  if (str == null) return [];
  const s = String(str);
  const paramSet = new Set<string>();
  const blockRe = /\{\{\s*([\s\S]+?)\s*\}\}/g;
  let blockMatch: RegExpExecArray | null;

  while ((blockMatch = blockRe.exec(s)) !== null) {
    const inner = blockMatch[1];
    const idRe = /[a-zA-Z_][\w.]*/g;
    let idMatch: RegExpExecArray | null;
    while ((idMatch = idRe.exec(inner)) !== null) {
      const idName = idMatch[0];
      const idEndIndex = idRe.lastIndex;
      const rest = inner.slice(idEndIndex);
      const firstNonSpaceIndex = rest.search(/\S/);
      const nextChar =
        firstNonSpaceIndex === -1 ? "" : rest[firstNonSpaceIndex];
      if (nextChar === "(") continue; // функция → пропускаем
      paramSet.add(idName);
    }
  }
  return Array.from(paramSet);
}

export function collectParamsFromObjects(objects?: BannerItem[]): string[] {
  const found = new Set<string>();

  function recurse(items?: BannerItem[]) {
    if (!items) return;
    for (const item of items) {
      extractParamsFromString(item.content).forEach((p) => found.add(p));
      extractParamsFromString(item.src).forEach((p) => found.add(p));
      if (item.children?.length) recurse(item.children);
    }
  }

  recurse(objects);
  console.log("collectParamsFromObjects:", found);
  return Array.from(found);
}

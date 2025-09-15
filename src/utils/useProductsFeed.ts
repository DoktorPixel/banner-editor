// src/utils/useProductsFeed.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { Product } from "../types"; // Product = Record<string, string | string[]>

const DEFAULT_LIMIT = 1000;

function textOf(el: Element | null): string {
  if (!el) return "";
  return (el.textContent ?? "").trim();
}

function normalizeKey(rawLocalName: string): string {
  // localName обычно уже без префикса ('g:title' -> 'title'),
  // но на всякий случай убираем возможный префикс.
  const withoutPrefix = rawLocalName.includes(":")
    ? rawLocalName.split(":").pop() || rawLocalName
    : rawLocalName;
  return withoutPrefix;
}

/**
 * product[key] может быть string или string[]
 * Функция аккуратно добавляет значение:
 * - если ключа нет — записывает строку
 * - если ключ есть и это строка — превращает в массив [old, new]
 * - если ключ есть и это массив — пушит
 */
function addValue(product: Product, key: string, value: string) {
  if (!key) return;
  const prev = product[key];
  if (prev === undefined) {
    product[key] = value;
    return;
  }
  if (Array.isArray(prev)) {
    prev.push(value);
    return;
  }
  // prev is string -> convert to array
  product[key] = [prev, value];
}

function parseEntryToProduct(entry: Element): Product {
  const product: Product = {};

  Array.from(entry.children).forEach((child) => {
    const rawKey = child.localName || child.nodeName;
    if (!rawKey) return;
    const key = normalizeKey(rawKey);
    const val = textOf(child);
    if (!val) return;
    addValue(product, key, val);
  });

  return product;
}

async function fetchAndParseXml(
  url: string,
  limit = DEFAULT_LIMIT,
  signal?: AbortSignal
): Promise<Product[]> {
  const res = await fetch(url, { signal });
  console.log("res fetchAndParseXml :", res);
  if (!res.ok) {
    throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");

  if (xml.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Failed to parse XML feed (parsererror detected).");
  }

  // Универсальный поиск товаров
  const entries: Element[] = [];
  entries.push(...Array.from(xml.getElementsByTagNameNS("*", "entry"))); // Atom
  entries.push(...Array.from(xml.getElementsByTagNameNS("*", "item"))); // RSS
  entries.push(...Array.from(xml.getElementsByTagName("entry"))); // fallback
  entries.push(...Array.from(xml.getElementsByTagName("item"))); // fallback

  console.log("XML entries found:", entries.length);

  const products = entries.map(parseEntryToProduct).slice(0, limit);
  return products;
}

/**
 * Типизированный хук: возвращает UseQueryResult<Product[], Error>
 */
export function useProductsFeed(
  url: string,
  opts?: { limit?: number; enabled?: boolean }
): UseQueryResult<Product[], Error> {
  const limit = opts?.limit ?? DEFAULT_LIMIT;

  return useQuery<Product[], Error>({
    queryKey: ["productsFromFeed", url, limit],
    queryFn: async ({ signal }) => {
      return await fetchAndParseXml(url, limit, signal ?? undefined);
    },
    enabled: opts?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

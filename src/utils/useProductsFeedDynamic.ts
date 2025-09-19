// src/utils/useProductsFeedDynamic.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { Product } from "../types";

const DEFAULT_LIMIT = 1000;

function textOf(el: Element | null): string {
  if (!el) return "";
  return (el.textContent ?? "").trim();
}

function normalizeKey(rawLocalName: string): string {
  const withoutPrefix = rawLocalName.includes(":")
    ? rawLocalName.split(":").pop() || rawLocalName
    : rawLocalName;
  return withoutPrefix;
}

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

function parseXmlStringToProducts(
  xmlString: string,
  limit = DEFAULT_LIMIT
): Product[] {
  if (!xmlString || !xmlString.trim()) return [];

  if (typeof xmlString !== "string") {
    throw new Error("parseXmlStringToProducts: expected XML string");
  }

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");

  if (xml.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Failed to parse XML feed (parsererror detected).");
  }

  const entries: Element[] = [];

  entries.push(...Array.from(xml.getElementsByTagNameNS("*", "entry")));
  entries.push(...Array.from(xml.getElementsByTagNameNS("*", "item")));
  entries.push(...Array.from(xml.getElementsByTagName("entry")));
  entries.push(...Array.from(xml.getElementsByTagName("item")));

  const products = entries.map(parseEntryToProduct).slice(0, limit);

  return products;
}

/**
 * useProductsFeedDynamic
 * @param xmlContent - строка XML (feed content). Если null/undefined/empty -> enabled = false.
 * @param opts - { limit?, enabled? }
 */
export function useProductsFeedDynamic(
  xmlContent: string | null | undefined,
  opts?: { limit?: number; enabled?: boolean }
): UseQueryResult<Product[], Error> {
  const limit = opts?.limit ?? DEFAULT_LIMIT;
  const enabled =
    Boolean(opts?.enabled ?? true) && Boolean(xmlContent && xmlContent.trim());

  return useQuery<Product[], Error>({
    queryKey: [
      "productsFromFeedDynamic",
      xmlContent?.slice(0, 200) ?? null,
      limit,
    ],
    queryFn: async () => {
      if (!xmlContent || typeof xmlContent !== "string") {
        return [];
      }
      return parseXmlStringToProducts(xmlContent, limit);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

// src/hooks/useProductsFeed.ts
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch and parse XML product feed (supports <entry> and <item>).
 * - url: feed URL (hardcoded by caller if needed)
 * - limit: max number of products to return (default 1000)
 *
 * Product = Record<string, string>
 */

import { Product } from "../types";

const DEFAULT_LIMIT = 1000;

function textOf(el: Element | null): string {
  if (!el) return "";
  return (el.textContent ?? "").trim();
}

function parseEntryToProduct(entry: Element): Product {
  const product: Product = {};

  // iterate over child elements and fill product map
  // if child localName repeats (e.g. multiple additional_image_link),
  // we append values separated by `,` (comma).
  Array.from(entry.children).forEach((child) => {
    const key = child.localName || child.nodeName;
    const val = textOf(child);

    if (!key) return;

    if (product[key]) {
      // append with comma if already exists
      product[key] = product[key] + "," + val;
    } else {
      product[key] = val;
    }
  });

  // Some feeds put some fields not as direct children but as nested children; if needed,
  // additional extraction logic can be added here.

  return product;
}

export async function fetchAndParseXml(
  url: string,
  limit = DEFAULT_LIMIT
): Promise<Product[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");

  // detect parsererror
  if (xml.getElementsByTagName("parsererror").length > 0) {
    // some parsererror nodes may be namespaced — check text also
    throw new Error("Failed to parse XML feed (parsererror detected).");
  }

  // collect <entry> and <item> elements (namespace-agnostic)
  const entries: Element[] = [];
  // getElementsByTagNameNS('*', 'entry') is robust against namespaces
  const entryNodes = Array.from(xml.getElementsByTagNameNS("*", "entry"));
  const itemNodes = Array.from(xml.getElementsByTagNameNS("*", "item"));

  entries.push(...entryNodes, ...itemNodes);

  // In some feeds the items may be inside channel > item; the getElementsByTagNameNS above should catch them.
  // Fallback: if no entries found, try to find elements named 'entry' or 'item' ignoring namespaces
  if (entries.length === 0) {
    const fallbackEntries = Array.from(xml.getElementsByTagName("entry"));
    const fallbackItems = Array.from(xml.getElementsByTagName("item"));
    entries.push(...fallbackEntries, ...fallbackItems);
  }

  const products: Product[] = entries.map(parseEntryToProduct);

  // enforce the limit
  return products.slice(0, limit);
}

export function useProductsFeed(
  url: string,
  opts?: { limit?: number; enabled?: boolean }
) {
  const limit = opts?.limit ?? DEFAULT_LIMIT;

  return useQuery<Product[], Error>({
    queryKey: ["productsFromFeed", url, limit],
    queryFn: async ({ signal }) => {
      // fetch with AbortSignal support
      // fetchAndParseXml currently doesn't accept signal — implement inline with signal
      const controller = new AbortController();
      const raceSignal = controller.signal;

      // if react-query provided a signal, abort controller when it aborts
      if (signal) {
        signal.addEventListener("abort", () => controller.abort());
      }

      // do fetch manually here to pass signal
      const res = await fetch(url, { signal: raceSignal });
      if (!res.ok) {
        throw new Error(`Feed fetch failed: ${res.status} ${res.statusText}`);
      }
      const text = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      if (xml.getElementsByTagName("parsererror").length > 0) {
        throw new Error("Failed to parse XML feed (parsererror detected).");
      }

      const entries: Element[] = [];
      entries.push(...Array.from(xml.getElementsByTagNameNS("*", "entry")));
      entries.push(...Array.from(xml.getElementsByTagNameNS("*", "item")));

      if (entries.length === 0) {
        entries.push(...Array.from(xml.getElementsByTagName("entry")));
        entries.push(...Array.from(xml.getElementsByTagName("item")));
      }

      const products = entries.map(parseEntryToProduct).slice(0, limit);
      return products;
    },
    enabled: opts?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes by default (configurable)
  });
}

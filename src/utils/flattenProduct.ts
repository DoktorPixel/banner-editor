import { KeyValuePair, Product } from "../types";

/**
 * Flatten product object into key-value pairs for display.
 * - nested objects become keys like "attributes.color"
 * - arrays / objects are stringified (or summarized)
 */
function isPlainObject(val: any) {
  return val && typeof val === "object" && !Array.isArray(val);
}

export function flattenProduct(product: Product, maxDepth = 3): KeyValuePair[] {
  const res: KeyValuePair[] = [];

  function add(k: string, v: any) {
    const value =
      v === null || v === undefined
        ? ""
        : typeof v === "string"
        ? v
        : typeof v === "number" || typeof v === "boolean"
        ? String(v)
        : Array.isArray(v)
        ? v.length === 0
          ? ""
          : v.every((it) => typeof it === "string" || typeof it === "number")
          ? v.join(", ")
          : JSON.stringify(v)
        : JSON.stringify(v);
    res.push({ key: k, value });
  }

  function walk(obj: any, prefix = "", depth = 0) {
    if (depth > maxDepth) {
      add(prefix, JSON.stringify(obj));
      return;
    }
    for (const [k, v] of Object.entries(obj ?? {})) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (isPlainObject(v)) {
        walk(v, key, depth + 1);
      } else {
        add(key, v);
      }
    }
  }

  walk(product);
  return res;
}

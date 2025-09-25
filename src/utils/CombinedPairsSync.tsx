//CombinedPairsSync.tsx
import { useEffect, useMemo } from "react";
import { useConfig } from "../context/ConfigContext";
import { useBanner } from "../context/BannerContext";
import { useProductsFeedDynamic } from "../utils/useProductsFeedDynamic";
import { mockProducts } from "../constants/mockProducts";
import type { ExtendedPair, Product } from "../types";
import { fetchDynamicFeed } from "../utils/fetchDynamicFeed";

// тот же урл, что и в InsertingProps
const DYNAMIC_FEED = await fetchDynamicFeed(
  "https://ivan-chohol.ua/price/facebook-catalog.xml"
);

const MAX_PRODUCTS = 1000;

export const CombinedPairsSync: React.FC = () => {
  const { config } = useConfig();
  const { setCombinedPairs } = useBanner();

  const keyValuePairs = config?.keyValuePairs ?? [];

  const { data: fetchedProducts } = useProductsFeedDynamic(DYNAMIC_FEED, {
    limit: MAX_PRODUCTS,
    enabled: true,
  });

  const productsSource: Product[] =
    (fetchedProducts?.length ? fetchedProducts : mockProducts) ?? [];

  const firstProduct = productsSource.length > 0 ? productsSource[0] : null;

  const productPairs = useMemo<ExtendedPair[]>(() => {
    if (!firstProduct) return [];
    return Object.entries(firstProduct).map(([k, v]) => {
      const displayValue = Array.isArray(v) ? v.join(", ") : String(v ?? "");
      return { key: k, value: displayValue, editable: false };
    });
  }, [firstProduct]);

  const customPairs = useMemo(
    () =>
      keyValuePairs
        .filter((p) => !p.fromProduct)
        .map((p) => ({ ...p, editable: true, custom: true })),
    [keyValuePairs]
  );

  const productPairsWithOverrides = useMemo(() => {
    return productPairs.map((pp) => {
      const override = keyValuePairs.find(
        (kp) => kp.key === pp.key && kp.fromProduct
      );
      return override
        ? { ...override, editable: true }
        : { ...pp, editable: false };
    });
  }, [productPairs, keyValuePairs]);

  const combinedPairs = useMemo(
    () => [...customPairs, ...productPairsWithOverrides],
    [customPairs, productPairsWithOverrides]
  );

  useEffect(() => {
    setCombinedPairs(combinedPairs);
  }, [combinedPairs, setCombinedPairs]);

  return null;
};

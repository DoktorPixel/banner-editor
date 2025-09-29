// InsertingProps.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useConfig } from "../../../../context/ConfigContext";
import { useBanner } from "../../../../context/BannerContext";
import KeyValueTable from "./KeyValueTable";
import { KeyValuePair, Product } from "../../../../types";
import { mockProducts } from "../../../../constants/mockProducts";
import type { ExtendedPair } from "../../../../types";

import { fetchDynamicFeed } from "../../../../utils/fetchDynamicFeed";
import { useProductsFeedDynamic } from "../../../../utils/useProductsFeedDynamic";

const DYNAMIC_FEED = await fetchDynamicFeed(
  "https://ivan-chohol.ua/price/facebook-catalog.xml"
);

const MAX_PRODUCTS = 1000;

const InsertingProps: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { addObject, setCombinedPairs } = useBanner();
  const { t } = useTranslation();
  const [productIndex, setProductIndex] = useState(0);

  const keyValuePairs = config?.keyValuePairs ?? [];

  const updatePairs = useCallback(
    (newPairs: typeof keyValuePairs) => {
      setConfig((prev) => ({ ...prev, keyValuePairs: newPairs }));
    },
    [setConfig]
  );

  const addKeyValuePair = useCallback(() => {
    const newPair: KeyValuePair = { key: "", value: "", custom: true };
    updatePairs([newPair, ...keyValuePairs]);
  }, [keyValuePairs, updatePairs]);

  const removeKeyValuePair = useCallback(
    (key: string) => {
      updatePairs(keyValuePairs.filter((p) => p.key !== key));
    },
    [keyValuePairs, updatePairs]
  );

  const handleAddText = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      addObject({
        id: Date.now(),
        type: "text",
        x: 50,
        y: 50,
        width: 200,
        height: 50,
        content: text,
        fontSize: 16,
        color: "#000000",
        name: "",
      });
    },
    [addObject]
  );

  const handleAddDynamicsImage = (url: string) => {
    addObject({
      id: Date.now(),
      type: "image",
      width: 250,
      height: 250,
      x: 50,
      y: 50,
      src: url,
      name: "",
      dynamics: true,
    });
  };

  // --- fetch products ---

  const {
    data: fetchedProducts,
    isLoading,
    isError,
    error,
  } = useProductsFeedDynamic(DYNAMIC_FEED, {
    limit: MAX_PRODUCTS,
    enabled: true,
  });

  const productsSource: Product[] =
    (fetchedProducts?.length ? fetchedProducts : mockProducts) ?? [];
  const product =
    productsSource.length > 0 ? productsSource[productIndex] : null;

  const productPairs = useMemo<ExtendedPair[]>(() => {
    if (!product) return [];
    return Object.entries(product).map(([k, v]) => {
      const displayValue = Array.isArray(v) ? v.join(", ") : String(v ?? "");
      return {
        key: k,
        value: displayValue,
        editable: false,
      } as ExtendedPair;
    });
  }, [product]);

  const customPairsOrdered = useMemo(
    () =>
      keyValuePairs
        .filter((p) => !p.fromProduct)
        .map((p) => ({ ...p, editable: true, custom: true })),
    [keyValuePairs]
  );

  const productOrderedPairs = useMemo(() => {
    return productPairs.map((pp) => {
      const override = keyValuePairs.find(
        (kp) => kp.key === pp.key && kp.fromProduct
      );
      if (override) {
        return { ...override, editable: true } as ExtendedPair;
      }
      return { ...pp, editable: false } as ExtendedPair;
    });
  }, [productPairs, keyValuePairs]);

  const combinedPairs = useMemo(
    () => [...customPairsOrdered, ...productOrderedPairs],
    [customPairsOrdered, productOrderedPairs]
  );

  useEffect(() => {
    setCombinedPairs(combinedPairs);
  }, [combinedPairs, setCombinedPairs]);

  const handleEditKey = useCallback(
    (oldKey: string, newKey: string) => {
      const idx = keyValuePairs.findIndex((p) => p.key === oldKey);
      if (idx === -1) return;
      const updated = [...keyValuePairs];
      updated[idx] = { ...updated[idx], key: newKey };
      updatePairs(updated);
    },
    [keyValuePairs, updatePairs]
  );

  const handleEditValue = useCallback(
    (key: string, newValue: string) => {
      const idx = keyValuePairs.findIndex((p) => p.key === key);
      if (idx === -1) return;
      const updated = [...keyValuePairs];
      updated[idx] = { ...updated[idx], value: newValue };
      updatePairs(updated);
    },
    [keyValuePairs, updatePairs]
  );

  const commitProductValue = useCallback(
    (key: string, value: string) => {
      const exists = keyValuePairs.find((p) => p.key === key);
      if (exists) {
        updatePairs(
          keyValuePairs.map((p) =>
            p.key === key ? { ...p, value, fromProduct: true } : p
          )
        );
      } else {
        updatePairs([...keyValuePairs, { key, value, fromProduct: true }]);
      }
    },
    [keyValuePairs, updatePairs]
  );

  const goPrev = useCallback(
    () =>
      setProductIndex((i) => (i - 1 < 0 ? productsSource.length - 1 : i - 1)),
    [productsSource.length]
  );
  const goNext = useCallback(
    () => setProductIndex((i) => (i + 1 >= productsSource.length ? 0 : i + 1)),
    [productsSource.length]
  );

  return (
    <div className="inserting-props">
      <div>
        <p className="inserting-props-title">
          {t("product_example") ?? "Product example"}:{" "}
          <span> {String(product?.title ?? "")}</span>
        </p>

        {productsSource.length > 1 && (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button onClick={goPrev} sx={{ height: 30, whiteSpace: "nowrap" }}>
              ← Prev
            </Button>
            <span
              style={{
                whiteSpace: "nowrap",
                fontSize: 16,
                marginTop: 2,
              }}
            >
              {productIndex + 1} / {productsSource.length}
            </span>
            <Button onClick={goNext} sx={{ height: 30, whiteSpace: "nowrap" }}>
              Next →
            </Button>
          </div>
        )}

        {isLoading && (
          <div>
            {" "}
            <CircularProgress size="12px" /> Loading products…
          </div>
        )}
        {isError && (
          <div style={{ color: "red" }}>Feed error: {error?.message}</div>
        )}
      </div>

      <KeyValueTable
        combinedPairs={combinedPairs}
        onEditKey={handleEditKey}
        onEditValue={handleEditValue}
        onRemoveByKey={removeKeyValuePair}
        onAddCustom={addKeyValuePair}
        onAddText={handleAddText}
        onAddImage={handleAddDynamicsImage}
        onCommitProductValue={commitProductValue}
      />
    </div>
  );
};

export default InsertingProps;

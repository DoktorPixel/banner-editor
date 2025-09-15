// src/components/InsertingProps/InsertingProps.tsx
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useConfig } from "../../../../context/ConfigContext";
import { useBanner } from "../../../../context/BannerContext";
import KeyValueTable from "./KeyValueTable";
import { KeyValuePair, Product } from "../../../../types";
import { mockProducts } from "../../../../constants/mockProducts";
import type { ExtendedPair } from "../../../../types";

const InsertingProps: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { addObject } = useBanner();
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

  const product: Product | null =
    mockProducts.length > 0 ? mockProducts[productIndex] : null;

  const productPairs = useMemo<ExtendedPair[]>(() => {
    if (!product) return [];
    return Object.entries(product).map(([k, v]) => ({
      key: k,
      value: String(v),
      editable: false,
    }));
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
    () => setProductIndex((i) => (i - 1 < 0 ? mockProducts.length - 1 : i - 1)),
    []
  );
  const goNext = useCallback(
    () => setProductIndex((i) => (i + 1 >= mockProducts.length ? 0 : i + 1)),
    []
  );

  return (
    <div className="inserting-props">
      <div>
        <p className="inserting-props-title">
          {t("product_example") ?? "Product example"}:{" "}
          <span> {product?.title ?? ""}</span>
        </p>

        {mockProducts.length > 1 && (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button onClick={goPrev} sx={{ height: 30, whiteSpace: "nowrap" }}>
              ← Prev
            </Button>
            <span
              style={{
                whiteSpace: "nowrap",
                width: 52,
                fontSize: 16,
                marginTop: 2,
              }}
            >
              {productIndex + 1} / {mockProducts.length}
            </span>
            <Button onClick={goNext} sx={{ height: 30, whiteSpace: "nowrap" }}>
              Next →
            </Button>
          </div>
        )}
      </div>

      <KeyValueTable
        combinedPairs={combinedPairs}
        onEditKey={handleEditKey}
        onEditValue={handleEditValue}
        onRemoveByKey={removeKeyValuePair}
        onAddCustom={addKeyValuePair}
        onAddText={handleAddText}
        onCommitProductValue={commitProductValue}
      />
    </div>
  );
};

export default InsertingProps;

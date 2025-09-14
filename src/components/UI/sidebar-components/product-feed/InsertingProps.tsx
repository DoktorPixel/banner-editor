import React, { useState, useMemo } from "react";
import { Button } from "@mui/material";
import KeyValueTable from "./KeyValueTable";
import { useConfig } from "../../../../context/ConfigContext";
import { useBanner } from "../../../../context/BannerContext";
import { KeyValuePair, Product } from "../../../../types";
import { mockProducts } from "../../../../constants/mockProducts";

type ExtendedPair = KeyValuePair & { editable: boolean };

const InsertingProps: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { addObject } = useBanner();

  const [productIndex, setProductIndex] = useState(0);

  const keyValuePairs = config?.keyValuePairs ?? [];

  const updatePairs = (newPairs: typeof keyValuePairs) => {
    setConfig((prev) => ({
      ...prev,
      keyValuePairs: newPairs,
    }));
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...keyValuePairs];
    updated[index].key = newKey;
    updatePairs(updated);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...keyValuePairs];
    updated[index].value = newValue;
    updatePairs(updated);
  };

  const addKeyValuePair = () => {
    updatePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const removeKeyValuePair = (index: number) => {
    updatePairs(keyValuePairs.filter((_, i) => i !== index));
  };

  const handleAddText = (text: string) => {
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
  };

  // текущий продукт
  const product: Product | null =
    mockProducts.length > 0 ? mockProducts[productIndex] : null;

  // превращаем product в пары
  const productPairs: ExtendedPair[] = useMemo(() => {
    if (!product) return [];
    return Object.entries(product).map(([k, v]) => ({
      key: k,
      value: String(v),
      editable: false,
    }));
  }, [product]);

  // исключаем дубликаты с keyValuePairs
  const usedKeys = new Set(keyValuePairs.map((p) => p.key));
  const filteredProductPairs = productPairs.filter((p) => !usedKeys.has(p.key));

  // итоговый список
  const combinedPairs: ExtendedPair[] = [
    ...keyValuePairs.map((p) => ({ ...p, editable: true })),
    ...filteredProductPairs,
  ];

  const commitProductValue = (key: string, value: string) => {
    const exists = keyValuePairs.find((p) => p.key === key);
    if (exists) {
      updatePairs(
        keyValuePairs.map((p) => (p.key === key ? { ...p, value } : p))
      );
    } else {
      updatePairs([...keyValuePairs, { key, value }]);
    }
  };

  const goPrev = () => {
    setProductIndex((i) => (i - 1 < 0 ? mockProducts.length - 1 : i - 1));
  };

  const goNext = () => {
    setProductIndex((i) => (i + 1 >= mockProducts.length ? 0 : i + 1));
  };

  return (
    <div className="inserting-props">
      <div>
        <p className="inserting-props-title">
          Product example: <span> {product?.title ?? ""}</span>
        </p>
        {mockProducts.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              // marginBottom: 8,
            }}
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
        keyValuePairs={combinedPairs}
        handleKeyChange={handleKeyChange}
        handleValueChange={handleValueChange}
        removeKeyValuePair={removeKeyValuePair}
        addKeyValuePair={addKeyValuePair}
        handleAddText={handleAddText}
        commitProductValue={commitProductValue}
      />
    </div>
  );
};

export default InsertingProps;

import React, { useMemo, useState } from "react";
import { Product, KeyValuePair } from "../../../../types";
import { flattenProduct } from "../../../../utils/flattenProduct";
import { useConfig } from "../../../../context/ConfigContext";

interface Props {
  products: Product[];
  initialIndex?: number;
  onSelect?: (product: Product) => void;
  className?: string;
}

export const ProductBrowser: React.FC<Props> = ({
  products,
  initialIndex = 0,
  onSelect,
}) => {
  const [index, setIndex] = useState<number>(() =>
    Math.max(0, Math.min(initialIndex, products.length - 1))
  );
  const product = products[index];
  //
  const {
    // config,
    setConfig,
  } = useConfig();
  // const keyValuePairs = config?.keyValuePairs ?? [];

  const onRowClick = (key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      keyValuePairs: [...(prev?.keyValuePairs ?? []), { key, value }],
    }));
  };
  //

  const pairs: KeyValuePair[] = useMemo(() => {
    if (!product) return [];
    return flattenProduct(product, 4);
  }, [product]);

  const goNext = () => {
    setIndex((i) => (i + 1 >= products.length ? 0 : i + 1));
  };
  const goPrev = () => {
    setIndex((i) => (i - 1 < 0 ? products.length - 1 : i - 1));
  };

  React.useEffect(() => {
    onSelect?.(product);
  }, [product, onSelect]);

  if (!product) {
    return <div>No products provided</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        border: "1px solid #e2e8f0",
        borderRadius: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          padding: 12,
        }}
      >
        {" "}
        <strong> Product example:</strong>
        <div
          style={{
            display: "flex",
            gap: " 20px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button onClick={goPrev} aria-label="prev" style={navBtnStyle}>
            ← Prev
          </button>
          <button onClick={goNext} aria-label="next" style={navBtnStyle}>
            Next →
          </button>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
        >
          <div>
            <span>{product.title ?? `#${product.id}`}</span>
            <div style={{ marginTop: 6, fontSize: 12 }}>
              {index + 1} / {products.length} — id: <code>{product.id}</code>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            flex: 1,
            maxHeight: "600px",
            maxWidth: "346px",
            overflow: "auto",
            border: "1px solid #eee",
            borderRadius: 1,
          }}
        >
          <table
            style={{ width: "100%", maxWidth: "360px", tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "70%" }} />
            </colgroup>
            <thead
              style={{
                position: "sticky",
                top: 0,
                fontWeight: "700",
                backgroundColor: "#f1f5f9",
              }}
            >
              <tr>
                <th style={thStyle}>Property</th>
                <th style={thStyle}>Value</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((p, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: "1px solid #f2f4f7",
                    cursor: "pointer",
                  }}
                  onClick={() => onRowClick?.(p.key, p.value)}
                >
                  <td style={tdKeyStyle}>
                    <code>{p.key}</code>
                  </td>
                  <td style={tdValStyle}>
                    {p.value || <span style={{ color: "#999" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const navBtnStyle: React.CSSProperties = {
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  padding: "3px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  borderBottom: "1px solid #e6edf3",
};
const tdKeyStyle: React.CSSProperties = {
  padding: "8px 12px",
  width: "35%",
  verticalAlign: "top",
  background: "#fcfeff",
  whiteSpace: "nowrap",
  overflow: "hidden",
  // textOverflow: "ellipsis",
};
const tdValStyle: React.CSSProperties = {
  padding: "8px 12px",
  verticalAlign: "top",
  whiteSpace: "pre-wrap",
};

export default ProductBrowser;

// react-arborist/TreeNode.tsx
import { memo } from "react";
import { NodeApi } from "react-arborist";
import { ArboristNodeData } from "./convertObjectsToTree";

import {
  SvgImage,
  SvgText,
  SvgLayoutOpen,
  SvgLayout,
  ArrowRight,
  ArrowDown,
} from "../../../../assets/icons";
import { IconButton } from "@mui/material";

export const ToggleButton = memo(
  ({ node }: { node: NodeApi<ArboristNodeData> }) =>
    node.data.type === "group" ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          width: "20px",
          marginLeft: "-8px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
      >
        <IconButton size="small">
          {node.isOpen ? <ArrowDown /> : <ArrowRight />}
        </IconButton>
      </div>
    ) : null
);

export const TypeIcon = memo(
  ({ node }: { node: NodeApi<ArboristNodeData> }) => {
    const type = node.data.type;
    if (type === "text") return <SvgText />;
    if (type === "image") return <SvgImage />;
    if (type === "group")
      return node.isOpen ? <SvgLayoutOpen /> : <SvgLayout />;
    if (type === "figure") return <SvgImage />;
    return <>•</>;
  }
);

export const EditButton = memo(
  ({
    onDoubleClick,
  }: {
    onDoubleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        marginLeft: 4,
        fontSize: "14px",
      }}
      onDoubleClick={onDoubleClick}
    >
      ✍️
    </button>
  )
);

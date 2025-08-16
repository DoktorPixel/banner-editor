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

// DragPreview.tsx

import { BannerObject } from "../../../../types";

type DragPreviewProps = {
  offset: { x: number; y: number } | null;
  mouse: { x: number; y: number } | null;
  id: string | null;
  dragIds: string[];
  isDragging: boolean;
  objects: BannerObject[];
};

export const DragPreview: React.FC<DragPreviewProps> = ({
  offset,
  dragIds,
  isDragging,
  objects,
}) => {
  if (!isDragging || !offset) return null;

  const draggedLabels = dragIds
    .map((did) => {
      const obj = objects.find((o) => String(o.id) === String(did));
      return obj ? obj.name || `Item ${obj.id}` : String(did);
    })
    .filter(Boolean);

  const firstLabel = draggedLabels[0] ?? "Item";
  const more = dragIds.length > 1 ? ` +${dragIds.length - 1}` : "";

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        pointerEvents: "none",
        transform: `translate(${Math.round(offset.x)}px, ${Math.round(
          offset.y
        )}px)`,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
          background: "white",
          border: "1px solid rgba(0,0,0,0.08)",
          fontSize: 13,
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {firstLabel}
        {more}
      </div>
    </div>
  );
};

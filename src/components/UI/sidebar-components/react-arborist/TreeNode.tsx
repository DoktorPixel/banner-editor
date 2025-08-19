// react-arborist/TreeNode.tsx
import { useState, useEffect, useRef } from "react";
import type { NodeRendererProps } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import { ToggleButton, TypeIcon } from "./SubComponents";
import { VisibilityToggle2 } from "../../button-groups/VisibilityToggle2";
import { useBanner } from "../../../../context/BannerContext";
import { updateNodeName } from "./helpers";
import { SvgVirtual } from "../../../../assets/icons";
import { GroupVisibilityToggle2 } from "../../button-groups/GroupVisibilityToggle2";
import { useTranslation } from "react-i18next";

export function TreeNode({
  node,
  style,
  dragHandle,
  preview,
}: NodeRendererProps<ArboristNodeData>) {
  const { updateObject, updateChild, updateNestedChild } = useBanner();
  const data = node.data;
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(data.raw.name ?? data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const rowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    dragHandle?.(rowRef.current);
    return () => dragHandle?.(null);
  }, [dragHandle]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleDoubleClick = () => {
    setEditValue(data.raw.name ?? data.label);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeName(
      data,
      editValue,
      updateObject,
      updateChild,
      updateNestedChild,
      node
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleBlur();
    else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(data.raw.name ?? data.label);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (node.isSelected) {
        node.deselect();
      } else {
        node.selectMulti();
      }
    } else if (e.shiftKey) {
      node.select();
    } else {
      node.select();
    }
  };

  const rowClass = [
    "row arborist-row",
    node.isSelected ? "row--selected" : "",
    preview ? "row--preview" : "",
  ].join(" ");

  const { t } = useTranslation();

  return (
    <div
      style={{
        ...style,
        paddingLeft: node.level * 16 + 0,
        backgroundColor: isHovered ? "#F5F5F5" : "",
        cursor: preview ? "grabbing" : "grab",
        userSelect: isEditing ? "none" : "text",
      }}
      // ref={dragHandle}
      ref={rowRef}
      className={`${rowClass} ${isEditing ? "row--editing" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ToggleButton node={node} />
      </div>
      {data.isAbstractGroup ? (
        <div style={{ width: 14, textAlign: "center" }}>
          <SvgVirtual />
        </div>
      ) : (
        <div style={{ width: 14, textAlign: "center" }}>
          <TypeIcon node={node} />
        </div>
      )}

      <div className="input-wrapper">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="input"
            style={{
              width: "100%",
              fontSize: "inherit",
              border: "1px solid #ccc",
              padding: "2px 4px",
              cursor: "text",
            }}
          />
        ) : (
          <>
            <span>
              {data.isAbstractGroup
                ? t("layersPanel.group")
                : data.raw.name || data.label}
            </span>
          </>
        )}
      </div>

      <div
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {data.isAbstractGroup ? (
          <GroupVisibilityToggle2
            objectIds={
              node.children ? node.children.map((c) => c.data.originalId) : []
            }
            show={isHovered}
          />
        ) : (
          <VisibilityToggle2 objectId={data.originalId} show={isHovered} />
        )}
      </div>
    </div>
  );
}

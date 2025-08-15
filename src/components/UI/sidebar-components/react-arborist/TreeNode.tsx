// react-arborist/TreeNode.tsx
import { useState, useEffect, useRef } from "react";
import type { NodeRendererProps } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import { EditButton, ToggleButton, TypeIcon } from "./SubComponents";
import { VisibilityToggle } from "../../button-groups/VisibilityToggle";
import { useBanner } from "../../../../context/BannerContext";
import { updateNodeName } from "./helpers";

export function TreeNode({
  node,
  style,
  dragHandle,
  preview,
}: NodeRendererProps<ArboristNodeData>) {
  const { updateObject, updateChild, updateNestedChild } = useBanner();
  const data = node.data;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.raw.name ?? data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const startEditing = () => {
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
    "row",
    node.isSelected ? "row--selected" : "",
    preview ? "row--preview" : "",
  ].join(" ");

  return (
    <div
      style={{
        ...style,
        paddingLeft: node.level * 16 + 4,
      }}
      ref={dragHandle}
      className={rowClass}
      onClick={handleClick}
    >
      <ToggleButton node={node} />
      <div style={{ width: 14, textAlign: "center" }}>
        <TypeIcon node={node} />
      </div>

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
            }}
          />
        ) : (
          <>
            <span>{data.raw.name || data.label}</span>
            {node.isSelected && !isEditing && (
              <EditButton
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startEditing();
                }}
              />
            )}
          </>
        )}
      </div>

      <VisibilityToggle objectId={data.originalId} />
    </div>
  );
}

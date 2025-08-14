// react-arborist/TreeNode.tsx
import { useState, useEffect, useRef } from "react";
import type { NodeRendererProps } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import {
  SvgImage,
  SvgText,
  SvgLayoutOpen,
  SvgLayout,
  ArrowRight,
  ArrowDown,
} from "../../../../assets/icons";
import { IconButton } from "@mui/material";
import { VisibilityToggle } from "../../button-groups/VisibilityToggle";
import { useBanner } from "../../../../context/BannerContext";

export function TreeNode({
  node,
  style,
  dragHandle,
  preview,
}: NodeRendererProps<ArboristNodeData>) {
  const { updateObject, updateChild } = useBanner();
  const data = node.data;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    data.raw.name ?? data.label // дефолтный лейбл если name пустой
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // при активации режима редактирования автофокус на инпут
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // кнопка раскрытия/сворачивания группы
  const toggleButton =
    data.type === "group" ? (
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
    ) : (
      <></>
    );

  // иконка типа объекта
  const typeIcon = (() => {
    switch (data.type) {
      case "text":
        return <SvgText />;
      case "image":
        return <SvgImage />;
      case "group":
        return node.isOpen ? <SvgLayoutOpen /> : <SvgLayout />;
      case "figure":
        return <SvgImage />;
      default:
        return "•";
    }
  })();

  const rowClass = [
    "row",
    node.isSelected ? "row--selected" : "",
    preview ? "row--preview" : "",
  ].join(" ");

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      // toggle select
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

  const handleDoubleClick = () => {
    setEditValue(data.raw.name ?? data.label);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const trimmed = editValue.trim();
    if (data.parentId) {
      updateChild(data.parentId, data.originalId, {
        name: trimmed || undefined,
      });
    } else {
      updateObject(data.originalId, { name: trimmed || undefined });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(data.raw.name ?? data.label);
    }
  };

  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        paddingLeft: node.level * 16 + 4,
      }}
      ref={dragHandle}
      className={rowClass}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {toggleButton}
      <div style={{ width: 14, textAlign: "center" }}>{typeIcon}</div>

      <div
        style={{
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              fontSize: "inherit",
              border: "1px solid #ccc",
              padding: "2px 4px",
            }}
          />
        ) : (
          <span>{data.raw.name || data.label}</span>
        )}
      </div>

      <VisibilityToggle objectId={data.originalId} />
    </div>
  );
}

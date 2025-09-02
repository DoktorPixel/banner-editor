import { useState, useRef, useEffect } from "react";
import type { NodeApi } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import { useBanner } from "../../../../context/BannerContext";
import { updateNodeName } from "./helpers";

export function useTreeNodeHandlers(node: NodeApi<ArboristNodeData>) {
  const { updateObject, updateChild, updateNestedChild } = useBanner();

  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(
    node.data.raw?.name ?? node.data.label
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (node.data.isAbstractGroup) return;
    setEditValue(node.data.raw?.name ?? node.data.label);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (node.data.isAbstractGroup) return;
    updateNodeName(
      node.data,
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
      setEditValue(node.data.raw?.name ?? node.data.label);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (node.isSelected) node.deselect();
      else node.selectMulti();
    } else if (e.shiftKey) {
      node.select();
    } else {
      node.select();
    }
  };

  return {
    state: { isEditing, isHovered, editValue, inputRef },
    handlers: {
      setIsEditing,
      setIsHovered,
      setEditValue,
      handleClick,
      handleDoubleClick,
      handleBlur,
      handleKeyDown,
    },
  };
}

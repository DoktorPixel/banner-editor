// react-arborist/TreeNode.tsx
import { useRef, useEffect } from "react";
import type { NodeRendererProps } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import { TreeNodeRow } from "./TreeNodeRow";
import { useTreeNodeHandlers } from "./treeNodeHandlers";
import { useGroupOnDrop } from "./useGroupOnDrop";

export function TreeNode({
  node,
  style,
  dragHandle,
  preview,
}: NodeRendererProps<ArboristNodeData>) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const { setHoveredRootId } = useGroupOnDrop();

  // dragHandle attach
  useEffect(() => {
    dragHandle?.(rowRef.current);
    return () => dragHandle?.(null);
  }, [dragHandle]);

  // Отслеживаем hover над root-узлом
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const isRoot = !node.isInternal; // Используем node.isInternal для определения корневого узла
    const isAbstract = node.data?.isAbstractGroup;
    const numericId = Number(node.id);
    const isRealRoot = isRoot && !isAbstract && Number.isFinite(numericId);

    const onEnter = () => {
      if (isRealRoot) setHoveredRootId(numericId);
    };
    const onLeave = () => {
      if (isRealRoot) setHoveredRootId(null);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [node, setHoveredRootId]);

  const { state, handlers } = useTreeNodeHandlers(node);

  return (
    <TreeNodeRow
      ref={rowRef}
      node={node}
      style={style}
      preview={!!preview}
      state={state}
      handlers={handlers}
    />
  );
}


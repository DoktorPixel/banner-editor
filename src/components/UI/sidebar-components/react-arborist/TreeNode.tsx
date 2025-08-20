import { useRef, useEffect } from "react";
import type { NodeRendererProps } from "react-arborist";
import type { ArboristNodeData } from "./convertObjectsToTree";
import { TreeNodeRow } from "./TreeNodeRow";
import { useTreeNodeHandlers } from "./treeNodeHandlers";

export function TreeNode({
  node,
  style,
  dragHandle,
  preview,
}: NodeRendererProps<ArboristNodeData>) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  // dragHandle attach
  useEffect(() => {
    dragHandle?.(rowRef.current);
    return () => dragHandle?.(null);
  }, [dragHandle]);

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

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
  const { setHoveredRootId } = useGroupOnDrop(); // <— Получаем setter для hoveredRootId из контекста

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
    const isRealRoot = isRoot && !isAbstract && Number.isFinite(numericId); // <— Только для "реальных" root-узлов (не абстрактных групп, не NaN ID)

    const onEnter = () => {
      if (isRealRoot) setHoveredRootId(numericId); // <— При входе курсора: устанавливаем hoveredRootId = ID этого root-узла. Это ключ для отличия "drop НА root"
    };
    const onLeave = () => {
      if (isRealRoot) setHoveredRootId(null); // <— При выходе: сбрасываем hovered. Таким образом, hovered актуален только когда курсор НАД элементом
    };

    el.addEventListener("mouseenter", onEnter); // <— Слушатели на <div> строки узла
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [node, setHoveredRootId]); // <— Эффект зависит от node и setter'а. Запускается для каждого узла в дереве

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

import React, { useMemo, useRef, useEffect } from "react";
import { Tree, NodeApi, TreeApi } from "react-arborist";
import { useBanner } from "../../../../context/BannerContext";
import { convertObjectsToTree, ArboristNodeData } from "./convertObjectsToTree";
import { TreeNode } from "./TreeNode";

export const BannerObjectsTree: React.FC = () => {
  const {
    objects,
    selectedObjectIds,
    selectedChildId,
    selectObject,
    selectChild,
    clearChildSelection,
  } = useBanner();

  const treeRef = useRef<TreeApi<ArboristNodeData> | null>(null);
  const treeData = useMemo(() => convertObjectsToTree(objects), [objects]);

  // Когда кликаем в дереве
  const handleSelect = (nodes: NodeApi<ArboristNodeData>[]) => {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      clearChildSelection();
      return;
    }

    clearChildSelection();

    nodes.forEach((n, index) => {
      const data = n.data;

      if (data.parentId) {
        const parentNode = n.parent;
        if (parentNode?.data?.parentId) {
          selectChild(
            parentNode.data.originalId,
            data.originalId,
            parentNode.data.parentId
          );
        } else {
          selectChild(data.parentId, data.originalId);
        }
      } else {
        selectObject(data.originalId, index > 0);
      }
    });
  };

  // Синхронизация состояния из контекста в дерево
  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;

    // Снять выделение, если пусто
    const noRootSel = !selectedObjectIds || selectedObjectIds.length === 0;
    const noChildSel = !selectedChildId;
    if (noRootSel && noChildSel) {
      tree.selectedNodes?.forEach((n) => n.deselect());
      return;
    }

    tree.selectedNodes?.forEach((n) => n.deselect());

    let firstNode: NodeApi<ArboristNodeData> | null = null;

    // выделяем root
    if (selectedObjectIds?.length) {
      selectedObjectIds.forEach((id, i) => {
        const node = tree.get(String(id));
        if (node) {
          if (i === 0 && !firstNode) {
            firstNode = node;
          }
          if (i === 0) {
            node.select();
          } else {
            node.selectMulti();
          }
        }
      });
    }

    // выделяем child
    if (selectedChildId) {
      const node = tree.get(String(selectedChildId.childId));
      if (node) {
        if (!firstNode) firstNode = node;
        node.select();
      }
    }
    // фокус на первый выделенный
    firstNode?.focus();
  }, [selectedObjectIds, selectedChildId]);

  return (
    <Tree
      ref={treeRef}
      data={treeData}
      rowHeight={34}
      // height={400}
      width={300}
      indent={18}
      overscanCount={5}
      disableEdit={false}
      onSelect={handleSelect}
    >
      {TreeNode}
    </Tree>
  );
};

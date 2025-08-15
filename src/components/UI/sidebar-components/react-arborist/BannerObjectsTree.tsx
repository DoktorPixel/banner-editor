import React, { useMemo, useRef, useEffect } from "react";
import { Tree, NodeApi, TreeApi } from "react-arborist";
import { useBanner } from "../../../../context/BannerContext";
import { convertObjectsToTree, ArboristNodeData } from "./convertObjectsToTree";
import { TreeNode } from "./TreeNode";
import { BannerObject } from "../../../../types";

export const BannerObjectsTree: React.FC = () => {
  const {
    objects,
    selectedObjectIds,
    selectedChildId,
    selectObject,
    selectChild,
    clearChildSelection,
    updateMultipleObjects,
  } = useBanner();

  const treeRef = useRef<TreeApi<ArboristNodeData> | null>(null);
  const treeData = useMemo(() => {
    const sortedObjects = [...objects].sort((a, b) => {
      const zIndexA = a.zIndex === undefined ? -Infinity : a.zIndex;
      const zIndexB = b.zIndex === undefined ? -Infinity : b.zIndex;
      return zIndexB - zIndexA;
    });
    return convertObjectsToTree(sortedObjects);
  }, [objects]);

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

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;

    const noRootSel = !selectedObjectIds || selectedObjectIds.length === 0;
    const noChildSel = !selectedChildId;
    if (noRootSel && noChildSel) {
      tree.selectedNodes?.forEach((n) => n.deselect());
      return;
    }

    tree.selectedNodes?.forEach((n) => n.deselect());
    let firstNode: NodeApi<ArboristNodeData> | null = null;

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
    if (selectedChildId) {
      const node = tree.get(String(selectedChildId.childId));
      if (node) {
        if (!firstNode) firstNode = node;
        node.select();
      }
    }
    firstNode?.focus();
  }, [selectedObjectIds, selectedChildId]);

  const handleMove = ({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) => {
    if (parentId !== null) {
      // Only allow reordering of root objects
      return;
    }

    const draggedObjectIds = new Set(dragIds.map((id) => parseInt(id, 10)));
    const rootObjects = objects.filter(
      (obj) => obj.abstractGroupId === null || obj.abstractGroupId === undefined
    );

    const otherRootObjects = rootObjects.filter(
      (obj) => !draggedObjectIds.has(obj.id)
    );
    const draggedObjects = rootObjects.filter((obj) =>
      draggedObjectIds.has(obj.id)
    );

    // Create a new ordered list of objects
    const newOrder: BannerObject[] = [
      ...otherRootObjects.slice(0, index),
      ...draggedObjects,
      ...otherRootObjects.slice(index),
    ];

    const updates: Record<number, Partial<BannerObject>> = {};
    newOrder.forEach((obj, idx) => {
      if (obj.zIndex !== idx) {
        updates[obj.id] = { zIndex: idx };
      }
    });

    if (Object.keys(updates).length > 0) {
      updateMultipleObjects(updates);
    }
  };

  return (
    <Tree
      ref={treeRef}
      data={treeData}
      rowHeight={34}
      width={300}
      indent={18}
      overscanCount={5}
      disableEdit={false}
      onSelect={handleSelect}
      onMove={handleMove}
    >
      {TreeNode}
    </Tree>
  );
};

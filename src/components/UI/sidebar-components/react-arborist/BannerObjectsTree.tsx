// react-arborist/BannerObjectsTree.tsx
import React, { useMemo, useRef, useEffect } from "react";
import { Tree, TreeApi } from "react-arborist";
import { useBanner } from "../../../../context/BannerContext";
import { convertObjectsToTree, ArboristNodeData } from "./convertObjectsToTree";
import { TreeNode } from "./TreeNode";
import { handleSelectFactory, syncSelectionWithTree } from "./helpers";
import { handleMoveFactory } from "./helpers";

export const BannerObjectsTree: React.FC = () => {
  const {
    objects,
    selectedObjectIds,
    selectedChildId,
    selectObject,
    selectChild,
    clearChildSelection,
    clearSelection,
    updateMultipleObjects,
    selectAllObjects,
    moveObjectsToFlexGroup,
    removeObjectsFromFlexGroup,
  } = useBanner();

  const treeRef = useRef<TreeApi<ArboristNodeData> | null>(null);
  const selectedAbstractRootIdsRef = useRef<Set<string>>(new Set());
  const isApplyingSelection = useRef(false);

  const sortedObjects = useMemo(() => {
    return [...objects].sort(
      (a, b) => (b.zIndex ?? -Infinity) - (a.zIndex ?? -Infinity)
    );
  }, [objects]);

  const treeData = useMemo(
    () => convertObjectsToTree(sortedObjects),
    [sortedObjects]
  );

  const handleSelect = useMemo(
    () =>
      handleSelectFactory(
        {
          clearChildSelection,
          clearSelection,
          selectObject,
          selectChild,
          selectAllObjects,
        },
        selectedAbstractRootIdsRef,
        isApplyingSelection
      ),
    []
  );

  const handleMove = useMemo(
    () =>
      handleMoveFactory(objects, sortedObjects, {
        updateMultipleObjects,
        moveObjectsToFlexGroup,
        removeObjectsFromFlexGroup,
      }),
    [
      objects,
      sortedObjects,
      updateMultipleObjects,
      moveObjectsToFlexGroup,
      removeObjectsFromFlexGroup,
    ]
  );

  useEffect(() => {
    syncSelectionWithTree(
      treeRef.current,
      selectedObjectIds,
      selectedChildId,
      selectedAbstractRootIdsRef,
      isApplyingSelection
    );
  }, [selectedObjectIds, selectedChildId]);

  return (
    <Tree
      ref={treeRef}
      data={treeData}
      rowHeight={34}
      width={"100%"}
      height={600}
      indent={18}
      overscanCount={5}
      disableEdit={false}
      onSelect={handleSelect}
      onMove={handleMove}
      openByDefault={false}
    >
      {TreeNode}
    </Tree>
  );
};

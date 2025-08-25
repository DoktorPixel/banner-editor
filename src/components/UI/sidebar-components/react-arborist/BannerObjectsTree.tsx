// react-arborist/BannerObjectsTree.tsx
import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { Tree, TreeApi } from "react-arborist";
import { useBanner } from "../../../../context/BannerContext";
import { convertObjectsToTree, ArboristNodeData } from "./convertObjectsToTree";
import { TreeNode } from "./TreeNode";
import { handleSelectFactory, syncSelectionWithTree } from "./helpers";
import { handleMoveFactory } from "./helpers";
import { GroupOnDropProvider, useGroupOnDrop } from "./useGroupOnDrop";

import { GroupOnDropDialog } from "../../dialogs/GroupOnDropDialog";
import type { BannerObject } from "../../../../types/index";

// ————— ВСПОМОГАТЕЛЬНЫЕ ХЕЛПЕРЫ (локальные «группировки по id») —————
function useGroupHelpers() {
  const {
    objects,
    updateMultipleObjects,
    updateHistory,
    setSelectedObjectIds,
  } = useBanner();

  const groupAbstractByIds = useCallback(
    (ids: number[]) => {
      if (!ids || ids.length < 2) return;
      const newAbstractGroupId = Date.now();
      const updates = ids.reduce((acc, id) => {
        acc[id] = { abstractGroupId: newAbstractGroupId };
        return acc;
      }, {} as Record<number, Partial<BannerObject>>);
      updateMultipleObjects(updates);
    },
    [updateMultipleObjects]
  );

  const groupFlexByIds = useCallback(
    (ids: number[]) => {
      if (!ids || ids.length < 2) return;
      const selectedObjects = objects.filter((o) => ids.includes(o.id));
      if (selectedObjects.length < 2) return;

      const minX = Math.min(...selectedObjects.map((o) => o.x ?? 0));
      const minY = Math.min(...selectedObjects.map((o) => o.y ?? 0));
      const maxZIndex = objects.reduce(
        (max, obj) => Math.max(max, obj.zIndex ?? 0),
        0
      );

      const newGroup: BannerObject = {
        id: Date.now(),
        type: "group",
        x: minX,
        y: minY,
        width:
          Math.max(
            ...selectedObjects.map((o) => (o.x ?? 0) + (o.width ?? 100))
          ) - minX,
        height:
          Math.max(
            ...selectedObjects.map((o) => (o.y ?? 0) + (o.height ?? 100))
          ) - minY,
        zIndex: maxZIndex + 1,
        children: selectedObjects.map(
          ({ id, x, y, children = [], ...rest }, index) => ({
            id,
            x: (x ?? 0) - minX,
            y: (y ?? 0) - minY,
            order: index,
            children:
              children.length > 0
                ? children.map((child) => ({ ...child }))
                : [],
            ...rest,
          })
        ),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      };

      const newObjects = objects.filter((obj) => !ids.includes(obj.id));
      updateHistory([...newObjects, newGroup]);
      setSelectedObjectIds([newGroup.id]);
    },
    [objects, updateHistory, setSelectedObjectIds]
  );

  return { groupAbstractByIds, groupFlexByIds };
}

// ————— ВНУТРЕННЯЯ ОБЁРТКА, ЧТОБЫ ИМЕТЬ ДОСТУП К useGroupOnDrop —————
const InnerTree: React.FC = () => {
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
  } = useBanner();

  const { groupAbstractByIds, groupFlexByIds } = useGroupHelpers();

  const treeRef = useRef<TreeApi<ArboristNodeData> | null>(null);
  const selectedAbstractRootIdsRef = useRef<Set<string>>(new Set());
  const isApplyingSelection = useRef(false);

  const {
    open,
    chooseAbstract,
    chooseFlex,
    closeDialog,
    proposeGroup,
    getHoveredRootId,
    setHandlers,
  } = useGroupOnDrop();

  // Сортировка по zIndex desc — как раньше
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
    [
      clearChildSelection,
      clearSelection,
      selectObject,
      selectChild,
      selectAllObjects,
    ]
  );

  // Помощник: из pending.dragIds/targetRootId собрать фактический набор ids
  const buildIdsForGrouping = useCallback(
    (dragIds: number[], targetRootId: number) => {
      const set = new Set<number>();
      if (selectedObjectIds.length >= 2) {
        selectedObjectIds.forEach((id) => set.add(id));
        set.add(targetRootId);
      } else {
        dragIds.forEach((id) => set.add(id));
        set.add(targetRootId);
      }
      return Array.from(set);
    },
    [selectedObjectIds]
  );

  // Добавляем функцию canDrop для Tree компонента
  // const handleCanDrop = useCallback(
  //   (dragIds: string[], parentId: string | null, index: number): boolean => {
  //     // Логика canDrop: разрешаем дроп только если это корневой элемент и не абстрактная группа
  //     // А также, если мы дропаем НА другой корневой элемент (не между элементами)

  //     const draggedObjectIds = dragIds.map(Number).filter((id) => !isNaN(id));
  //     if (draggedObjectIds.length === 0) return false;

  //     const allDraggedAreRoot = draggedObjectIds.every((draggedId) => {
  //       const obj = objects.find((o) => o.id === draggedId);
  //       return obj && obj.abstractGroupId == null && obj.type !== "group";
  //     });

  //     if (!allDraggedAreRoot) return false;

  //     // Проверяем, является ли целевой элемент корневым и не абстрактной группой
  //     const targetNodeId =
  //       parentId === null ? getHoveredRootId() : Number(parentId);
  //     if (targetNodeId == null || isNaN(targetNodeId)) return false;

  //     const targetObject = objects.find((o) => o.id === targetNodeId);

  //     const isTargetRealRoot =
  //       targetObject &&
  //       targetObject.abstractGroupId == null &&
  //       targetObject.type !== "group";

  //     // Если целевой элемент является "реальным" корневым и не является одним из перетаскиваемых
  //     if (isTargetRealRoot && !draggedObjectIds.includes(targetNodeId)) {
  //       // Мы хотим разрешить "drop НА" только, если это корневой элемент, а не между
  //       // Для этого мы проверяем, что parentId === null и есть hovered элемент
  //       if (parentId === null && getHoveredRootId() === targetNodeId) {
  //         return true;
  //       }
  //     }

  //     return false;
  //   },
  //   [objects, getHoveredRootId]
  // );

  // Передаём обработчики для диалога
  useEffect(() => {
    setHandlers({
      onAbstract: ({ dragIds, targetRootId }) => {
        const ids = buildIdsForGrouping(dragIds, targetRootId);
        if (ids.length >= 2) groupAbstractByIds(ids);
      },
      onFlex: ({ dragIds, targetRootId }) => {
        const ids = buildIdsForGrouping(dragIds, targetRootId);
        if (ids.length >= 2) groupFlexByIds(ids);
      },
    });
  }, [setHandlers, buildIdsForGrouping, groupAbstractByIds, groupFlexByIds]);

  const handleMove = useMemo(
    () =>
      handleMoveFactory(
        objects,
        sortedObjects,
        updateMultipleObjects,
        // proposeGroup: показать диалог
        ({ dragIds, targetRootId }) => proposeGroup({ dragIds, targetRootId }),
        // getHovered
        () => getHoveredRootId()
      ),
    [
      objects,
      sortedObjects,
      updateMultipleObjects,
      proposeGroup,
      getHoveredRootId,
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
    <>
      <Tree
        ref={treeRef}
        data={treeData}
        rowHeight={34}
        width={"100%"}
        indent={18}
        overscanCount={5}
        disableEdit={false}
        onSelect={handleSelect}
        onMove={handleMove}
        openByDefault={false}
        // canDrop={handleCanDrop} // Активируем canDrop
      >
        {TreeNode}
      </Tree>

      {/* Диалог выбора типа группы */}
      <GroupOnDropDialog
        open={open}
        onClose={closeDialog}
        onCreateAbstract={chooseAbstract}
        onCreateFlex={chooseFlex}
      />
    </>
  );
};

export const BannerObjectsTree: React.FC = () => {
  return (
    <GroupOnDropProvider>
      <InnerTree />
    </GroupOnDropProvider>
  );
};

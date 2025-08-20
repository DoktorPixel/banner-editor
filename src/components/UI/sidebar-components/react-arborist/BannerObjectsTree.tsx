// react-arborist/BannerObjectsTree.tsx
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
    clearSelection,
    updateMultipleObjects,
    selectAllObjects,
  } = useBanner();

  const treeRef = useRef<TreeApi<ArboristNodeData> | null>(null);

  // Сет root-узлов абстрактных групп, которые пользователь выделил в дереве (id узла в дереве: "abstract-group-N")
  const selectedAbstractRootIdsRef = useRef<Set<string>>(new Set());

  // Флаг — когда мы программно применяем выделение к дереву, игнорируем входящий onSelect
  const isApplyingSelection = useRef(false);

  const treeData = useMemo(() => {
    const sortedObjects = [...objects].sort((a, b) => {
      const zIndexA =
        a.zIndex === undefined || a.zIndex === null ? -Infinity : a.zIndex;
      const zIndexB =
        b.zIndex === undefined || b.zIndex === null ? -Infinity : b.zIndex;
      return zIndexB - zIndexA;
    });
    return convertObjectsToTree(sortedObjects);
  }, [objects]);

  /**
   * onSelect: вызывается библиотекой Tree, когда пользователь изменил выделение в дереве.
   * Здесь мы синхронизируем выделение на рабочей области (useBanner).
   *
   * ВАЖНО: если isApplyingSelection.current === true — это значит, что вызов onSelect пришёл
   * из наших программных изменений (useEffect ниже) — в этом случае пропускаем обработку.
   */
  const handleSelect = (nodes: NodeApi<ArboristNodeData>[]) => {
    if (isApplyingSelection.current) {
      // игнорируем события, порождённые программным применением выделения
      return;
    }

    // Если ничего не выбрано — очистка
    if (!Array.isArray(nodes) || nodes.length === 0) {
      selectedAbstractRootIdsRef.current = new Set();
      clearChildSelection();
      clearSelection();
      return;
    }

    // Сохраним, какие корни виртуальных групп сейчас выделены в дереве
    const groupRootIds = new Set<string>();
    nodes.forEach((n) => {
      if (n.data.isAbstractGroup) groupRootIds.add(n.id);
    });
    selectedAbstractRootIdsRef.current = groupRootIds;

    // Синхронизируем рабочую область
    clearChildSelection();

    nodes.forEach((n, index) => {
      const data = n.data;
      const multi = index > 0;

      // Если это потомок виртуальной группы — обычный одиночный объект
      if (n.parent?.data?.isAbstractGroup) {
        selectObject(data.originalId, multi);
        return;
      }

      // Клик по корню виртуальной группы — выделить ВСЕ объекты группы на рабочей области
      if (data.isAbstractGroup) {
        // selectAllObjects использует originalId первого объекта группы (мы сохранили его в convertObjectsToTree)
        selectAllObjects(data.originalId, multi);
        return;
      }

      // Дети реальных узлов (nested children) — selectChild
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
        // обычный корневой объект
        selectObject(data.originalId, multi);
      }
    });
  };

  /**
   * Когда в контексте изменилось selectedObjectIds / selectedChildId — применяем выделение к дереву.
   * Здесь мы:
   *  - снимаем текущее выделение в дереве
   *  - выделяем ноды, соответствующие selectedObjectIds и selectedChildId
   *  - если все дети абстрактной группы выбраны (или ранее в дереве user выделил root), селектим корень группы тоже
   *
   * Используем isApplyingSelection, чтобы не реагировать на `onSelect`, который будет срабатывать при programmatic select.
   */
  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;

    // защита от re-entrancy
    if (isApplyingSelection.current) return;
    isApplyingSelection.current = true;

    // Если нет выделения — просто сбросим выделение в дереве
    const noRootSel = !selectedObjectIds || selectedObjectIds.length === 0;
    const noChildSel = !selectedChildId;
    if (noRootSel && noChildSel) {
      tree.selectedNodes?.forEach((n) => n.deselect());
      isApplyingSelection.current = false;
      return;
    }

    // Снимаем текущее выделение
    tree.selectedNodes?.forEach((n) => n.deselect());

    // Выделяем ноды для selectedObjectIds
    let firstNode: NodeApi<ArboristNodeData> | null = null;
    const selectedSet = new Set(selectedObjectIds ?? []);

    if (selectedObjectIds?.length) {
      selectedObjectIds.forEach((id, i) => {
        const node = tree.get(String(id));
        if (!node) return;
        if (!firstNode) firstNode = node;
        if (i === 0) node.select();
        else node.selectMulti();
      });
    }

    // selectedChildId (если есть) — выделяем дочерний узел
    if (selectedChildId) {
      const childNode = tree.get(String(selectedChildId.childId));
      if (childNode) {
        if (!firstNode) firstNode = childNode;
        childNode.select();
      }
    }

    // Если для некоторой virtual-group все её children входят в selectedSet,
    // то выделим и root-group-узел в дереве (чтобы root тоже выглядел выделенным).
    // Это работает и для свернутой, и для развернутой группы.
    tree.root?.children?.forEach((rootNode) => {
      if (!rootNode.data?.isAbstractGroup) return;
      const childIds = rootNode.children?.map((c) => c.data.originalId) ?? [];
      const allSelected =
        childIds.length > 0 && childIds.every((id) => selectedSet.has(id));
      // Или если пользователь явно кликнул на root ранее — тоже держим root выделенным
      const userClickedRoot = selectedAbstractRootIdsRef.current.has(
        rootNode.id
      );
      if (allSelected || userClickedRoot) {
        // selectMulti чтобы не перезаписывать порядок множественного выделения
        if (!firstNode) firstNode = rootNode;
        rootNode.selectMulti();
      }
    });

    // фокусируем на первом выбранном
    firstNode?.focus();

    isApplyingSelection.current = false;
  }, [selectedObjectIds, selectedChildId, treeRef.current]);

  const handleMove = ({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) => {
    if (parentId !== null) return;

    const draggedObjectIds = new Set(dragIds.map((id) => parseInt(id, 10)));

    const rootObjects = objects
      .filter((obj) => obj.abstractGroupId == null)
      .sort((a, b) => (b.zIndex ?? -Infinity) - (a.zIndex ?? -Infinity));

    const otherRootObjects = rootObjects.filter(
      (obj) => !draggedObjectIds.has(obj.id)
    );
    const draggedObjects = rootObjects.filter((obj) =>
      draggedObjectIds.has(obj.id)
    );

    let adjustedIndex = index;
    const firstDraggedIndex = rootObjects.findIndex((obj) =>
      draggedObjectIds.has(obj.id)
    );
    if (firstDraggedIndex < index) {
      adjustedIndex -= draggedObjects.length;
    }

    const newOrder: BannerObject[] = [
      ...otherRootObjects.slice(0, adjustedIndex),
      ...draggedObjects,
      ...otherRootObjects.slice(adjustedIndex),
    ];

    const total = newOrder.length;
    const updates: Record<number, Partial<BannerObject>> = {};
    newOrder.forEach((obj, idx) => {
      const newZ = total - 1 - idx;
      if (obj.zIndex !== newZ) {
        updates[obj.id] = { zIndex: newZ };
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
      width={"100%"}
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

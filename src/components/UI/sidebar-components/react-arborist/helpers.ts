import { NodeApi, TreeApi } from "react-arborist";
import { ArboristNodeData } from "./convertObjectsToTree";
import { BannerObject, BannerChild } from "../../../../types";
import { MutableRefObject } from "react";

export function updateNodeName(
  data: ArboristNodeData,
  newName: string,
  updateObject: (id: number, updates: Partial<BannerObject>) => void,
  updateChild: (
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => void,
  updateNestedChild: (
    parentId: number,
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => void,
  node: NodeApi<ArboristNodeData>
) {
  const trimmed = newName.trim();
  if (data.parentId) {
    const parentNode = node.parent;
    if (parentNode?.data?.parentId) {
      updateNestedChild(
        parentNode.parent!.data.originalId,
        parentNode.data.originalId,
        data.originalId,
        { name: trimmed || undefined }
      );
    } else {
      updateChild(data.parentId, data.originalId, {
        name: trimmed || undefined,
      });
    }
  } else {
    updateObject(data.originalId, { name: trimmed || undefined });
  }
}

// react-arborist/selectionHelpers.ts
type BannerApi = {
  clearChildSelection: () => void;
  clearSelection: () => void;
  selectObject: (id: number, multi?: boolean) => void;
  selectChild: (
    parentId: number,
    childId: number,
    grandParentId?: number
  ) => void;
  selectAllObjects: (groupId: number, multi?: boolean) => void;
};

export function handleSelectFactory(
  bannerApi: BannerApi,
  selectedAbstractRootIdsRef: MutableRefObject<Set<string>>,
  isApplyingSelection: MutableRefObject<boolean>
) {
  const {
    clearChildSelection,
    clearSelection,
    selectObject,
    selectChild,
    selectAllObjects,
  } = bannerApi;

  return function handleSelect(nodes: NodeApi<ArboristNodeData>[]) {
    if (isApplyingSelection.current) return;

    if (!Array.isArray(nodes) || nodes.length === 0) {
      selectedAbstractRootIdsRef.current = new Set();
      clearChildSelection();
      clearSelection();
      return;
    }

    const groupRootIds = new Set<string>();

    nodes.forEach((n) => {
      // если сам выбранный узел — корень абстрактной группы
      if (n.data?.isAbstractGroup) {
        groupRootIds.add(n.id);
        return;
      }

      // если выбранный узел — дочерний элемент, у которого родитель — абстрактная группа,
      // то тоже считаем, что пользователь кликнул по корню группы
      const parent = n.parent;
      if (parent?.data?.isAbstractGroup) {
        // parent.id — это id узла вида "abstract-group-<gid>"
        groupRootIds.add(parent.id);
        return;
      }

      // дополнительная страховка: иногда Tree может отдавать grandparent
      // или иную структуру — пробуем найти ближайшего предка с isAbstractGroup
      let p = parent;
      while (p) {
        if (p.data?.isAbstractGroup) {
          groupRootIds.add(p.id);
          break;
        }
        p = p.parent;
      }
    });

    selectedAbstractRootIdsRef.current = groupRootIds;

    clearChildSelection();

    nodes.forEach((n, index) => {
      const data = n.data;
      const multi = index > 0;

      if (n.parent?.data?.isAbstractGroup) {
        selectObject(data.originalId, multi);
        return;
      }
      if (data.isAbstractGroup) {
        selectAllObjects(data.originalId, multi);
        return;
      }

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
        selectObject(data.originalId, multi);
      }
    });
  };
}

export function syncSelectionWithTree(
  tree: TreeApi<ArboristNodeData> | null,
  selectedObjectIds: number[] | null,
  selectedChildId: { parentId?: number; childId: number } | null,
  selectedAbstractRootIdsRef: React.MutableRefObject<Set<string>>,
  isApplyingSelection: React.MutableRefObject<boolean>
) {
  if (!tree) return;
  if (isApplyingSelection.current) return;
  isApplyingSelection.current = true;

  const noRootSel = !selectedObjectIds || selectedObjectIds.length === 0;
  const noChildSel = !selectedChildId;
  if (noRootSel && noChildSel) {
    tree.selectedNodes?.forEach((n) => n.deselect());
    isApplyingSelection.current = false;
    return;
  }
  tree.selectedNodes?.forEach((n) => n.deselect());

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

  if (selectedChildId) {
    const childNode = tree.get(String(selectedChildId.childId));
    if (childNode) {
      if (!firstNode) firstNode = childNode;
      childNode.select();
    }
  }

  tree.root?.children?.forEach((rootNode) => {
    if (!rootNode.data?.isAbstractGroup) return;
    const childIds = rootNode.children?.map((c) => c.data.originalId) ?? [];
    const allSelected =
      childIds.length > 0 && childIds.every((id) => selectedSet.has(id));
    const userClickedRoot = selectedAbstractRootIdsRef.current.has(rootNode.id);
    if (allSelected || userClickedRoot) {
      if (!firstNode) firstNode = rootNode;
      rootNode.selectMulti();
    }
  });

  firstNode?.focus();

  isApplyingSelection.current = false;
}

export function buildRootEntities(objects: BannerObject[]) {
  const seenGroups = new Set<number>();
  const entities: {
    id: string;
    type: "single" | "group";
    memberIds: number[];
  }[] = [];

  for (const obj of objects) {
    if (obj.abstractGroupId != null) {
      const gid = obj.abstractGroupId;
      if (seenGroups.has(gid)) continue;
      seenGroups.add(gid);
      const members = objects.filter((o) => o.abstractGroupId === gid);
      entities.push({
        id: `abstract-group-${gid}`,
        type: "group",
        memberIds: members.map((m) => m.id),
      });
    } else {
      entities.push({
        id: String(obj.id),
        type: "single",
        memberIds: [obj.id],
      });
    }
  }
  return entities;
}

/** Применяет updates (partial) к копии sortedObjects, возвращает новый массив */
function applyUpdatesToSorted(
  sortedObjects: BannerObject[],
  updates: Record<number, Partial<BannerObject>>
) {
  if (!updates || Object.keys(updates).length === 0) return [...sortedObjects];
  return sortedObjects.map((o) =>
    updates[o.id] ? { ...o, ...updates[o.id] } : o
  );
}

export function handleMoveFactory(
  objects: BannerObject[],
  sortedObjects: BannerObject[],
  options: {
    updateMultipleObjects: (
      updates: Record<number, Partial<BannerObject>>
    ) => void;
    moveObjectsToFlexGroup?: (
      ids: number[],
      parentGroupId: number,
      atIndex?: number
    ) => void;
    removeObjectsFromFlexGroup?: (
      ids: number[],
      parentGroupId?: number,
      atIndex?: number
    ) => void;
  }
) {
  const {
    updateMultipleObjects,
    moveObjectsToFlexGroup,
    removeObjectsFromFlexGroup,
  } = options;

  return function handleMove({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) {
    const dragIdsStr = dragIds;
    const dragIdsNum = dragIds
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));

    function recalcZForRootFromEntities(
      entities: { id: string; memberIds: number[] }[]
    ) {
      const flattened: number[] = [];
      for (const ent of entities) flattened.push(...ent.memberIds);
      const total = flattened.length;
      const updates: Record<number, Partial<BannerObject>> = {};
      flattened.forEach((objId, pos) => {
        const newZ = total - 1 - pos;
        const existing = objects.find((o) => o.id === objId);
        if (!existing) return;
        if (existing.zIndex !== newZ) updates[objId] = { zIndex: newZ };
      });
      if (Object.keys(updates).length > 0) updateMultipleObjects(updates);
    }

    // === 1) Drop to root (parentId === null) ===
    if (parentId === null) {
      // Если dragged содержат детей из flex-групп -> извлечь их в root
      const childrenToExtract: number[] = [];
      for (const id of dragIdsNum) {
        // если id соответствует child (т.е. есть группа, в children которой этот id) — пометим
        const isChild = objects.some(
          (o) =>
            o.type === "group" &&
            Array.isArray(o.children) &&
            o.children.some((ch) => ch.id === id)
        );
        if (isChild) childrenToExtract.push(id);
      }

      if (childrenToExtract.length > 0) {
        if (!removeObjectsFromFlexGroup) {
          console.warn(
            "handleMove: removeObjectsFromFlexGroup not provided but needed"
          );
        } else {
          // извлекаем детей в root (promote)
          removeObjectsFromFlexGroup(childrenToExtract);
        }
      }

      // === дальше — существующая логика по перемещению root-entities ===
      const needUnset: Record<number, Partial<BannerObject>> = {};
      for (const id of dragIdsNum) {
        const existing = objects.find((o) => o.id === id);
        if (existing && existing.abstractGroupId != null) {
          needUnset[id] = { abstractGroupId: null };
        }
      }

      const locallyUpdatedSorted = applyUpdatesToSorted(
        sortedObjects,
        needUnset
      );

      if (Object.keys(needUnset).length > 0) {
        updateMultipleObjects(needUnset);
      }

      const entities = buildRootEntities(locallyUpdatedSorted);
      const draggedEntityIds = new Set<string>(dragIdsStr);

      const firstDraggedIndex = entities.findIndex((e) =>
        draggedEntityIds.has(e.id)
      );
      if (firstDraggedIndex === -1) {
        const draggedEntityIdsDerived = new Set<string>();
        for (const ent of entities) {
          for (const mem of ent.memberIds) {
            if (dragIdsNum.includes(mem)) draggedEntityIdsDerived.add(ent.id);
          }
        }
        if (draggedEntityIdsDerived.size === 0) {
          console.warn(
            "handleMove (to root): Could not find dragged entity",
            dragIds
          );
          return;
        }
        const draggedEntities = entities.filter((e) =>
          draggedEntityIdsDerived.has(e.id)
        );
        const otherEntities = entities.filter(
          (e) => !draggedEntityIdsDerived.has(e.id)
        );

        let adjustedIndex = index;
        if (adjustedIndex < 0) adjustedIndex = 0;
        if (adjustedIndex > otherEntities.length)
          adjustedIndex = otherEntities.length;

        const newEntities = [
          ...otherEntities.slice(0, adjustedIndex),
          ...draggedEntities,
          ...otherEntities.slice(adjustedIndex),
        ];

        recalcZForRootFromEntities(newEntities);
        return;
      }

      const draggedEntities = entities.filter((e) =>
        draggedEntityIds.has(e.id)
      );
      const otherEntities = entities.filter((e) => !draggedEntityIds.has(e.id));

      let adjustedIndex = index;
      if (firstDraggedIndex < index) adjustedIndex -= draggedEntities.length;
      if (adjustedIndex < 0) adjustedIndex = 0;
      if (adjustedIndex > otherEntities.length)
        adjustedIndex = otherEntities.length;

      const newEntities = [
        ...otherEntities.slice(0, adjustedIndex),
        ...draggedEntities,
        ...otherEntities.slice(adjustedIndex),
      ];

      recalcZForRootFromEntities(newEntities);
      return;
    }

    // === 2) Drop inside abstract-group (unchanged) ===
    if (
      typeof parentId === "string" &&
      parentId.startsWith("abstract-group-")
    ) {
      const gid = Number(parentId.replace("abstract-group-", ""));
      const updates: Record<number, Partial<BannerObject>> = {};
      for (const id of dragIdsNum) updates[id] = { abstractGroupId: gid };

      const locallyUpdatedSorted = applyUpdatesToSorted(sortedObjects, updates);
      if (Object.keys(updates).length > 0) updateMultipleObjects(updates);

      const groupMembers = locallyUpdatedSorted.filter(
        (o) => o.abstractGroupId === gid
      );
      const draggedSet = new Set<number>(dragIdsNum);
      const dragged = groupMembers.filter((m) => draggedSet.has(m.id));
      const others = groupMembers.filter((m) => !draggedSet.has(m.id));

      let adjustedIndex = index;
      const firstDraggedIndex = groupMembers.findIndex((m) =>
        draggedSet.has(m.id)
      );
      if (firstDraggedIndex !== -1 && firstDraggedIndex < index)
        adjustedIndex -= dragged.length;
      if (adjustedIndex < 0) adjustedIndex = 0;
      if (adjustedIndex > others.length) adjustedIndex = others.length;

      const newGroupOrder = [
        ...others.slice(0, adjustedIndex),
        ...dragged,
        ...others.slice(adjustedIndex),
      ];

      const filtered = locallyUpdatedSorted.filter(
        (o) => o.abstractGroupId !== gid
      );
      const firstIndexInNew = locallyUpdatedSorted.findIndex(
        (o) => o.abstractGroupId === gid
      );
      const insertPos =
        firstIndexInNew === -1 ? filtered.length : firstIndexInNew;

      filtered.splice(insertPos, 0, ...newGroupOrder);

      const total = filtered.length;
      const zUpdates: Record<number, Partial<BannerObject>> = {};
      filtered.forEach((obj, pos) => {
        const newZ = total - 1 - pos;
        if (obj.zIndex !== newZ) zUpdates[obj.id] = { zIndex: newZ };
      });
      if (Object.keys(zUpdates).length > 0) updateMultipleObjects(zUpdates);
      return;
    }

    // === 3) Drop inside real flex-group (parentId === "<groupId>") ===
    const parentNumeric = Number(parentId);
    const parentObj = objects.find((o) => o.id === parentNumeric);
    if (parentObj && parentObj.type === "group") {
      // вычислим фактические member ids для перетаскиваемых (учитывая abstract-groups и одиночные id)
      const draggedMemberIds: number[] = [];
      for (const idStr of dragIdsStr) {
        if (typeof idStr === "string" && idStr.startsWith("abstract-group-")) {
          const gid = Number(idStr.replace("abstract-group-", ""));
          const members = sortedObjects
            .filter((o) => o.abstractGroupId === gid)
            .map((m) => m.id);
          draggedMemberIds.push(...members);
        } else {
          const num = Number(idStr);
          if (!Number.isNaN(num)) draggedMemberIds.push(num);
        }
      }

      // вызываем moveObjectsToFlexGroup (должен выполнить структурные изменения объектов)
      if (!moveObjectsToFlexGroup) {
        console.warn("handleMove: moveObjectsToFlexGroup not provided");
        return;
      }
      moveObjectsToFlexGroup(draggedMemberIds, parentNumeric, index);

      // удалим abstractGroupId если был
      const clearAbstract: Record<number, Partial<BannerObject>> = {};
      draggedMemberIds.forEach((id) => {
        const o = objects.find((x) => x.id === id);
        if (o && o.abstractGroupId != null)
          clearAbstract[id] = { abstractGroupId: null };
      });
      if (Object.keys(clearAbstract).length > 0)
        updateMultipleObjects(clearAbstract);

      // пересчитаем zIndex для оставшихся root (удаляем moved ids из sortedObjects и пересчитываем)
      const filtered = sortedObjects.filter(
        (o) => !draggedMemberIds.includes(o.id)
      );
      const total = filtered.length;
      const zUpdates: Record<number, Partial<BannerObject>> = {};
      filtered.forEach((obj, pos) => {
        const newZ = total - 1 - pos;
        if (obj.zIndex !== newZ) zUpdates[obj.id] = { zIndex: newZ };
      });
      if (Object.keys(zUpdates).length > 0) updateMultipleObjects(zUpdates);

      return;
    }

    console.warn("handleMove: unsupported parentId case", parentId);
  };
}

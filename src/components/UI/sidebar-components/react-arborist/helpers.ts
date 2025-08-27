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
    const dragIdsNum = dragIds
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    const pendingUpdates: Record<number, Partial<BannerObject>> = {};

    function recalcZForRootFromEntities(
      entities: { id: string; memberIds: number[] }[]
    ) {
      const flattened: number[] = [];
      for (const ent of entities) flattened.push(...ent.memberIds);
      const total = flattened.length;

      flattened.forEach((objId, pos) => {
        const newZ = total - 1 - pos;
        const existing = objects.find((o) => o.id === objId);
        if (!existing) return;
        if (existing.zIndex !== newZ) pendingUpdates[objId] = { zIndex: newZ };
      });
    }

    // === 1) Drop to root ===
    if (parentId === null) {
      const childrenToExtract: number[] = [];
      for (const id of dragIdsNum) {
        const isChild = objects.some(
          (o) =>
            o.type === "group" &&
            Array.isArray(o.children) &&
            o.children.some((ch) => ch.id === id)
        );
        if (isChild) childrenToExtract.push(id);
      }

      if (childrenToExtract.length > 0 && removeObjectsFromFlexGroup) {
        removeObjectsFromFlexGroup(childrenToExtract);
      }

      for (const id of dragIdsNum) {
        const existing = objects.find((o) => o.id === id);
        if (existing && existing.abstractGroupId != null) {
          pendingUpdates[id] = { ...pendingUpdates[id], abstractGroupId: null };
        }
      }

      const locallyUpdatedSorted = applyUpdatesToSorted(
        sortedObjects,
        pendingUpdates
      );

      const entities = buildRootEntities(locallyUpdatedSorted);
      const draggedEntityIds = new Set<string>(dragIds);

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
        if (draggedEntityIdsDerived.size === 0) return;

        const draggedEntities = entities.filter((e) =>
          draggedEntityIdsDerived.has(e.id)
        );
        const otherEntities = entities.filter(
          (e) => !draggedEntityIdsDerived.has(e.id)
        );

        const adjustedIndex = Math.max(
          0,
          Math.min(index, otherEntities.length)
        );

        const newEntities = [
          ...otherEntities.slice(0, adjustedIndex),
          ...draggedEntities,
          ...otherEntities.slice(adjustedIndex),
        ];

        recalcZForRootFromEntities(newEntities);
      } else {
        const draggedEntities = entities.filter((e) =>
          draggedEntityIds.has(e.id)
        );
        const otherEntities = entities.filter(
          (e) => !draggedEntityIds.has(e.id)
        );

        let adjustedIndex = index;
        if (firstDraggedIndex < index) adjustedIndex -= draggedEntities.length;
        adjustedIndex = Math.max(
          0,
          Math.min(adjustedIndex, otherEntities.length)
        );

        const newEntities = [
          ...otherEntities.slice(0, adjustedIndex),
          ...draggedEntities,
          ...otherEntities.slice(adjustedIndex),
        ];

        recalcZForRootFromEntities(newEntities);
      }
    }

    // === 2) Drop inside abstract-group ===
    else if (
      typeof parentId === "string" &&
      parentId.startsWith("abstract-group-")
    ) {
      const gid = Number(parentId.replace("abstract-group-", ""));
      for (const id of dragIdsNum) {
        pendingUpdates[id] = { ...pendingUpdates[id], abstractGroupId: gid };
      }

      const locallyUpdatedSorted = applyUpdatesToSorted(
        sortedObjects,
        pendingUpdates
      );

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
      adjustedIndex = Math.max(0, Math.min(adjustedIndex, others.length));

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
      filtered.forEach((obj, pos) => {
        const newZ = total - 1 - pos;
        if (obj.zIndex !== newZ)
          pendingUpdates[obj.id] = { ...pendingUpdates[obj.id], zIndex: newZ };
      });
    }

    // === 3) Drop inside real flex-group ===
    else {
      const parentNumeric = Number(parentId);
      const parentObj = objects.find((o) => o.id === parentNumeric);
      if (parentObj && parentObj.type === "group") {
        const draggedMemberIds: number[] = [];
        for (const idStr of dragIds) {
          if (idStr.startsWith("abstract-group-")) {
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

        if (moveObjectsToFlexGroup) {
          moveObjectsToFlexGroup(draggedMemberIds, parentNumeric, index);
        }

        draggedMemberIds.forEach((id) => {
          const o = objects.find((x) => x.id === id);
          if (o && o.abstractGroupId != null) {
            pendingUpdates[id] = {
              ...pendingUpdates[id],
              abstractGroupId: null,
            };
          }
        });

        const filtered = sortedObjects.filter(
          (o) => !draggedMemberIds.includes(o.id)
        );
        const total = filtered.length;
        filtered.forEach((obj, pos) => {
          const newZ = total - 1 - pos;
          if (obj.zIndex !== newZ)
            pendingUpdates[obj.id] = {
              ...pendingUpdates[obj.id],
              zIndex: newZ,
            };
        });
      }
    }

    if (Object.keys(pendingUpdates).length > 0) {
      updateMultipleObjects(pendingUpdates);
    }
  };
}

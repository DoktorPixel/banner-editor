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
      if (n.data.isAbstractGroup) groupRootIds.add(n.id);
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

/**
 * Помощник — строит список entity (в том же порядке, что и дерево),
 * где entity = { id, type: 'single'|'group', memberIds: number[] }.
 * Важное требование: order должен соответствовать порядку по zIndex desc.
 */
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

/**
 * handleMoveFactory:
 * - добавлена поддержка: перетаскивание в abstract-group (установить abstractGroupId)
 *   и перетаскивание в root (сброс abstractGroupId)
 */
export function handleMoveFactory(
  objects: BannerObject[],
  sortedObjects: BannerObject[],
  updateMultipleObjects: (
    updates: Record<number, Partial<BannerObject>>
  ) => void
) {
  return function handleMove({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) {
    // dragIds может содержать и строковые id для abstract-group-<gid>
    const dragIdsStr = dragIds;
    const dragIdsNum = dragIds
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));

    // === 0. Helper: обновление zIndex для нового порядка root (используется в нескольких ветках) ===
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

    // ===========================
    // 1) Drop to root (parentId === null)
    // ===========================
    if (parentId === null) {
      // --- 1.1: если среди dragged есть объекты, которые сейчас в abstract group -> нужно их "извлечь"
      const needUnset: Record<number, Partial<BannerObject>> = {};
      for (const id of dragIdsNum) {
        const existing = objects.find((o) => o.id === id);
        if (existing && existing.abstractGroupId != null) {
          needUnset[id] = { abstractGroupId: null };
        }
      }

      // применим локально к sortedObjects (чтобы корректно пересчитать порядок),
      // и вызовем updateMultipleObjects(needUnset) чтобы реально обновить состояние
      const locallyUpdatedSorted = applyUpdatesToSorted(
        sortedObjects,
        needUnset
      );

      if (Object.keys(needUnset).length > 0) {
        updateMultipleObjects(needUnset);
      }

      // Теперь делаем перемещение внутри root-уровня (включая случаи, когда dragged были ранее в группе)
      const entities = buildRootEntities(locallyUpdatedSorted);
      const draggedEntityIds = new Set<string>(dragIdsStr);

      const firstDraggedIndex = entities.findIndex((e) =>
        draggedEntityIds.has(e.id)
      );
      if (firstDraggedIndex === -1) {
        // Возможно перетащили отдельные элементы (которые были внутри abstract group и мы только что извлекли их).
        // В этом случае нужно найти entity entries that contain these member ids.
        const draggedEntityIdsDerived = new Set<string>();
        for (const ent of entities) {
          for (const mem of ent.memberIds) {
            if (dragIdsNum.includes(mem)) {
              draggedEntityIdsDerived.add(ent.id);
            }
          }
        }
        if (draggedEntityIdsDerived.size === 0) {
          console.warn(
            "handleMove (to root): Could not find dragged entity",
            dragIds
          );
          return;
        }
        // используем derived set
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

      // обычный путь (как раньше) — с dragIdsStr непосредственно:
      const draggedEntities = entities.filter((e) =>
        draggedEntityIds.has(e.id)
      );
      const otherEntities = entities.filter((e) => !draggedEntityIds.has(e.id));

      let adjustedIndex = index;
      if (firstDraggedIndex < index) {
        adjustedIndex -= draggedEntities.length;
      }
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

    // ===========================
    // 2) Drop inside abstract-group (parentId like "abstract-group-<gid>")
    // ===========================
    if (
      typeof parentId === "string" &&
      parentId.startsWith("abstract-group-")
    ) {
      const gid = Number(parentId.replace("abstract-group-", ""));

      // --- 2.1: подготовим updates, чтобы установить abstractGroupId = gid для всех перетаскиваемых (числовых) id
      const updates: Record<number, Partial<BannerObject>> = {};
      for (const id of dragIdsNum) {
        updates[id] = { abstractGroupId: gid };
      }

      // применим локально к sortedObjects для расчёта порядка
      const locallyUpdatedSorted = applyUpdatesToSorted(sortedObjects, updates);

      // запишем в состояние
      if (Object.keys(updates).length > 0) {
        updateMultipleObjects(updates);
      }

      // --- 2.2: теперь сформируем порядок членов группы (включая новые добавленные элементы)
      const groupMembers = locallyUpdatedSorted.filter(
        (o) => o.abstractGroupId === gid
      );

      const draggedSet = new Set<number>(dragIdsNum);
      const dragged = groupMembers.filter((m) => draggedSet.has(m.id));
      const others = groupMembers.filter((m) => !draggedSet.has(m.id));

      let adjustedIndex = index;
      // firstDraggedIndex в локальном groupMembers (учитывая, что некоторое dragged могли быть новыми)
      const firstDraggedIndex = groupMembers.findIndex((m) =>
        draggedSet.has(m.id)
      );
      if (firstDraggedIndex !== -1 && firstDraggedIndex < index) {
        adjustedIndex -= dragged.length;
      }
      if (adjustedIndex < 0) adjustedIndex = 0;
      if (adjustedIndex > others.length) adjustedIndex = others.length;

      const newGroupOrder = [
        ...others.slice(0, adjustedIndex),
        ...dragged,
        ...others.slice(adjustedIndex),
      ];

      // встроим новый порядок группы в общий порядок root-объектов
      const filtered = locallyUpdatedSorted.filter(
        (o) => o.abstractGroupId !== gid
      );

      // определим место, где группа должна быть — используем индекс первого члена из локального списка (если есть)
      const firstIndexInNew = locallyUpdatedSorted.findIndex(
        (o) => o.abstractGroupId === gid
      );
      const insertPos =
        firstIndexInNew === -1 ? filtered.length : firstIndexInNew;

      filtered.splice(insertPos, 0, ...newGroupOrder);

      // пересчитываем zIndex для всех
      const total = filtered.length;
      const zUpdates: Record<number, Partial<BannerObject>> = {};
      filtered.forEach((obj, pos) => {
        const newZ = total - 1 - pos;
        if (obj.zIndex !== newZ) zUpdates[obj.id] = { zIndex: newZ };
      });

      if (Object.keys(zUpdates).length > 0) {
        updateMultipleObjects(zUpdates);
      }

      return;
    }

    // ===========================
    // 3) Остальные случаи (например drop внутрь реальной группы type==='group') — оставляем прежней логикой caller'а
    // ===========================
    // если нужны — сюда можно добавить обработку для real-flex groups (отдельно).
    // Для текущего шага (abstract-group) ничего не делаем.
    // eslint-disable-next-line no-console
    console.warn(
      "handleMove: unsupported parentId case for abstract-only implementation",
      parentId
    );
  };
}

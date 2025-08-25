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

export /**
 * Помощник — строит список entity (в том же порядке, что и дерево),
 * где entity = { id, type: 'single'|'group', memberIds: number[] }.
 * Важное требование: order должен соответствовать порядку по zIndex desc.
 */
function buildRootEntities(objects: BannerObject[]) {
  // objects ожидаются уже отсортированы по zIndex desc
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
      // возьмём всех членов группы в порядке прохода (objects уже отсортирован)
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

// react-arborist/moveHelpers.ts

// вспомогательное
type ProposeGroupFn = (payload: {
  dragIds: number[];
  targetRootId: number;
}) => boolean;
type GetHoveredFn = () => number | null;

export function handleMoveFactory(
  objects: BannerObject[],
  sortedObjects: BannerObject[],
  updateMultipleObjects: (
    updates: Record<number, Partial<BannerObject>>
  ) => void,
  proposeGroup: ProposeGroupFn, // <— Функция для предложения группы (из useGroupOnDrop)
  getHoveredRootId: GetHoveredFn // <— Getter для hovered (из useGroupOnDrop)
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
    // === 0. Попытка "drop НА root" → предлагаем сделать группу ===
    // Если canDrop уже разрешил этот drop как группировку, сразу вызываем proposeGroup
    const hovered = getHoveredRootId?.() ?? null; // <— Получаем текущий hovered root ID (на момент drop)
    const dragged = dragIds.map(Number); // <— dragged IDs как числа

    // Мы предполагаем, что если canDrop разрешил, то это именно drop на элемент для группировки
    // Поэтому мы просто вызываем proposeGroup без повторной проверки всех условий
    if (parentId === null && hovered != null && !dragged.includes(hovered)) {
      // <— КЛЮЧЕВАЯ ПРОВЕРКА ОТЛИЧИЯ:
      // - parentId === null: drop на root-уровне (общий для обоих сценариев)
      // - hovered != null: курсор НАД root-элементом (из hover listeners в TreeNode)
      // - !dragged.includes(hovered): не дропаем на самого себя
      // Если да — это "drop НА root" для группы
      const consumed = proposeGroup({
        dragIds: dragged,
        targetRootId: hovered,
      }); // <— Предлагаем группу: открывает диалог
      if (consumed) return; // Диалог открыт — отменяем стандартный reorder  // <— Если true, выходим: НЕ ДЕЛАЕМ реордер (zIndex не меняется)
    }

    // === 1. Перетаскивание внутри root-уровня ===
    if (parentId === null) {
      const entities = buildRootEntities(sortedObjects);
      const draggedEntityIds = new Set<string>(dragIds);

      const firstDraggedIndex = entities.findIndex((e) =>
        draggedEntityIds.has(e.id)
      );
      if (firstDraggedIndex === -1) {
        console.warn("handleMove: не удалось найти dragged entity", dragIds);
        return;
      }

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

      const flattenedIds: number[] = [];
      for (const ent of newEntities) {
        flattenedIds.push(...ent.memberIds);
      }

      const total = flattenedIds.length;
      const updates: Record<number, Partial<BannerObject>> = {};
      flattenedIds.forEach((objId, pos) => {
        const newZ = total - 1 - pos;
        const existing = objects.find((o) => o.id === objId);
        if (!existing) return;
        if (existing.zIndex !== newZ) {
          updates[objId] = { zIndex: newZ };
        }
      });

      if (Object.keys(updates).length > 0) {
        updateMultipleObjects(updates);
      }
      return;
    }

    // === 2. Перетаскивание внутри abstract-group ===
    if (parentId.startsWith("abstract-group-")) {
      const gid = Number(parentId.replace("abstract-group-", ""));
      const groupMembers = sortedObjects.filter(
        (o) => o.abstractGroupId === gid
      );

      const draggedIds = new Set(dragIds.map((id) => Number(id)));
      const dragged = groupMembers.filter((m) => draggedIds.has(m.id));
      const others = groupMembers.filter((m) => !draggedIds.has(m.id));

      let adjustedIndex = index;
      const firstDraggedIndex = groupMembers.findIndex((m) =>
        draggedIds.has(m.id)
      );
      if (firstDraggedIndex < index) {
        adjustedIndex -= dragged.length;
      }
      if (adjustedIndex < 0) adjustedIndex = 0;
      if (adjustedIndex > others.length) adjustedIndex = others.length;

      const newGroupOrder = [
        ...others.slice(0, adjustedIndex),
        ...dragged,
        ...others.slice(adjustedIndex),
      ];

      const newSorted = [...sortedObjects];
      const filtered = newSorted.filter((o) => o.abstractGroupId !== gid);

      const firstIndexInOld = sortedObjects.findIndex(
        (o) => o.abstractGroupId === gid
      );
      filtered.splice(firstIndexInOld, 0, ...newGroupOrder);

      const total = filtered.length;
      const updates: Record<number, Partial<BannerObject>> = {};
      filtered.forEach((obj, pos) => {
        const newZ = total - 1 - pos;
        if (obj.zIndex !== newZ) {
          updates[obj.id] = { zIndex: newZ };
        }
      });

      if (Object.keys(updates).length > 0) {
        updateMultipleObjects(updates);
      }
    }
  };
}

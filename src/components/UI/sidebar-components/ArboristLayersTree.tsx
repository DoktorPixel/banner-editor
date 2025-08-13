import React, { useMemo, useCallback } from "react";
import { Box } from "@mui/material";
import { Tree } from "react-arborist";
import { BannerChild, BannerObject } from "../../../types";
import { useBanner } from "../../../context/BannerContext";
import {
  SvgImage,
  SvgLayout,
  SvgLayoutOpen,
  SvgText,
} from "../../../assets/icons";

type TreeNodeData = {
  id: number;
  kind: "object" | "child";
  type: BannerObject["type"];
  name?: string;
  zIndex?: number;
  order?: number;
  parentId?: number; // only for children
  children?: TreeNodeData[];
};

function sortByZIndexDesc<T extends { zIndex?: number }>(a: T, b: T): number {
  return (b.zIndex ?? 0) - (a.zIndex ?? 0);
}

function sortChildren(nodes: BannerChild[]): BannerChild[] {
  // Prefer explicit order; fallback to zIndex; then id
  return [...nodes].sort((a, b) => {
    const ao = a.order ?? null;
    const bo = b.order ?? null;
    if (ao != null && bo != null) return ao - bo;
    if (ao != null && bo == null) return -1;
    if (ao == null && bo != null) return 1;
    const zi = (a.zIndex ?? 0) - (b.zIndex ?? 0);
    if (zi !== 0) return zi;
    return a.id - b.id;
  });
}

function mapToTree(objects: BannerObject[]): TreeNodeData[] {
  const topSorted = [...objects].sort(sortByZIndexDesc);
  const mapChild = (parentId: number, child: BannerChild): TreeNodeData => ({
    id: child.id,
    kind: "child",
    type: child.type,
    name: child.name,
    zIndex: child.zIndex,
    order: child.order,
    parentId,
    children: child.children
      ? sortChildren(child.children).map((c) => mapChild(child.id, c))
      : undefined,
  });
  return topSorted.map<TreeNodeData>((obj) => ({
    id: obj.id,
    kind: "object",
    type: obj.type,
    name: obj.name,
    zIndex: obj.zIndex,
    children:
      obj.type === "group" && obj.children
        ? sortChildren(obj.children).map((c) => mapChild(obj.id, c))
        : undefined,
  }));
}

function useSelectionHelpers() {
  const {
    selectedObjectIds,
    selectObject,
    clearChildSelection,
    selectedChildId,
    selectChild,
  } = useBanner() as any;

  const isObjectSelected = useCallback(
    (id: number) => selectedObjectIds.includes(id),
    [selectedObjectIds]
  );
  const isChildSelected = useCallback(
    (id: number) => selectedChildId?.childId === id,
    [selectedChildId]
  );

  const handleRowClick = useCallback(
    (node: TreeNodeData, event: React.MouseEvent) => {
      if (node.kind === "object") {
        selectObject(node.id, event.ctrlKey || event.metaKey);
        clearChildSelection();
      } else if (node.kind === "child") {
        selectChild(node.parentId!, node.id);
      }
    },
    [selectObject, clearChildSelection, selectChild]
  );

  return { isObjectSelected, isChildSelected, handleRowClick };
}

function useReorderHandlers() {
  const { objects, updateHistory, updateMultipleObjects } = useBanner();

  const reorderTopLevelByIds = useCallback(
    (orderedIds: number[]) => {
      // Highest zIndex should be first visually; assign descending zIndex values
      const max = orderedIds.length;
      const updates: Record<number, Partial<BannerObject>> = {};
      orderedIds.forEach((id, index) => {
        updates[id] = { zIndex: max - index };
      });
      updateMultipleObjects(updates);
    },
    [updateMultipleObjects]
  );

  const reorderChildrenInAnyGroup = useCallback(
    (parentId: number, orderedChildIds: number[]) => {
      const applyOrder = (children: BannerChild[]): BannerChild[] =>
        orderedChildIds.map((id, index) => {
          const found = children.find((c) => c.id === id)!;
          return { ...found, order: index };
        });

      const deepMap = (list: BannerObject[]): BannerObject[] =>
        list.map((obj) => {
          if (obj.id === parentId && obj.children) {
            return { ...obj, children: applyOrder(obj.children) };
          }
          if (obj.children) {
            const remapChildren = (kids: BannerChild[]): BannerChild[] =>
              kids.map((kid) => {
                if (kid.id === parentId && kid.children) {
                  return {
                    ...kid,
                    children: applyOrder(kid.children),
                  } as BannerChild;
                }
                if (kid.children) {
                  return {
                    ...kid,
                    children: remapChildren(kid.children),
                  } as BannerChild;
                }
                return kid;
              });
            return { ...obj, children: remapChildren(obj.children) };
          }
          return obj;
        });

      updateHistory(deepMap(objects));
    },
    [objects, updateHistory]
  );

  return { reorderTopLevelByIds, reorderChildrenInAnyGroup };
}

const Row: React.FC<{ node: any; style: any; dragHandle: any; tree: any }> = ({
  node,
  style,
  dragHandle,
}) => {
  const { isObjectSelected, isChildSelected, handleRowClick } =
    useSelectionHelpers();
  const isGroup = node.data.type === "group";
  const isSelected =
    node.data.kind === "object"
      ? isObjectSelected(node.data.id)
      : isChildSelected(node.data.id);

  const icon =
    node.data.type === "text" ? (
      <SvgText />
    ) : node.data.type === "image" || node.data.type === "figure" ? (
      <SvgImage />
    ) : node.isOpen ? (
      <SvgLayoutOpen />
    ) : (
      <SvgLayout />
    );

  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: isSelected ? "#EEEEEE" : "white",
        cursor: "pointer",
      }}
      onClick={(e) => handleRowClick(node.data as TreeNodeData, e)}
      ref={dragHandle}
    >
      {icon}
      <span className="layers-list-item">
        {node.data.name || (isGroup ? "Group" : node.data.type)}
      </span>
    </div>
  );
};

const ArboristLayersTree: React.FC = () => {
  const { objects } = useBanner();
  const data = useMemo(() => mapToTree(objects), [objects]);
  const { reorderTopLevelByIds, reorderChildrenInAnyGroup } =
    useReorderHandlers();

  const onMove = useCallback(
    ({ dragNodes, parentNode, index }: any) => {
      const dragIds: number[] = dragNodes.map((n: any) => n.id);
      if (!parentNode) {
        // top-level reorder by zIndex
        const currentOrder = data.map((n) => n.id);
        const filtered = currentOrder.filter((id) => !dragIds.includes(id));
        const next = [
          ...filtered.slice(0, index),
          ...dragIds,
          ...filtered.slice(index),
        ];
        reorderTopLevelByIds(next);
        return;
      }
      // inside a group (could be top-level group object or nested child group)
      const siblings: any[] = parentNode.children ?? [];
      const siblingIds = siblings
        .map((n) => n.id)
        .filter((id) => !dragIds.includes(id));
      const next = [
        ...siblingIds.slice(0, index),
        ...dragIds,
        ...siblingIds.slice(index),
      ];
      reorderChildrenInAnyGroup(parentNode.id as number, next);
    },
    [data, reorderTopLevelByIds, reorderChildrenInAnyGroup]
  );

  return (
    <Box sx={{ borderTop: "1px solid #eee", paddingTop: "6px" }}>
      <Tree
        data={data}
        openByDefault
        // width auto by container
        height={320}
        rowHeight={28}
        indent={18}
        onMove={onMove}
      >
        {Row as any}
      </Tree>
    </Box>
  );
};

export default ArboristLayersTree;

// react-arborist/convertObjectsToTree.ts
import type { BannerObject, BannerChild } from "../../../../types/index";

export type ArboristNodeData = {
  id: string;
  label: string;
  type: BannerObject["type"];
  originalId: number;
  raw: BannerObject | BannerChild;
  parentId?: number;
  abstractGroupId?: number | null;
  isAbstractGroup?: boolean;
  children?: ArboristNodeData[] | null;
};

function labelFor(obj: BannerObject | BannerChild) {
  if (obj.type === "text") {
    return obj.name?.substring(0, 14) || "Text";
  }
  if (obj.type === "image") {
    return obj.name?.substring(0, 14) || "Image";
  }
  if (obj.type === "group") {
    return obj.name?.substring(0, 14) || "Layout";
  }
  if (obj.type === "figure") {
    return obj.name?.substring(0, 14) || "Figure";
  }
  return `Item `;
}

function mapChild(child: BannerChild, parentId: number): ArboristNodeData {
  return {
    id: String(child.id),
    label: labelFor(child),
    type: child.type,
    originalId: child.id,
    raw: child,
    parentId,
    children:
      Array.isArray(child.children) && child.children.length > 0
        ? child.children.map((ch) => mapChild(ch, child.id))
        : null,
  };
}

export function convertObjectsToTree(data: BannerObject[]): ArboristNodeData[] {
  const groupedObjects: Record<number, BannerObject[]> = {};
  const rootObjects: BannerObject[] = [];

  data.forEach((obj) => {
    if (obj.abstractGroupId != null) {
      if (!groupedObjects[obj.abstractGroupId]) {
        groupedObjects[obj.abstractGroupId] = [];
      }
      groupedObjects[obj.abstractGroupId].push(obj);
    } else {
      rootObjects.push(obj);
    }
  });

  const treeNodes: ArboristNodeData[] = [];

  // Add abstract groups to the tree
  for (const groupId in groupedObjects) {
    const group = groupedObjects[groupId];
    // Use the id of the first object in the group as the originalId for the abstract group node
    // This is a simplification; a more robust solution might generate a unique ID for the group
    const firstObjectInGroup = group[0];
    if (firstObjectInGroup) {
      treeNodes.push({
        id: `abstract-group-${groupId}`,
        label: `Group ${groupId}`,
        type: "group", // Or a specific type for abstract groups if available
        originalId: firstObjectInGroup.id,
        raw: firstObjectInGroup, // This might need refinement for abstract groups
        isAbstractGroup: true,
        children: group.map((obj) => ({
          id: String(obj.id),
          label: labelFor(obj),
          type: obj.type,
          originalId: obj.id,
          raw: obj,
          parentId: obj.id, // Parent is the abstract group
          abstractGroupId: obj.abstractGroupId,
          children:
            Array.isArray(obj.children) && obj.children.length > 0
              ? obj.children.map((ch) => mapChild(ch, obj.id))
              : null,
        })),
      });
    }
  }

  // Add root objects (not part of any abstract group) to the tree
  rootObjects.forEach((obj) => {
    treeNodes.push({
      id: String(obj.id),
      label: labelFor(obj),
      type: obj.type,
      originalId: obj.id,
      raw: obj,
      children:
        Array.isArray(obj.children) && obj.children.length > 0
          ? obj.children.map((ch) => mapChild(ch, obj.id))
          : null,
    });
  });

  return treeNodes;
}

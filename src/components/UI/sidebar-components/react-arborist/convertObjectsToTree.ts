// utils/convertObjectsToTree.ts
import type { BannerObject, BannerChild } from "../../../../types/index";

export type ArboristNodeData = {
  id: string;
  label: string;
  type: BannerObject["type"];
  originalId: number;
  // keep original object handy for later needs
  raw: BannerObject | BannerChild;
  parentId?: number; // <--- новое поле
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

/**
 * Преобразует массив BannerObject[] в формат, совместимый с react-arborist.
 */
export function convertObjectsToTree(data: BannerObject[]): ArboristNodeData[] {
  return data.map((obj) => ({
    id: String(obj.id),
    label: labelFor(obj),
    type: obj.type,
    originalId: obj.id,
    raw: obj,
    children:
      Array.isArray(obj.children) && obj.children.length > 0
        ? obj.children.map((ch) => mapChild(ch, obj.id))
        : null,
  }));
}

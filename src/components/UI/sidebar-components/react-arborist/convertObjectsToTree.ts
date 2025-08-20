// react-arborist/convertObjectsToTree.ts
import type { BannerObject, BannerChild } from "../../../../types/index";

export type ArboristNodeData = {
  id: string;
  label: string;
  type: BannerObject["type"];
  originalId: number;
  raw: BannerObject | BannerChild | null; // допускаем null для абстрактной группы
  parentId?: number; // для детей virtual group НЕ ставим
  abstractGroupId?: number | null;
  isAbstractGroup?: boolean;
  children?: ArboristNodeData[] | null;
};

function labelFor(obj: BannerObject | BannerChild) {
  if (obj.type === "text") return obj.name?.substring(0, 14) || "Text";
  if (obj.type === "image") return obj.name?.substring(0, 14) || "Image";
  if (obj.type === "group") return obj.name?.substring(0, 14) || "Layout";
  if (obj.type === "figure") return obj.name?.substring(0, 14) || "Figure";
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
      (groupedObjects[obj.abstractGroupId] ??= []).push(obj);
    } else {
      rootObjects.push(obj);
    }
  });

  const treeNodes: ArboristNodeData[] = [];

  // Виртуальные группы — создаём отдельный узел-обёртку
  for (const groupIdStr in groupedObjects) {
    const group = groupedObjects[Number(groupIdStr)]!;
    const firstObjectInGroup = group[0];
    if (!firstObjectInGroup) continue;

    const groupId = Number(groupIdStr);
    treeNodes.push({
      id: `abstract-group-${groupId}`, // уникальный id для группы в дереве
      label: `Group ${groupId}`,
      type: "group", // тип для отображения (не настоящий объект)
      originalId: firstObjectInGroup.id, // оставляем id первого объекта — используется selectAllObjects
      raw: null, // у группы нет собственного объекта для редактирования
      isAbstractGroup: true,
      children: group.map((obj) => ({
        id: String(obj.id),
        label: labelFor(obj),
        type: obj.type,
        originalId: obj.id,
        raw: obj,
        // parentId НЕ указываем — виртуальная группа не является реальным родителем
        abstractGroupId: obj.abstractGroupId,
        children:
          Array.isArray(obj.children) && obj.children.length > 0
            ? obj.children.map((ch) => mapChild(ch, obj.id))
            : null,
      })),
    });
  }

  // Корневые объекты вне групп
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

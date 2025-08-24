// react-arborist/convertObjectsToTree.ts
import type { BannerObject, BannerChild } from "../../../../types/index";

export type ArboristNodeData = {
  id: string;
  label: string;
  type: BannerObject["type"];
  originalId: number;
  raw: BannerObject | BannerChild | null; // null для абстрактной группы
  parentId?: number; // для nested children (если есть)
  abstractGroupId?: number | null;
  isAbstractGroup?: boolean;
  children?: ArboristNodeData[] | null;
  droppable?: boolean; // Добавляем новое свойство
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

/**
 * convertObjectsToTree
 * - ожидает на вход массив объектов (предпочтительно уже отсортированных по zIndex desc)
 * - шаг за шагом формирует порядок root-entities, где каждая виртуальная группа
 *   представлена одним root-node (id = `abstract-group-<groupId>`)
 */
export function convertObjectsToTree(data: BannerObject[]): ArboristNodeData[] {
  // предполагаем data отсортирован по zIndex desc (тот же сорт, что и в BannerObjectsTree)
  // чтобы гарантировать порядок в дереве, проходим по data в порядке zIndex desc
  const groupedSeen = new Set<number>();
  const treeNodes: ArboristNodeData[] = [];

  for (const obj of data) {
    // если объект входит в abstract group
    if (obj.abstractGroupId != null) {
      const gid = obj.abstractGroupId;
      if (groupedSeen.has(gid)) {
        // группу уже добавили — пропускаем
        continue;
      }
      groupedSeen.add(gid);

      // найдем всех членов группы в том же порядке (data уже отсортирован)
      const members = data.filter((o) => o.abstractGroupId === gid);

      // формируем узел группы — raw=null (нельзя редактировать имя группы)
      const groupNode: ArboristNodeData = {
        id: `abstract-group-${gid}`,
        label: `Group ${gid}`,
        type: "group",
        originalId: members[0].id, // используем id первого члена (как раньше)
        raw: null,
        isAbstractGroup: true,
        droppable: false, // Группы не могут быть целью для drop
        children: members.map((m) => ({
          id: String(m.id),
          label: labelFor(m),
          type: m.type,
          originalId: m.id,
          raw: m,
          // parentId НЕ ставим — virtual group не является реальным родителем
          abstractGroupId: m.abstractGroupId,
          children:
            Array.isArray(m.children) && m.children.length > 0
              ? m.children.map((ch) => mapChild(ch, m.id))
              : null,
        })),
      };

      treeNodes.push(groupNode);
    } else {
      // обычный корневой объект
      treeNodes.push({
        id: String(obj.id),
        label: labelFor(obj),
        type: obj.type,
        originalId: obj.id,
        raw: obj,
        droppable: true, // Обычные корневые объекты могут быть целью для drop
        children:
          Array.isArray(obj.children) && obj.children.length > 0
            ? obj.children.map((ch) => mapChild(ch, obj.id))
            : null,
      });
    }
  }

  return treeNodes;
}


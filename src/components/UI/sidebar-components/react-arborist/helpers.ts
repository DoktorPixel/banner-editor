import { NodeApi } from "react-arborist";
import { ArboristNodeData } from "./convertObjectsToTree";
import { BannerObject, BannerChild } from "../../../../types";

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

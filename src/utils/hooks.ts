import { useCallback, useMemo } from "react";
import { useBanner } from "../context/BannerContext";
import { BannerObject, BannerChild } from "../types";

export const useObjectProperties = () => {
  const {
    objects,
    updateObject,
    deleteObject,
    deleteMultipleObjects,
    selectedObjectIds,
    clearSelection,
  } = useBanner();

  const getObjectById = (id: number) => objects.find((obj) => obj.id === id);
  const selectedObjectId = selectedObjectIds[0];
  const selectedObject = selectedObjectId
    ? getObjectById(selectedObjectId)
    : null;

  const selectedObjects = selectedObjectIds.map((id) => getObjectById(id));

  const handleChange = (key: keyof BannerObject, value: string | number) => {
    if (selectedObjectId !== null) {
      updateObject(selectedObjectId, { [key]: value });
    }
  };

  const handleDelete = () => {
    if (selectedObjectIds.length > 0) {
      selectedObjectIds.forEach((id) => deleteObject(id));
      clearSelection();
    }
  };

  const handleDeleteAll = () => {
    if (selectedObjectIds.length > 0) {
      deleteMultipleObjects(selectedObjectIds);
      clearSelection();
    }
  };

  const updateObjectProperty = (
    objectId: number,
    key: keyof BannerObject,
    value: string | number | undefined | boolean
  ) => {
    updateObject(objectId, { [key]: value });
  };

  const updateObjectMultipleProperties = (
    objectId: number,
    updates: Partial<BannerObject>
  ) => {
    updateObject(objectId, updates);
  };

  return {
    selectedObject,
    selectedObjects,
    selectedObjectIds,
    handleChange,
    handleDelete,
    handleDeleteAll,
    updateObjectProperty,
    updateObjectMultipleProperties,
  };
};

export const useChildProperties = () => {
  const {
    selectedChildId,
    objects,
    updateChild,
    deleteChild,
    selectChild,
    clearChildSelection,
  } = useBanner();

  const selectedChild = selectedChildId
    ? objects
        .find((obj) => obj.id === selectedChildId.groupId)
        ?.children?.find((child) => child.id === selectedChildId.childId) ||
      null
    : null;

  const handleChangeChild = (
    key: keyof BannerChild,
    value: string | number | undefined
  ) => {
    if (selectedChildId) {
      updateChild(selectedChildId.groupId, selectedChildId.childId, {
        [key]: value,
      });
    }
  };

  const handleChangeMultipleChildProperties = (
    updates: Partial<BannerChild>
  ) => {
    if (selectedChildId) {
      updateChild(selectedChildId.groupId, selectedChildId.childId, updates);
    }
  };

  const handleDeleteChild = () => {
    if (selectedChildId) {
      deleteChild(selectedChildId.groupId, selectedChildId.childId);
      clearChildSelection();
    }
  };

  return {
    selectedChild,
    selectedChildId,
    handleChangeChild,
    handleChangeMultipleChildProperties,
    handleDeleteChild,
    selectChild,
    clearChildSelection,
  };
};

// ZIndex Collision

export const isCollision = (
  objA: BannerObject,
  objB: BannerObject
): boolean => {
  const objAWidth = objA.width ?? 0;
  const objAHeight = objA.height ?? 0;
  const objBWidth = objB.width ?? 0;
  const objBHeight = objB.height ?? 0;

  return !(
    objA.x + objAWidth <= objB.x ||
    objA.x >= objB.x + objBWidth ||
    objA.y + objAHeight <= objB.y ||
    objA.y >= objB.y + objBHeight
  );
};

export const findCollidingObjects = (
  currentObject: BannerObject,
  allObjects: BannerObject[]
): BannerObject[] => {
  return allObjects.filter(
    (obj) => obj.id !== currentObject.id && isCollision(currentObject, obj)
  );
};

export const stepForwardWithCollision = (
  object: BannerObject,
  allObjects: BannerObject[],
  updateObject: (id: number, updates: Partial<BannerObject>) => void
) => {
  const collidingObjects = findCollidingObjects(object, allObjects);

  const maxZIndex = collidingObjects.reduce(
    (max, obj) => (obj.zIndex ? Math.max(max, obj.zIndex) : max),
    object.zIndex || 0
  );

  updateObject(object.id, { zIndex: maxZIndex + 1 });
};

export const stepBackwardWithCollision = (
  object: BannerObject,
  allObjects: BannerObject[],
  updateObject: (id: number, updates: Partial<BannerObject>) => void
) => {
  const collidingObjects = findCollidingObjects(object, allObjects);

  const minZIndex = collidingObjects.reduce(
    (min, obj) => (obj.zIndex !== undefined ? Math.min(min, obj.zIndex) : min),
    object.zIndex !== undefined ? object.zIndex : 0
  );

  updateObject(object.id, { zIndex: minZIndex - 1 });
};

export const getObjectTypeLabel = (type: BannerObject["type"]) => {
  switch (type) {
    case "text":
      return "Текст";
    case "image":
      return "Зображення";
    case "figure":
      return "Фігура";
    case "group":
      return "Група";
    default:
      return "Об'єкт";
  }
};

export const useObjectCondition = () => {
  const { updateObject } = useBanner();

  const updateCondition = useCallback(
    (objectId: number, condition: BannerObject["condition"]) => {
      updateObject(objectId, { condition });
    },
    [updateObject]
  );

  return { updateCondition };
};

export const useChildCondition = () => {
  const { updateChild } = useBanner();

  const updateChildCondition = useCallback(
    (groupId: number, childId: number, condition: BannerChild["condition"]) => {
      updateChild(groupId, childId, { condition });
    },
    [updateChild]
  );

  return { updateChildCondition };
};

export const useSelectionBounds = (
  selectedObjectIds: number[],
  objects: BannerObject[]
) => {
  return useMemo(() => {
    if (selectedObjectIds.length < 2) return null;

    const selectedObjects = objects.filter((obj) =>
      selectedObjectIds.includes(obj.id)
    );

    if (selectedObjects.length === 0) return null;

    const minX = Math.min(...selectedObjects.map((obj) => obj.x));
    const minY = Math.min(...selectedObjects.map((obj) => obj.y));
    const maxX = Math.max(
      ...selectedObjects.map((obj) => obj.x + (obj.width ?? 0))
    );
    const maxY = Math.max(
      ...selectedObjects.map((obj) => obj.y + (obj.height ?? 0))
    );

    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [selectedObjectIds, objects]);
};

import { useCallback, useMemo } from "react";
import { useBanner } from "../context/BannerContext";
import { BannerObject, BannerChild } from "../types";
// import { ConfigItem } from "../types";

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
    value: string | number | undefined | "auto" | boolean
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
      return "Text";
    case "image":
      return "Image";
    case "figure":
      return "Figure";
    case "group":
      return "Layout";
    default:
      return "Object";
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
    if (selectedObjectIds.length === 0) return null;

    const selectedObjects = objects.filter(
      (obj) =>
        selectedObjectIds.includes(obj.id) ||
        (obj.abstractGroupId &&
          objects.some(
            (o) =>
              selectedObjectIds.includes(o.id) &&
              o.abstractGroupId === obj.abstractGroupId
          ))
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

export const replaceDynamicVariables = (
  content: string,
  keyValuePairs: { key: string; value: string }[]
): string => {
  let result = content;

  keyValuePairs.forEach(({ key, value }) => {
    const dynamicKey = `{{${key}}}`;
    result = result.replaceAll(dynamicKey, value);
  });

  return result;
};

// export const replaceDynamicText = (
//   content: string,
//   keyValuePairs: { key: string; value: string }[]
// ): string => {
//   let result = content;

//   // Обработка функций, например {{format(price)}}
//   const functionRegex = /{{(\w+)\(([\w]+)\)}}/g;
//   result = result.replace(functionRegex, (_, funcName, key) => {
//     const pair = keyValuePairs.find((item) => item.key === key);
//     if (!pair) return "";

//     let value = pair.value;

//     switch (funcName) {
//       case "format":
//         const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
//         if (!isNaN(numericValue)) {
//           return numericValue.toLocaleString("ru") + " грн";
//         }
//         return value;
//       default:
//         return value;
//     }
//   });

//   // Обычные переменные: {{key}}
//   keyValuePairs.forEach(({ key, value }) => {
//     const dynamicKey = `{{${key}}}`;
//     result = result.replaceAll(dynamicKey, value);
//   });

//   return result;
// };

export const replaceDynamicText = (
  content: string,
  keyValuePairs: { key: string; value: string }[]
): string => {
  let result = content;
  // console.log("content", content);
  // console.log("keyValuePairs", keyValuePairs);

  // {{ function(arg1, arg2) }}
  const functionRegex = /{{\s*(\w+)\s*\(\s*([\w\s,]+?)\s*\)\s*}}/g;

  result = result.replace(
    functionRegex,
    (_match: string, funcName: string, args: string): string => {
      const argKeys = args.split(",").map((arg) => arg.trim());
      const values: string[] = argKeys.map((key) => {
        const found = keyValuePairs.find((item) => item.key === key);
        return found?.value || "";
      });

      switch (funcName) {
        case "format": {
          const value = values[0];
          const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
          return !isNaN(numericValue)
            ? numericValue.toLocaleString("ru") + " грн"
            : value;
        }

        case "discount": {
          const [priceStr, saleStr] = values;
          const price = parseFloat(priceStr.replace(/[^\d.]/g, ""));
          const salePrice = parseFloat(saleStr.replace(/[^\d.]/g, ""));
          if (!isNaN(price) && !isNaN(salePrice) && price !== 0) {
            const discount = ((price - salePrice) / price) * 100;
            return Math.round(discount).toString();
          }
          return "0";
        }

        default:
          return values[0] ?? "";
      }
    }
  );

  // {{key}}
  keyValuePairs.forEach(({ key, value }) => {
    const dynamicKey = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(dynamicKey, value);
  });

  return result;
};

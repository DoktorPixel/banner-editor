import { useCallback, useMemo } from "react";
import { useBanner } from "../context/BannerContext";
import {
  BannerObject,
  BannerChild,
  ObjectCondition,
  DynamicImg,
} from "../types";
import type { Property } from "csstype";
import { useTranslation } from "react-i18next";

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

export const useNestedChildProperties = () => {
  const {
    selectedChildId,
    objects,
    updateNestedChild,
    deleteNestedChild,
    selectChild,
    clearChildSelection,
  } = useBanner();

  const selectedNestedChild = selectedChildId?.parentId
    ? objects
        .find((obj) => obj.id === selectedChildId.parentId)
        ?.children?.find((child) => child.id === selectedChildId.groupId)
        ?.children?.find(
          (nestedChild) => nestedChild.id === selectedChildId.childId
        ) || null
    : null;

  const handleChangeNestedChild = (
    key: keyof BannerChild,
    value: string | number | undefined | "auto" | boolean
  ) => {
    if (selectedChildId?.parentId) {
      updateNestedChild(
        selectedChildId.parentId,
        selectedChildId.groupId,
        selectedChildId.childId,
        { [key]: value }
      );
    }
  };

  const handleChangeMultipleNestedChildProperties = (
    updates: Partial<BannerChild>
  ) => {
    if (selectedChildId?.parentId) {
      updateNestedChild(
        selectedChildId.parentId,
        selectedChildId.groupId,
        selectedChildId.childId,
        updates
      );
    }
  };

  const handleDeleteNestedChild = () => {
    if (selectedChildId?.parentId) {
      deleteNestedChild(
        selectedChildId.parentId,
        selectedChildId.groupId,
        selectedChildId.childId
      );
      clearChildSelection();
    }
  };

  return {
    selectedNestedChild,
    selectedChildId,
    handleChangeNestedChild,
    handleChangeMultipleNestedChildProperties,
    handleDeleteNestedChild,
    selectChild,
    clearChildSelection,
  };
};

export const useChildOrder = () => {
  const { objects, reorderChildren } = useBanner();
  const getGroupChildren = (groupId: number) => {
    const group = objects.find((obj) => obj.id === groupId);
    if (!group || group.type !== "group" || !group.children) {
      return [];
    }
    return group.children;
  };

  const moveChild = (groupId: number, childId: number, newPosition: number) => {
    const children = getGroupChildren(groupId);
    if (children.length === 0) {
      console.warn("The group does not contain children.");
      return;
    }

    const currentOrder = children.map((child) => child.id);
    const currentIndex = currentOrder.indexOf(childId);
    if (currentIndex === -1) {
      console.warn("The specified children was not found in the group.");
      return;
    }

    if (newPosition < 0 || newPosition >= children.length) {
      console.warn("Invalid position specified for movement.");
      return;
    }

    const newOrder = [...currentOrder];
    newOrder.splice(currentIndex, 1);
    newOrder.splice(newPosition, 0, childId);

    reorderChildren(groupId, newOrder);
  };

  const moveChildUp = (groupId: number, childId: number) => {
    const children = getGroupChildren(groupId);
    const currentIndex = children.findIndex((child) => child.id === childId);
    if (currentIndex <= 0) {
      return;
    }
    moveChild(groupId, childId, currentIndex - 1);
  };

  const moveChildDown = (groupId: number, childId: number) => {
    const children = getGroupChildren(groupId);
    const currentIndex = children.findIndex((child) => child.id === childId);
    if (currentIndex === -1 || currentIndex >= children.length - 1) {
      return;
    }
    moveChild(groupId, childId, currentIndex + 1);
  };

  return {
    getGroupChildren,
    moveChild,
    moveChildUp,
    moveChildDown,
  };
};

export const useAbstractGroupCondition = () => {
  const { objects, updateMultipleObjects } = useBanner();

  const updateGroupCondition = (
    groupId: number,
    condition?: BannerObject["conditionForAbstract"]
  ) => {
    const groupObjects = objects.filter(
      (obj) => obj.abstractGroupId === groupId
    );

    if (groupObjects.length === 0) return;

    const updates: Record<number, Partial<BannerObject>> = {};
    groupObjects.forEach((obj) => {
      updates[obj.id] = { conditionForAbstract: condition };
    });

    updateMultipleObjects(updates);
  };

  return { updateGroupCondition };
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

export const useObjectTypeLabel = () => {
  const { t } = useTranslation();

  return (type: BannerObject["type"]) => {
    switch (type) {
      case "text":
        return t("objectTypes.text");
      case "image":
        return t("objectTypes.image");
      case "figure":
        return t("objectTypes.figure");
      case "group":
        return t("objectTypes.group");
      default:
        return t("objectTypes.default");
    }
  };
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

export const replaceDynamicVariablesForDynamicImg = (
  content: string,
  keyValuePairs: { key: string; value: string }[],
  dynamicImgs: DynamicImg[],
  object_id?: string | null,
  logoName?: string | null,
  fallbackText?: string
): string => {
  let result = content;

  const fallbackUrl = `https://dummyimage.com/600x400/F1F1F1.gif&text=${
    fallbackText || "Fill+in+dynamic+logos+data"
  }`;

  if (content !== "{{dynamic_img}}" || !object_id) {
    keyValuePairs.forEach(({ key, value }) => {
      const dynamicKey = `{{${key}}}`;
      result = result.replaceAll(dynamicKey, value);
    });
    return result;
  }

  const filteredDynamicImgs = dynamicImgs.filter(
    (img) => img.object_id === object_id
  );

  const pair = keyValuePairs.find(({ key }) => key === logoName);

  const logoNameValue = pair?.value;

  if (logoNameValue) {
    const matchedImg = filteredDynamicImgs.find(
      (img) => img.name === logoNameValue
    );
    if (matchedImg?.file_url) {
      return matchedImg.file_url;
    }
  }
  return content === "{{dynamic_img}}" ? fallbackUrl : content;
};

export const replaceDynamicText = (
  content: string | undefined | null | number,
  keyValuePairs: { key: string; value: string }[]
): string => {
  let result = typeof content === "string" ? content : String(content ?? "");

  const functionRegex = /{{\s*(\w+)\s*\(\s*([\w\s,]+?)\s*\)\s*}}/g;

  result = result.replace(
    functionRegex,
    (_match: string, funcName: string, args: string): string => {
      const argKeys = args.split(",").map((arg) => arg.trim());
      const values: string[] = argKeys.map((key) => {
        const found = keyValuePairs.find((item) => item.key === key);
        return found?.value || "";
      });

      const cleanNumber = (str: string) =>
        parseFloat(
          str
            .replace(/\s/g, "")
            .replace(",", ".")
            .replace(/[^\d.]/g, "")
        );

      switch (funcName) {
        case "format": {
          const value = values[0];
          const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
          const rounded = Math.round(numericValue);

          return !isNaN(rounded) ? rounded.toLocaleString("ru") : value;
        }

        case "discount": {
          const [priceStr, saleStr] = values;
          const price = cleanNumber(priceStr);
          const salePrice = cleanNumber(saleStr);

          if (!isNaN(price) && !isNaN(salePrice) && price !== 0) {
            const discount = ((price - salePrice) / price) * 100;
            return Math.round(discount).toString();
          }
          return "";
        }

        case "discountCurrency": {
          const [priceStr, saleStr] = values;
          const price = cleanNumber(priceStr);
          const salePrice = cleanNumber(saleStr);

          if (!isNaN(price) && !isNaN(salePrice)) {
            const difference = price - salePrice;
            return Math.round(difference).toLocaleString("ru");
          }
          return "";
        }

        case "min": {
          const numericValues = values
            .map((v) =>
              Math.round(
                parseFloat(v.replace(/[^\d.,]/g, "").replace(",", "."))
              )
            )
            .filter((n) => !isNaN(n));

          if (numericValues.length === 0) return "";

          const minValue = Math.min(...numericValues);
          return minValue.toLocaleString("ru");
        }

        default:
          return values[0] || "";
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

export const shouldHideObject = (
  condition: ObjectCondition | undefined,
  keyValuePairs: { key: string; value: string }[]
): boolean => {
  if (!condition) {
    return false;
  }

  const { type, props: conditionProps, state, compareValue } = condition;

  if (state === "exist" || state === "noExist") {
    const propsExist = conditionProps.some((prop) =>
      keyValuePairs.some((pair) => pair.key === prop)
    );

    if (state === "exist") {
      return (
        (type === "hideIf" && propsExist) || (type === "showIf" && !propsExist)
      );
    } else {
      return (
        (type === "hideIf" && !propsExist) || (type === "showIf" && propsExist)
      );
    }
  }

  const propToCompare = conditionProps[0];
  if (!propToCompare) {
    return false;
  }

  const pair = keyValuePairs.find((p) => p.key === propToCompare);

  if (!pair) {
    if (type === "showIf") {
      return true;
    } else {
      return false;
    }
  }

  const actualValue = pair.value;
  const targetValue = compareValue ?? "";

  const clean = (val: string): number => {
    return Number(val.replace(/[^\d.,-]/g, "").replace(",", "."));
  };

  const actualNum = clean(actualValue);
  const targetNum = clean(targetValue);
  const bothAreNumbers = !isNaN(actualNum) && !isNaN(targetNum);

  const doesComparisonHold = (): boolean => {
    switch (state) {
      case "eq":
        return actualValue === targetValue;
      case "not-eq":
        return actualValue !== targetValue;
      case "more-than":
        if (bothAreNumbers) {
          return actualNum > targetNum;
        }
        return actualValue > targetValue;
      case "less-than":
        if (bothAreNumbers) {
          return actualNum < targetNum;
        }
        return actualValue < targetValue;
      case "more-or-eq":
        if (bothAreNumbers) {
          return actualNum >= targetNum;
        }
        return actualValue >= targetValue;
      case "less-or-eq":
        if (bothAreNumbers) {
          return actualNum <= targetNum;
        }
        return actualValue <= targetValue;
      default:
        return false;
    }
  };

  const comparisonResult = doesComparisonHold();

  if (type === "hideIf") {
    return comparisonResult;
  } else {
    return !comparisonResult;
  }
};

export const shouldHideGroup = (
  conditionForAbstract:
    | {
        type: "showIf" | "hideIf";
        props: string[];
        state:
          | "exist"
          | "noExist"
          | "eq"
          | "not-eq"
          | "more-than"
          | "less-than"
          | "more-or-eq"
          | "less-or-eq";
        compareValue?: string;
      }
    | undefined,
  keyValuePairs: { key: string; value: string }[]
): boolean => {
  if (!conditionForAbstract) return false;

  const {
    type,
    props: conditionProps,
    state,
    compareValue,
  } = conditionForAbstract;

  const evaluate = () => {
    for (const prop of conditionProps) {
      const pair = keyValuePairs.find((kv) => kv.key === prop);
      const value = pair?.value;

      switch (state) {
        case "exist":
          if (value !== undefined) return true;
          break;
        case "noExist":
          if (value === undefined) return true;
          break;
        case "eq":
          if (value == compareValue) return true;
          break;
        case "not-eq":
          if (value != compareValue) return true;
          break;
        case "more-than":
          if (parseFloat(value ?? "") > parseFloat(compareValue ?? ""))
            return true;
          break;
        case "less-than":
          if (parseFloat(value ?? "") < parseFloat(compareValue ?? ""))
            return true;
          break;
        case "more-or-eq":
          if (parseFloat(value ?? "") >= parseFloat(compareValue ?? ""))
            return true;
          break;
        case "less-or-eq":
          if (parseFloat(value ?? "") <= parseFloat(compareValue ?? ""))
            return true;
          break;
        default:
          break;
      }
    }

    return false;
  };

  const match = evaluate();
  const shouldHide =
    (type === "hideIf" && match) || (type === "showIf" && !match);

  return shouldHide;
};

export function computeOpacity(
  opacity: Property.Opacity | undefined,
  isHidden: boolean
): number | string {
  if (isHidden) {
    return typeof opacity === "number" ? opacity * 0.3 : 0.3;
  }
  return opacity ?? 1;
}

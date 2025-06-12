import { useCallback, useMemo } from "react";
import { useBanner } from "../context/BannerContext";
import {
  BannerObject,
  BannerChild,
  ObjectCondition,
  DynamicImg,
} from "../types";
import type { Property } from "csstype";
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

export const useChildOrder = () => {
  const { objects, reorderChildren } = useBanner();

  // Получить группу и её потомков по groupId
  const getGroupChildren = (groupId: number) => {
    const group = objects.find((obj) => obj.id === groupId);
    if (!group || group.type !== "group" || !group.children) {
      return [];
    }
    return group.children;
  };

  // Переместить потомка на новую позицию
  const moveChild = (groupId: number, childId: number, newPosition: number) => {
    const children = getGroupChildren(groupId);
    if (children.length === 0) {
      console.warn("Группа не содержит потомков.");
      return;
    }

    // Текущий порядок ID
    const currentOrder = children.map((child) => child.id);
    const currentIndex = currentOrder.indexOf(childId);
    if (currentIndex === -1) {
      console.warn("Указанный потомок не найден в группе.");
      return;
    }

    // Проверяем, что newPosition в допустимых границах
    if (newPosition < 0 || newPosition >= children.length) {
      console.warn("Указана некорректная позиция для перемещения.");
      return;
    }

    // Формируем новый порядок
    const newOrder = [...currentOrder];
    newOrder.splice(currentIndex, 1); // Удаляем childId из текущей позиции
    newOrder.splice(newPosition, 0, childId); // Вставляем childId в новую позицию

    // Вызываем reorderChildren для обновления порядка
    reorderChildren(groupId, newOrder);
  };

  // Переместить потомка вверх (уменьшить order)
  const moveChildUp = (groupId: number, childId: number) => {
    const children = getGroupChildren(groupId);
    const currentIndex = children.findIndex((child) => child.id === childId);
    if (currentIndex <= 0) {
      return; // Уже первый элемент или не найден
    }
    moveChild(groupId, childId, currentIndex - 1);
  };

  // Переместить потомка вниз (увеличить order)
  const moveChildDown = (groupId: number, childId: number) => {
    const children = getGroupChildren(groupId);
    const currentIndex = children.findIndex((child) => child.id === childId);
    if (currentIndex === -1 || currentIndex >= children.length - 1) {
      return; // Уже последний элемент или не найден
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

// export const useObjectGroupCondition = () => {
//   const { objects, updateMultipleObjects } = useBanner();

//   const updateConditionForGroup = (
//     groupId: number,
//     condition: BannerObject["condition"]
//   ) => {
//     const groupObjects = objects.filter(
//       (obj) => obj.abstractGroupId === groupId
//     );

//     const updates: Record<number, Partial<BannerObject>> = {};

//     groupObjects.forEach((obj) => {
//       updates[obj.id] = { conditionForAbstract: condition };
//     });

//     updateMultipleObjects(updates);
//   };

//   return {
//     updateConditionForGroup,
//   };
// };

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

export const replaceDynamicVariablesForDynamicImg = (
  content: string,
  keyValuePairs: { key: string; value: string }[],
  dynamicImgs: DynamicImg[],
  object_id?: string | null,
  logoName?: string | null
): string => {
  let result = content;
  const fallbackUrl =
    "https://dummyimage.com/200x150/F1F1F1.gif&text=Fill+in+dynamic+logos+data";

  // Если content не {{dynamic_img}}, или нет object_id / logoName / dynamicImgs пустой — просто заменить переменные
  if (content !== "{{dynamic_img}}" || !object_id || dynamicImgs.length === 0) {
    keyValuePairs.forEach(({ key, value }) => {
      const dynamicKey = `{{${key}}}`;
      result = result.replaceAll(dynamicKey, value);
    });
    return result;
  }

  // Фильтруем dynamicImgs по object_id
  const filteredDynamicImgs = dynamicImgs.filter(
    (img) => img.object_id === object_id
  );

  // Ищем значение logoName в keyValuePairs
  const pair = keyValuePairs.find(({ key }) => key === logoName);

  const logoNameValue = pair?.value;

  // Ищем совпадение значения logoNameValue с name в filteredDynamicImgs
  if (logoNameValue) {
    const matchedImg = filteredDynamicImgs.find(
      (img) => img.name === logoNameValue
    );
    if (matchedImg?.file_url) {
      return matchedImg.file_url; // теперь TypeScript уверен, что это string
    }
  }

  // Если ничего не нашли — возвращаем оригинальный content
  return content === "{{dynamic_img}}" ? fallbackUrl : content;
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
            .replace(/\s/g, "") // убрать пробелы
            .replace(",", ".") // заменить запятую на точку
            .replace(/[^\d.]/g, "") // убрать все кроме цифр и точек
        );

      switch (funcName) {
        case "format": {
          const value = values[0];
          const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
          const rounded = Math.round(numericValue);

          return !isNaN(rounded)
            ? rounded.toLocaleString("ru") + " грн"
            : value;
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
          return minValue.toLocaleString("ru") + " грн";
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

// export const shouldHideObject = (
//   condition: BannerObject["condition"] | undefined,
//   keyValuePairs: { key: string; value: string }[]
// ): boolean => {
//   if (!condition) return false;

//   const { type, props: conditionProps, state } = condition;
//   const propsExist = conditionProps.some((prop) =>
//     keyValuePairs.some((pair) => pair.key === prop)
//   );

//   if (state === "exist") {
//     return (
//       (type === "hideIf" && propsExist) || (type === "showIf" && !propsExist)
//     );
//   } else if (state === "noExist") {
//     return (
//       (type === "hideIf" && !propsExist) || (type === "showIf" && propsExist)
//     );
//   }

//   return false;
// };

export const shouldHideObject = (
  condition: ObjectCondition | undefined,
  keyValuePairs: { key: string; value: string }[]
): boolean => {
  // Если нет condition — не скрываем
  if (!condition) {
    return false;
  }

  const { type, props: conditionProps, state, compareValue } = condition;

  // 1. Если выбраны только exist / noExist (без сравнения), то проверяем «наличие ключа в keyValuePairs».
  if (state === "exist" || state === "noExist") {
    // Проверим, есть ли в keyValuePairs хоть один элемент, чей key === любому элементу из conditionProps.
    const propsExist = conditionProps.some((prop) =>
      keyValuePairs.some((pair) => pair.key === prop)
    );

    if (state === "exist") {
      // hideIf + propsExist  OR  showIf + !propsExist
      return (
        (type === "hideIf" && propsExist) || (type === "showIf" && !propsExist)
      );
    } else {
      // state === "noExist"
      // hideIf + !propsExist  OR  showIf + propsExist
      return (
        (type === "hideIf" && !propsExist) || (type === "showIf" && propsExist)
      );
    }
  }

  // 2. Если мы попали сюда — state один из операторов сравнения.
  //    Берём первый prop: предполагаем сравнение ровно по одному ключу.
  const propToCompare = conditionProps[0];
  if (!propToCompare) {
    // без имени свойства нечего сравнивать — считаем, что условие ложно, значит скрытие = false (то есть показываем)
    return false;
  }

  // Найдём в keyValuePairs пару с key === propToCompare
  const pair = keyValuePairs.find((p) => p.key === propToCompare);

  // Если нет такой пары — воспринимаем это как «значения нет»
  if (!pair) {
    // «нет значения» при сравнении считается не пройденным (false)
    // Далее формируем логику: если operator = showIf, но value не найден — считаем "условие не выполнено"
    // то есть для showIf: !условие → скрываем; для hideIf: условие(!) → не скрываем.
    if (type === "showIf") {
      return true; // не нашли значение, а нам нужно показать, когда сравнение true. Поскольку false, значит скрываем
    } else {
      return false; // hideIf: если сравнение false, то hideIf(false) → не скрываем
    }
  }

  const actualValue = pair.value; // строка
  const targetValue = compareValue ?? "";

  // Попробуем распарсить как числа
  const clean = (val: string): number => {
    return Number(val.replace(/[^\d.,-]/g, "").replace(",", "."));
  };

  const actualNum = clean(actualValue);
  const targetNum = clean(targetValue);
  const bothAreNumbers = !isNaN(actualNum) && !isNaN(targetNum);

  // Функция для проверки сравнения (возвращает true, если «условие сравнения» выполнено)
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
        return actualValue > targetValue; // лексикографически
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

  // Теперь аналогично «exist/noExist» веткам:
  // Если оператор = hideIf:
  //   — скрываем, когда comparisonResult === true;
  // Если оператор = showIf:
  //   — скрываем, когда comparisonResult === false.
  if (type === "hideIf") {
    return comparisonResult;
  } else {
    // type === "showIf"
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

// export const shouldHideObject = (
//   condition: BannerObject["condition"] | undefined,
//   keyValuePairs: { key: string; value: string }[]
// ): boolean => {
//   if (!condition) return false;

//   const { type, props: conditionProps, state } = condition;
//   const propsExist = conditionProps.some((prop) =>
//     keyValuePairs.some((pair) => pair.key === prop)
//   );

//   const isExist = state === "exist";
//   const isHide = type === "hideIf";

//   return (isExist && isHide && propsExist) ||
//          (isExist && !isHide && !propsExist) ||
//          (!isExist && isHide && !propsExist) ||
//          (!isExist && !isHide && propsExist);
// };

export function computeOpacity(
  opacity: Property.Opacity | undefined,
  isHidden: boolean
): number | string {
  if (isHidden) {
    return typeof opacity === "number" ? opacity * 0.3 : 0.3;
  }
  return opacity ?? 1;
}

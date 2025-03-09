import { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BannerObject,
  BannerContextProps,
  BannerChild,
  DynamicImg,
} from "../types";

const BannerContext = createContext<BannerContextProps | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<BannerObject[][]>([[]]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedObjectIds, setSelectedObjectIds] = useState<number[]>([]);
  const [temporaryUpdates, setTemporaryUpdates] = useState<{
    [key: number]: Partial<BannerObject>;
  }>({});

  const objects = history[currentStep] || [];
  // console.log("objects:", objects);

  const renderedObjects = useMemo(() => {
    return objects.map((obj) => ({
      ...obj,
      ...(temporaryUpdates[obj.id] || {}),
    }));
  }, [objects, temporaryUpdates]);

  const [selectedChildId, setSelectedChildId] = useState<{
    groupId: number;
    childId: number;
    parentId?: number;
  } | null>(null);

  //

  const [dynamicImgs, setDynamicImgs] = useState<DynamicImg[]>([]);

  const addDynamicImg = (dynamicImg: DynamicImg) => {
    setDynamicImgs((prev) => {
      const exists = prev.some(
        (b) => b.name === dynamicImg.name && b.logoUrl === dynamicImg.logoUrl
      );
      return exists ? prev : [...prev, dynamicImg];
    });
  };

  const updateDynamicImg = (oldName: string, updates: Partial<DynamicImg>) => {
    setDynamicImgs((prev) =>
      prev.map((dynamicImg) =>
        dynamicImg.name === oldName ? { ...dynamicImg, ...updates } : dynamicImg
      )
    );
  };

  const deleteDynamicImg = (name: string) => {
    setDynamicImgs((prevImgs) => {
      const updatedImgs = prevImgs.filter((img) => img.name !== name);
      return updatedImgs;
    });
  };

  //

  const addJson = (jsonData: BannerObject[]) => {
    if (!Array.isArray(jsonData)) {
      console.error("Переданий JSON має бути масивом об'єктів.");
      return;
    }
    updateHistory(jsonData);
  };

  const [currentProjectName, setCurrentProjectName] = useState<string | null>(
    null
  );

  const selectChild = (groupId: number, childId: number, parentId?: number) => {
    setSelectedChildId((prev) => {
      const newSelection = { groupId, childId, parentId };
      console.log("selectedChildId (prev)", prev);
      // console.log("selectedChildId (updated)", newSelection);
      return newSelection;
    });
  };

  const clearChildSelection = () => {
    setSelectedChildId(null);
  };

  const updateChild = (
    groupId: number,
    childId: number,
    updates: Partial<BannerChild>
  ) => {
    const newObjects = objects.map((obj) => {
      if (obj.id === groupId && obj.children) {
        const updatedChildren = obj.children.map((child) =>
          child.id === childId ? { ...child, ...updates } : child
        );
        return { ...obj, children: updatedChildren };
      }
      return obj;
    });
    updateHistory(newObjects);
  };

  const deleteChild = (groupId: number, childId: number) => {
    const newObjects = objects.map((obj) => {
      if (obj.id === groupId && obj.children) {
        const updatedChildren = obj.children.filter(
          (child) => child.id !== childId
        );
        return { ...obj, children: updatedChildren };
      }
      return obj;
    });
    updateHistory(newObjects);
  };

  const addObject = (object: BannerObject) => {
    const maxZIndex = objects.reduce(
      (max, obj) => Math.max(max, obj.zIndex ?? 0),
      0
    );
    const newObjects = [
      ...objects,
      {
        ...object,
        zIndex: maxZIndex + 1,
      },
    ];
    updateHistory(newObjects);
  };

  const updateObject = (id: number, updates: Partial<BannerObject>) => {
    const newObjects = objects.map((obj) =>
      obj.id === id ? { ...obj, ...updates } : obj
    );
    updateHistory(newObjects);
  };

  const updateMultipleObjects = (
    updates: Record<number, Partial<BannerObject>>
  ) => {
    const newObjects = objects.map((obj) =>
      updates[obj.id] ? { ...obj, ...updates[obj.id] } : obj
    );
    updateHistory(newObjects);
  };

  const deleteObject = (id: number) => {
    const newObjects = objects.filter((obj) => obj.id !== id);
    updateHistory(newObjects);
  };

  const deleteMultipleObjects = (ids: number[]) => {
    const newObjects = objects.filter((obj) => !ids.includes(obj.id));
    updateHistory(newObjects);
  };

  const updateHistory = (newObjects: BannerObject[]) => {
    const newHistory = [...history.slice(0, currentStep + 1), newObjects];
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const navigate = useNavigate();

  const clearHistory = () => {
    setHistory([[]]);
    setCurrentStep(0);
  };

  const clearProject = () => {
    setHistory([[]]);
    setCurrentStep(0);
    setCurrentProjectName(null);
    navigate("/");
  };

  const undo = () => {
    if (canUndo) setCurrentStep((prev) => prev - 1);
  };

  const redo = () => {
    if (canRedo) setCurrentStep((prev) => prev + 1);
  };

  const canUndo = currentStep > 0;
  const canRedo = currentStep < history.length - 1;

  const selectObject = (id: number, toggle = false) => {
    setSelectedObjectIds((prev) => {
      if (toggle) {
        // console.log("selectedObjectIds", selectedObjectIds);
        return prev.includes(id)
          ? prev.filter((objId) => objId !== id)
          : [...prev, id];
      } else {
        return [id];
      }
    });
  };

  // выделение все объектов abstractGroup (сам объект + его группа)

  // const selectObject = (id: number, toggle = false) => {
  //   setSelectedObjectIds((prev) => {
  //     const selectedObj = objects.find((obj) => obj.id === id);
  //     if (!selectedObj) return prev;

  //     const groupObjects = selectedObj.abstractGroupId
  //       ? objects
  //           .filter(
  //             (obj) => obj.abstractGroupId === selectedObj.abstractGroupId
  //           )
  //           .map((obj) => obj.id)
  //       : [];

  //     const newSelection = new Set([id, ...groupObjects]);

  //     if (toggle) {
  //       return prev.some((objId) => newSelection.has(objId))
  //         ? prev.filter((objId) => !newSelection.has(objId))
  //         : [...prev, ...newSelection];
  //     } else {
  //       return [...newSelection];
  //     }
  //   });
  // };

  const clearSelection = () => setSelectedObjectIds([]);

  //

  const groupSelectedObjects = () => {
    if (selectedObjectIds.length < 2) {
      console.warn("Для группировки нужно выделить как минимум два объекта.");
      return;
    }

    const selectedObjects = objects.filter((obj) =>
      selectedObjectIds.includes(obj.id)
    );

    const minX = Math.min(...selectedObjects.map((o) => o.x ?? 0));
    const minY = Math.min(...selectedObjects.map((o) => o.y ?? 0));

    const maxZIndex = objects.reduce(
      (max, obj) => Math.max(max, obj.zIndex ?? 0),
      0
    );

    const newGroup: BannerObject = {
      id: Date.now(),
      type: "group",
      x: minX,
      y: minY,
      width:
        Math.max(...selectedObjects.map((o) => (o.x ?? 0) + (o.width ?? 100))) -
        minX,
      height:
        Math.max(
          ...selectedObjects.map((o) => (o.y ?? 0) + (o.height ?? 100))
        ) - minY,
      zIndex: maxZIndex + 1,
      children: selectedObjects.map(({ id, x, y, children = [], ...rest }) => ({
        id,
        x: (x ?? 0) - minX, // Относительное позиционирование внутри группы
        y: (y ?? 0) - minY,
        children:
          children.length > 0 ? children.map((child) => ({ ...child })) : [],
        ...rest, // Перенос всех стилей и свойств
      })),
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    };

    const newObjects = objects.filter(
      (obj) => !selectedObjectIds.includes(obj.id)
    );

    updateHistory([...newObjects, newGroup]);
    setSelectedObjectIds([newGroup.id]);
  };

  const ungroupSelectedObject = () => {
    if (selectedObjectIds.length !== 1) {
      console.warn("Для розгрупування потрібно виділити лише одну групу.");
      return;
    }

    const selectedObject = objects.find(
      (obj) => obj.id === selectedObjectIds[0]
    );

    if (!selectedObject || selectedObject.type !== "group") {
      console.warn("Обраний об'єкт не є групою.");
      return;
    }

    const ungroupedObjects = (selectedObject.children || []).map((child) => ({
      ...child,
      id: Date.now() + Math.random(),
      x: (child.x ?? 0) + selectedObject.x,
      y: (child.y ?? 0) + selectedObject.y,
    }));

    const newObjects = objects.filter((obj) => obj.id !== selectedObject.id);
    updateHistory([...newObjects, ...ungroupedObjects]);

    setSelectedObjectIds(ungroupedObjects.map((obj) => obj.id));
  };

  return (
    <BannerContext.Provider
      value={{
        objects,
        addObject,
        updateObject,
        updateMultipleObjects,
        deleteObject,
        deleteMultipleObjects,
        undo,
        redo,
        canUndo,
        canRedo,
        selectedObjectIds,
        selectObject,
        clearSelection,
        clearHistory,
        clearProject,
        groupSelectedObjects,
        ungroupSelectedObject,
        //
        selectedChildId,
        selectChild,
        clearChildSelection,
        updateChild,
        deleteChild,

        //
        temporaryUpdates,
        setTemporaryUpdates,
        renderedObjects,
        addJson,
        currentProjectName,
        setCurrentProjectName,
        //
        dynamicImgs,
        setDynamicImgs,
        addDynamicImg,
        updateDynamicImg,
        deleteDynamicImg,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = (): BannerContextProps => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error("useBanner must be used within a BannerProvider");
  }
  return context;
};

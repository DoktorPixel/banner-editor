import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { BannerObject, BannerContextProps, BannerChild } from "../types";

const BannerContext = createContext<BannerContextProps | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<BannerObject[][]>(() => {
    const savedData = localStorage.getItem("bannerHistory");
    return savedData ? JSON.parse(savedData) : [[]];
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const [selectedObjectIds, setSelectedObjectIds] = useState<number[]>([]);

  //
  const [temporaryUpdates, setTemporaryUpdates] = useState<{
    [key: number]: Partial<BannerObject>;
  }>({});

  const objects = history[currentStep] || [];

  const renderedObjects = useMemo(() => {
    return objects.map((obj) => ({
      ...obj,
      ...(temporaryUpdates[obj.id] || {}),
    }));
  }, [objects, temporaryUpdates]);

  const [selectedChildId, setSelectedChildId] = useState<{
    groupId: number;
    childId: number;
  } | null>(null);

  //

  const addJson = (jsonData: BannerObject[]) => {
    if (!Array.isArray(jsonData)) {
      console.error("Переданий JSON має бути масивом об'єктів.");
      return;
    }
    updateHistory(jsonData);
  };

  const selectChild = (groupId: number, childId: number) => {
    setSelectedChildId({ groupId, childId });
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

  const clearHistory = () => {
    setHistory([[]]);
    setCurrentStep(0);
    localStorage.removeItem("bannerHistory");
    localStorage.removeItem("currentStep");
  };

  useEffect(() => {
    localStorage.setItem("bannerHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep.toString());
  }, [currentStep]);

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
        return prev.includes(id)
          ? prev.filter((objId) => objId !== id)
          : [...prev, id];
      } else {
        return [id];
      }
    });
  };

  const clearSelection = () => setSelectedObjectIds([]);

  //

  const groupSelectedObjects = () => {
    if (selectedObjectIds.length < 2) {
      console.warn("Для угруповання потрібно виділити щонайменше два об'єкти.");
      return;
    }

    const selectedObjects = objects.filter((obj) =>
      selectedObjectIds.includes(obj.id)
    );

    const newGroup: BannerObject = {
      id: Date.now(),
      type: "group",
      x: Math.min(...selectedObjects.map((obj) => obj.x)),
      y: Math.min(...selectedObjects.map((obj) => obj.y)),
      width:
        Math.max(...selectedObjects.map((obj) => obj.x + (obj.width || 0))) -
        Math.min(...selectedObjects.map((obj) => obj.x)),
      height:
        Math.max(...selectedObjects.map((obj) => obj.y + (obj.height || 0))) -
        Math.min(...selectedObjects.map((obj) => obj.y)),
      children: selectedObjects
        .filter((obj) => obj.type === "text")
        .map((obj) => ({
          id: obj.id,
          type: obj.type as "text",
          x: obj.x - Math.min(...selectedObjects.map((o) => o.x)),
          y: obj.y - Math.min(...selectedObjects.map((o) => o.y)),
          width: obj.width,
          height: obj.height,
          content: obj.content,
          src: obj.src,
          fontSize: obj.fontSize,
          color: obj.color,
          fontWeight: obj.fontWeight,
          fontStyle: obj.fontStyle,
          textTransform: obj.textTransform,
          textDecoration: obj.textDecoration,
          textAlign: obj.textAlign,
          name: obj.name,
        })),
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
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
      x: (child.x || 0) + selectedObject.x,
      y: (child.y || 0) + selectedObject.y,
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

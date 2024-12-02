import { createContext, useContext, useState, useEffect } from "react";
import { BannerObject } from "../types";

interface BannerContextProps {
  objects: BannerObject[];
  addObject: (object: BannerObject) => void;
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
  deleteObject: (id: number) => void;
  deleteMultipleObjects: (ids: number[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedObjectIds: number[];
  selectObject: (id: number, toggle?: boolean) => void;
  clearSelection: () => void;
  clearHistory: () => void;
  groupObjects: (objectIds: number[]) => void;
  ungroupObjects: (groupId: number) => void;
}

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

  const objects = history[currentStep] || [];

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

  const groupObjects = (objectIds: number[]) => {
    const objectsToGroup = objects.filter((obj) => objectIds.includes(obj.id));

    // Проверяем, что все объекты — текстовые
    if (!objectsToGroup.every((obj) => obj.type === "text")) return;

    const minX = Math.min(...objectsToGroup.map((obj) => obj.x));
    const minY = Math.min(...objectsToGroup.map((obj) => obj.y));
    const groupId = Date.now(); // Уникальный ID группы

    // Создаем объект группы
    const group: BannerObject = {
      id: groupId,
      type: "group",
      x: minX,
      y: minY,
      children: objectsToGroup.map((obj) => obj.id),
      zIndex: Math.max(...objectsToGroup.map((obj) => obj.zIndex || 0)) + 1,
    };

    // Удаляем объединенные объекты и добавляем группу
    const newObjects = [
      ...objects.filter((obj) => !objectIds.includes(obj.id)),
      group,
    ];
    updateHistory(newObjects);
  };

  const ungroupObjects = (groupId: number) => {
    const group = objects.find(
      (obj) => obj.id === groupId && obj.type === "group"
    );
    if (!group || !group.children) return;

    // Возвращаем дочерние объекты в список объектов
    const ungroupedObjects = group.children.map((childId) =>
      objects.find((obj) => obj.id === childId)
    );

    const newObjects = [
      ...objects.filter((obj) => obj.id !== groupId), // Удаляем группу
      ...(ungroupedObjects as BannerObject[]), // Добавляем дочерние объекты
    ];
    updateHistory(newObjects);
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
        groupObjects,
        ungroupObjects,
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

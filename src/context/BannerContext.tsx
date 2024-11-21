import { createContext, useContext, useState } from "react";
import { BannerObject } from "../types";

interface BannerContextProps {
  objects: BannerObject[];
  addObject: (object: BannerObject) => void;
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BannerContext = createContext<BannerContextProps | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<BannerObject[][]>([[]]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const objects = history[currentStep] || [];

  const addObject = (object: BannerObject) => {
    const newObjects = [
      ...objects,
      { ...object, width: object.width || 300, height: object.height || 300 }, // Установим размеры по умолчанию
    ];
    updateHistory(newObjects);
  };

  const updateObject = (id: number, updates: Partial<BannerObject>) => {
    const newObjects = objects.map((obj) =>
      obj.id === id ? { ...obj, ...updates } : obj
    );
    updateHistory(newObjects);
  };

  const updateHistory = (newObjects: BannerObject[]) => {
    const newHistory = [...history.slice(0, currentStep + 1), newObjects];
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const undo = () => {
    if (canUndo) setCurrentStep((prev) => prev - 1);
  };

  const redo = () => {
    if (canRedo) setCurrentStep((prev) => prev + 1);
  };

  const canUndo = currentStep > 0;
  const canRedo = currentStep < history.length - 1;

  return (
    <BannerContext.Provider
      value={{ objects, addObject, updateObject, undo, redo, canUndo, canRedo }}
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

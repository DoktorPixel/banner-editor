import { createContext, useContext, useState } from "react";

import { BannerObject } from "../types";

interface BannerContextProps {
  objects: BannerObject[];
  addObject: (object: BannerObject) => void;
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
}

const BannerContext = createContext<BannerContextProps | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [objects, setObjects] = useState<BannerObject[]>([]);

  const addObject = (object: BannerObject) => {
    setObjects((prev) => [...prev, object]);
  };

  const updateObject = (id: number, updates: Partial<BannerObject>) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  };

  return (
    <BannerContext.Provider value={{ objects, addObject, updateObject }}>
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

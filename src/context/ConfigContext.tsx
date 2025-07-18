import { createContext, useContext, useState } from "react";
import { ConfigItem, CustomFont } from "../types";

interface ConfigContextType {
  config: ConfigItem;
  setConfig: React.Dispatch<React.SetStateAction<ConfigItem>>;
  hiddenObjectIds: number[];
  toggleHiddenObject: (id: number) => void;
  updateCanvasSize: (width: number, height: number) => void;
  canvasSize: { width: number; height: number };
  setCustomFonts: (fonts: CustomFont[]) => void;
  addCustomFont: (font: CustomFont) => void;
  removeCustomFont: (fontId: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ConfigItem>({
    hiddenObjectIds: [],
    keyValuePairs: [
      { key: "title", value: "Назва продукту" },
      { key: "img", value: "https://placehold.co/300" },
      { key: "price", value: "1000" },
      { key: "sale_price", value: "800 UAH" },
    ],
    canvasSize: { width: 1080, height: 1080 },
    customFonts: [],
  });

  const toggleHiddenObject = (id: number) => {
    setConfig((prev) => {
      const alreadyHidden = prev.hiddenObjectIds.includes(id);
      const updatedIds = alreadyHidden
        ? prev.hiddenObjectIds.filter((i) => i !== id)
        : [...prev.hiddenObjectIds, id];
      return { ...prev, hiddenObjectIds: updatedIds };
    });
  };

  const updateCanvasSize = (width: number, height: number) => {
    setConfig((prev) => ({
      ...prev,
      canvasSize: { width, height },
    }));
  };

  const setCustomFonts = (fonts: CustomFont[]) => {
    setConfig((prev) => ({ ...prev, customFonts: fonts }));
  };

  const addCustomFont = (font: CustomFont) => {
    setConfig((prev) => ({
      ...prev,
      customFonts: [...(prev.customFonts ?? []), font],
    }));
  };

  const removeCustomFont = (fontId: string) => {
    setConfig((prev) => ({
      ...prev,
      customFonts: (prev.customFonts ?? []).filter((f) => f.id !== fontId),
    }));
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        hiddenObjectIds: config.hiddenObjectIds,
        toggleHiddenObject,
        updateCanvasSize,
        canvasSize: config.canvasSize,
        setCustomFonts,
        addCustomFont,
        removeCustomFont,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

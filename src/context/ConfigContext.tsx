import { createContext, useContext, useState } from "react";
import { ConfigItem } from "../types";

interface ConfigContextType {
  config: ConfigItem;
  setConfig: (newConfig: ConfigItem) => void;
  hiddenObjectIds: number[];
  toggleHiddenObject: (id: number) => void;
  updateCanvasSize: (width: number, height: number) => void;
  canvasSize: { width: number; height: number };
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
    ],
    canvasSize: { width: 1080, height: 1080 },
  });
  const toggleHiddenObject = (id: number) => {
    setConfig((prev) => {
      const alreadyHidden = prev.hiddenObjectIds.includes(id);
      const updatedIds = alreadyHidden
        ? prev.hiddenObjectIds.filter((i) => i !== id)
        : [...prev.hiddenObjectIds, id];

      return {
        ...prev,
        hiddenObjectIds: updatedIds,
      };
    });
  };
  const updateCanvasSize = (width: number, height: number) => {
    setConfig((prev) => ({
      ...prev,
      canvasSize: { width, height },
    }));
  };
  const canvasSizeValue = {
    width: config.canvasSize.width,
    height: config.canvasSize.height,
  };

  const updateConfig = (newConfig: ConfigItem) => {
    setConfig({
      ...newConfig,
      canvasSize: { ...newConfig.canvasSize },
      keyValuePairs: [...newConfig.keyValuePairs],
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig: updateConfig,
        hiddenObjectIds: config.hiddenObjectIds,
        toggleHiddenObject,
        updateCanvasSize,
        canvasSize: canvasSizeValue,
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

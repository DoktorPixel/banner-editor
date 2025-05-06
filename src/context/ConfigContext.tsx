// ConfigContext.tsx
import { createContext, useContext, useState } from "react";
import { ConfigItem } from "../types";

interface ConfigContextType {
  config: ConfigItem;
  setConfig: React.Dispatch<React.SetStateAction<ConfigItem>>;
  hiddenObjectIds: number[];
  toggleHiddenObject: (id: number) => void;
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

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        hiddenObjectIds: config.hiddenObjectIds,
        toggleHiddenObject,
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

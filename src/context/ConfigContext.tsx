import { createContext, useContext, useState } from "react";

import { ConfigItem } from "../types";

interface ConfigContextType {
  config: ConfigItem[];
  setConfig: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
  hiddenObjectIds: number[];
  toggleHiddenObject: (id: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ConfigItem[]>([]);
  const [hiddenObjectIds, setHiddenObjectIds] = useState<number[]>([]);
  console.log("hiddenObjectIds:", hiddenObjectIds);

  const toggleHiddenObject = (id: number) => {
    setHiddenObjectIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <ConfigContext.Provider
      value={{ config, setConfig, hiddenObjectIds, toggleHiddenObject }}
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

import { createContext, useContext, useState } from "react";

interface ConfigItem {
  key: string;
  value: string;
}

interface ConfigContextType {
  config: ConfigItem[];
  setConfig: React.Dispatch<React.SetStateAction<ConfigItem[]>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ConfigItem[]>([
    { key: "title", value: "title" },
    { key: "sale_price", value: "sale_price" },
    { key: "price", value: "price" },
  ]);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
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

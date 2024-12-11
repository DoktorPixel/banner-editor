// ModeContext.tsx
import { createContext, useContext, useState } from "react";

type Mode = "dev" | "test";

interface ModeContextProps {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextProps | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<Mode>("dev");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "dev" ? "test" : "dev"));
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = (): ModeContextProps => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};

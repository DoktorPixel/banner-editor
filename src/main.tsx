import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
import { ModeProvider } from "./context/ModeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModeProvider>
      <main className="main ">
        <App />
      </main>
    </ModeProvider>
  </StrictMode>
);

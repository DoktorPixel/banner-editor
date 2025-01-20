import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
import { ModeProvider } from "./context/ModeContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModeProvider>
      <BrowserRouter>
        <main className="main ">
          <App />
        </main>
      </BrowserRouter>
    </ModeProvider>
  </StrictMode>
);

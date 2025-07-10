// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <main className="main ">
      <App />
    </main>
  </BrowserRouter>
  // </StrictMode>
);

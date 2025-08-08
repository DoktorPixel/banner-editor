import { jsx as _jsx } from "react/jsx-runtime";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
// <StrictMode>
_jsx(BrowserRouter, { children: _jsx("main", { className: "main ", children: _jsx(App, {}) }) })
// </StrictMode>
);

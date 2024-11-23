import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsxs("main", { className: "main ", children: [" ", _jsx(App, {})] }) }));

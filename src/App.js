import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import { BannerProvider } from "./context/BannerContext";
import { ConfigProvider } from "./context/ConfigContext";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "./locales/i18n";
import { I18nextProvider } from "react-i18next";
import { CssBaseline } from "@mui/material";
import theme from "../theme";
import Layout from "./components/Layout";
import { useAuth } from "./utils/useAuth";
const App = () => {
    const { isAuthReady } = useAuth();
    const queryClient = new QueryClient();
    return (_jsx(BannerProvider, { children: _jsx(ConfigProvider, { children: _jsx(ThemeProvider, { theme: theme, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsxs(I18nextProvider, { i18n: i18n, children: [_jsx(CssBaseline, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/:projectId", element: _jsx(Layout, { isAuthReady: isAuthReady }) }), _jsx(Route, { path: "/project/:projectName", element: _jsx(Layout, { isAuthReady: isAuthReady }) }), _jsx(Route, { path: "/", element: _jsx(Layout, { isAuthReady: isAuthReady }) })] })] }) }) }) }) }));
};
export default App;

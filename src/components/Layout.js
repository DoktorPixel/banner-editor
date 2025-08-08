import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import Sidebar from "./Sidebar";
import BannerArea from "./BannerArea";
import ObjectProperties from "./ObjectProperties";
import { useConfig } from "../context/ConfigContext";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useProject } from "../utils/useSupabaseProject";
const defaultConfig = {
    hiddenObjectIds: [],
    keyValuePairs: [
        { key: "title", value: "Назва продукту" },
        { key: "img", value: "https://placehold.co/300" },
        { key: "price", value: "1000 UAH" },
        { key: "sale_price", value: "800 UAH" },
    ],
    canvasSize: {
        width: 1080,
        height: 1080,
    },
};
const Layout = ({ isAuthReady }) => {
    const { currentProjectId, setCurrentProjectId, addJson, setDynamicImgs, setCurrentProjectName, } = useBanner();
    const { setConfig, updateCanvasSize } = useConfig();
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { data: template, isLoading, error } = useProject(projectId ?? "");
    useEffect(() => {
        if (!isAuthReady)
            return;
        if (template && !currentProjectId) {
            let parsed = null;
            try {
                if (template.config_dev?.trim()) {
                    parsed = JSON.parse(template.config_dev);
                }
                console.log("Parsed project configuration:", parsed);
            }
            catch {
                console.error("Error parsing project configuration JSON");
            }
            const objects = parsed?.objects ?? [];
            const dynamicImgs = parsed?.dynamicImgs ?? [];
            if (parsed?.config?.canvasSize) {
                setConfig(parsed.config);
            }
            else if (parsed?.dimensions) {
                const { width, height } = parsed.dimensions;
                const newConfig = {
                    ...defaultConfig,
                    canvasSize: { width, height },
                };
                setConfig(newConfig);
                updateCanvasSize(width, height);
            }
            else {
                setConfig(defaultConfig);
            }
            addJson(objects);
            setDynamicImgs?.(dynamicImgs);
            setCurrentProjectId(projectId);
            setCurrentProjectName(template.name || "Untitled Project");
            if (location.pathname !== `/${projectId}`) {
                navigate(`/${projectId}`, { replace: true });
            }
        }
    }, [
        template,
        currentProjectId,
        setCurrentProjectId,
        addJson,
        setDynamicImgs,
        setCurrentProjectName,
        setConfig,
        updateCanvasSize,
        navigate,
        projectId,
        isAuthReady,
    ]);
    if (!isAuthReady || isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", children: _jsx(CircularProgress, { size: 60 }) }));
    }
    if (error
    // || !template
    ) {
        return (_jsxs(Box, { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", gap: 2, children: [_jsx(Typography, { variant: "h6", color: "error", textAlign: "center", children: error instanceof Error
                        ? error.message
                        : "Unknown error loading project" }), _jsx(Typography, { variant: "h6", color: "info", textAlign: "center", children: "Check your project ID in the URL" })] }));
    }
    return (_jsxs("div", { className: "app", children: [_jsx(Sidebar, {}), _jsx(BannerArea, {}), _jsx(ObjectProperties, {})] }));
};
export default Layout;

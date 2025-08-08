import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { SidebarText, SidebarImage, SidebarLayers, SidebarVariables, SidebarDev, } from "../../../assets/icons";
import TextPanel from "./TextPanel";
import ImagePanel from "./ImagePanel";
import LayersPanel from "./LayersPanel";
import VariablesPanel from "./VariablesPanel";
import DevPanel from "./DevPanel";
import { useTranslation } from "react-i18next";
const SidebarTabs = () => {
    const [activeTab, setActiveTab] = useState("text");
    const { t } = useTranslation();
    const tabs = [
        { id: "text", label: t("sidebarTabs.text"), icon: _jsx(SidebarText, {}) },
        { id: "image", label: t("sidebarTabs.image"), icon: _jsx(SidebarImage, {}) },
        { id: "layers", label: t("sidebarTabs.layers"), icon: _jsx(SidebarLayers, {}) },
        {
            id: "variables",
            label: t("sidebarTabs.variables"),
            icon: _jsx(SidebarVariables, {}),
        },
        { id: "dev", label: t("sidebarTabs.dev"), icon: _jsx(SidebarDev, {}) },
    ];
    return (_jsxs("div", { className: "sidebar-tabs", children: [_jsx(Box, { sx: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                    marginTop: "0",
                }, children: tabs.map((tab) => (_jsx(Button, { onClick: () => setActiveTab(tab.id), sx: {
                        justifyContent: "center",
                        alignItems: "center",
                        textTransform: "none",
                        color: "black",
                        backgroundColor: activeTab === tab.id ? "#EEEEEE" : "transparent",
                        borderRadius: "5px",
                        padding: "5px 5px 0 5px",
                        minWidth: "56px",
                    }, children: _jsxs(Box, { sx: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }, children: [tab.icon, _jsx(Typography, { variant: "caption", children: tab.label })] }) }, tab.id))) }), _jsxs(Box, { sx: { flex: 1, margin: "0 10px 10px 10px" }, children: [activeTab === "text" && _jsx(TextPanel, {}), activeTab === "image" && _jsx(ImagePanel, {}), activeTab === "layers" && _jsx(LayersPanel, {}), activeTab === "variables" && _jsx(VariablesPanel, {}), activeTab === "dev" && _jsx(DevPanel, {})] })] }));
};
export default SidebarTabs;

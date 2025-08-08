import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import { 
// Button,
Stack, 
// Collapse,
IconButton, Box, Typography, } from "@mui/material";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SidebarTabs from "./UI/sidebar-components/SidebarTabs";
import { BigArrowRight, BigArrowLeft } from "../assets/icons";
import AutoSaver from "./UI/updates-components/AutoSaver";
const Sidebar = () => {
    const { undo, redo, canUndo, canRedo, currentProjectName,
    // clearProject
     } = useBanner();
    // const [open, setOpen] = useState(false);
    // const handleToggle = () => setOpen(!open);
    // const handleUpload = async () => {
    //   clearProject();
    // };
    return (_jsxs(Stack, { spacing: 2, className: "sidebar", children: [_jsxs("div", { className: "sidebar-wrapper", children: [_jsxs(Box, { sx: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }, children: [_jsxs("div", { style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    position: "relative",
                                }, children: [_jsx(Typography, { sx: { lineHeight: "1" }, children: "FeedEdify Editor" }), _jsx(AutoSaver, {})] }), _jsxs("div", { children: [_jsx(IconButton, { size: "small", onClick: undo, disabled: !canUndo, children: _jsx(BigArrowLeft, {}) }), _jsx(IconButton, { size: "small", onClick: redo, disabled: !canRedo, children: _jsx(BigArrowRight, {}) })] })] }), _jsx(Typography, { variant: "h6", className: "project-name", children: currentProjectName || "No name" })] }), _jsx("div", { className: "grey-line" }), _jsx(SidebarTabs, {}), _jsx("div", { style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    margin: "16px 10px 6px 6px",
                } })] }));
};
export default Sidebar;

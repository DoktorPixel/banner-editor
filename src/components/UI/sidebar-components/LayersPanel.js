import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import SidebarObjectList from "../SidebarObjectList";
const LayersPanel = () => {
    return (_jsx(Box, { sx: { display: "flex", flexDirection: "column", gap: "10px" }, children: _jsx(SidebarObjectList, {}) }));
};
export default LayersPanel;

import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import InsertingProps from "../../InsertingProps";
const VariablesPanel = () => {
    return (_jsx(Box, { sx: { display: "flex", flexDirection: "column", gap: "10px" }, children: _jsx(InsertingProps, {}) }));
};
export default VariablesPanel;

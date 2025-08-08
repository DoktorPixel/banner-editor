import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button } from "@mui/material";
import { TextNormal, TextItalic } from "../../../assets/icons";
const FontStyleSelector = ({ value, onChange, }) => {
    return (_jsx("div", { className: "font-style-selector", children: _jsxs(ButtonGroup, { variant: "contained", color: "primary", size: "small", sx: { boxShadow: "none" }, children: [_jsx(Button, { onClick: () => onChange("normal"), variant: value === "normal" ? "contained" : "outlined", children: _jsx(TextNormal, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("italic"), variant: value === "italic" ? "contained" : "outlined", children: _jsx(TextItalic, { width: "24px", height: "24px" }) })] }) }));
};
export default FontStyleSelector;

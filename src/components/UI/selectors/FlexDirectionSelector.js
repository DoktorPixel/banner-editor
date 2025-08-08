import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button, Tooltip } from "@mui/material";
import { ArrowDownward, ArrowForward } from "@mui/icons-material";
export const FlexDirectionSelector = ({ value, onChange, }) => {
    return (_jsxs(ButtonGroup, { fullWidth: true, variant: "outlined", className: "flex-direction-selector", children: [_jsx(Tooltip, { title: "\u041F\u043E \u0440\u044F\u0434\u043A\u0430\u0445 (row)", children: _jsx(Button, { onClick: () => onChange("row"), variant: value === "row" ? "contained" : "outlined", children: _jsx(ArrowForward, {}) }) }), _jsx(Tooltip, { title: "\u041F\u043E \u043A\u043E\u043B\u043E\u043D\u043A\u0430\u0445 (column)", children: _jsx(Button, { onClick: () => onChange("column"), variant: value === "column" ? "contained" : "outlined", children: _jsx(ArrowDownward, {}) }) })] }));
};

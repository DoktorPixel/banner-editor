import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button, Box, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { 
// TextLineThrough,
// TextOverline,
TextDecorationNone,
// TextUnderline,
 } from "../../../assets/icons";
export const TextTransformSelector = ({ value, onChange, }) => {
    const { t } = useTranslation();
    return (_jsxs(Box, { children: [_jsx(InputLabel, { sx: { mb: "5px", fontSize: "12px" }, children: t("sidebar.textTransformTitle") }), _jsxs(ButtonGroup, { color: "primary", size: "small", sx: { boxShadow: "none" }, children: [_jsx(Button, { onClick: () => onChange("none"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "none" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "none" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "none" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextDecorationNone, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("uppercase"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "uppercase" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "uppercase" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "uppercase" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx("p", { className: "text-transform-buttons", children: "AA" }) }), _jsx(Button, { onClick: () => onChange("lowercase"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "lowercase" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "lowercase" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "lowercase" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx("p", { className: "text-transform-buttons", children: "aa" }) }), _jsx(Button, { onClick: () => onChange("capitalize"), variant: value === "capitalize" ? "contained" : "outlined", sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "capitalize" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "capitalize" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "capitalize" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx("p", { className: "text-transform-buttons", children: "Aa" }) })] })] }));
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button, InputLabel } from "@mui/material";
import { TextAlignLeft, TextAlignRight, TextAlignCenter, TextAlignJustify, } from "../../../assets/icons";
import { useTranslation } from "react-i18next";
const TextAlignSelector = ({ value, onChange, }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "text-align", children: [_jsx(InputLabel, { sx: { mb: "5px", fontSize: "12px" }, children: t("sidebar.alignment") }), _jsxs(ButtonGroup, { color: "primary", size: "small", sx: { boxShadow: "none" }, children: [_jsx(Button, { onClick: () => onChange("left"), sx: {
                            height: "30px",
                            padding: "0 10px",
                            backgroundColor: value === "left" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "left" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "left" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextAlignLeft, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("center"), sx: {
                            height: "30px",
                            padding: "0 10px",
                            backgroundColor: value === "center" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "center" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "center" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextAlignCenter, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("right"), sx: {
                            height: "30px",
                            padding: "0 10px",
                            backgroundColor: value === "right" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "right" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "right" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextAlignRight, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("justify"), sx: {
                            height: "30px",
                            padding: "0 10px",
                            backgroundColor: value === "justify" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "justify" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "justify" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextAlignJustify, { width: "24px", height: "24px" }) })] })] }));
};
export default TextAlignSelector;

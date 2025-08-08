import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button, InputLabel } from "@mui/material";
import { TextNormal, TextItalic } from "../../../assets/icons";
import { useTranslation } from "react-i18next";
const FontStyleSelector = ({ value, onChange, }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "font-style", children: [_jsx(InputLabel, { sx: { mb: "5px", fontSize: "12px" }, children: t("sidebar.fontStyle") }), _jsxs(ButtonGroup, { size: "small", sx: { boxShadow: "none" }, children: [_jsx(Button, { onClick: () => onChange("normal"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "normal" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "normal" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "normal" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextNormal, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("italic"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "italic" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "italic" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "italic" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextItalic, { width: "24px", height: "24px" }) })] })] }));
};
export default FontStyleSelector;

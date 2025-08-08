import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button, InputLabel } from "@mui/material";
import { TextLineThrough, TextOverline, TextDecorationNone, TextUnderline, } from "../../../assets/icons";
import { useTranslation } from "react-i18next";
const TextDecorationSelector = ({ value, onChange, }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "text-decoration", children: [_jsx(InputLabel, { sx: { mb: "5px", fontSize: "12px" }, children: t("sidebar.textDecoration") }), _jsxs(ButtonGroup, { color: "primary", size: "small", sx: { boxShadow: "none" }, children: [_jsx(Button, { onClick: () => onChange("none"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "none" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "none" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "none" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextDecorationNone, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("underline"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "underline" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "underline" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "underline" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextUnderline, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("overline"), sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "overline" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "overline" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "overline" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextOverline, { width: "24px", height: "24px" }) }), _jsx(Button, { onClick: () => onChange("line-through"), variant: value === "line-through" ? "contained" : "outlined", sx: {
                            height: "36px",
                            padding: "0 10px",
                            backgroundColor: value === "line-through" ? "white" : "#F1F1F1",
                            border: "2px solid #F1F1F1",
                            color: value === "line-through" ? "black" : "inherit",
                            "&:hover": {
                                backgroundColor: value === "line-through" ? "white" : "#E8E8E8",
                            },
                        }, children: _jsx(TextLineThrough, { width: "24px", height: "24px" }) })] })] }));
};
export default TextDecorationSelector;

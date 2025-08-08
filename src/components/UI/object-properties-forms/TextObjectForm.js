import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, InputAdornment, Tooltip, } from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import FontSelector from "../selectors/FontSelector";
import { CustomFontSelector } from "../selectors/CustomFontSelector";
import TextAlignSelector from "../button-groups/TextAlignSelector";
import TextDecorationSelector from "../button-groups/TextDecorationSelector";
import FontStyleSelector from "../button-groups/FontStyleSelector";
import { TextTransformSelector } from "../button-groups/TextTransformSelector";
import { MuiColorInput } from "mui-color-input";
import { ConditionSelector } from "../selectors/ConditionSelector";
import ActionToggle from "../button-groups/ActionToggle";
import { LineHeightInput } from "../inputs/LineHeightInput";
import { SvgHelp } from "../../../assets/icons";
import { useTranslation } from "react-i18next";
export const TextObjectForm = ({ object, onChange, }) => {
    const { currentProjectId } = useBanner();
    const { t } = useTranslation();
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", className: "padding-wrapper", sx: { mb: 1 }, children: t("sidebar.text") }), _jsxs("div", { className: "padding-wrapper", children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "-18px",
                        }, children: [_jsx("label", { htmlFor: "custom-textfield", style: {
                                    fontSize: "12px",
                                    color: "rgba(0, 0, 0, 0.6)",
                                }, children: t("sidebar.text") }), _jsx(Tooltip, { arrow: true, title: _jsx(Typography, { sx: { whiteSpace: "pre-line", fontSize: "14px" }, children: t("sidebar.dynamicTagsHelp") }), children: _jsx("span", { style: {
                                        cursor: "pointer",
                                        display: "inline-block",
                                        zIndex: 100,
                                    }, children: _jsx(SvgHelp, { width: "20px", height: "20px" }) }) })] }), _jsx(TextField, { className: "text-field-input", value: object.content || "", onChange: (e) => onChange("content", e.target.value), fullWidth: true, margin: "normal", multiline: true, maxRows: 5 })] }), _jsx("div", { className: "auto-size padding-wrapper", children: !object.autoWidth && (_jsxs("div", { style: { display: "flex", flexDirection: "column", width: "100%" }, children: [_jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: t("sidebar.maxLines") }), _jsx(TextField, { type: "number", value: object.maxLines || "", onChange: (e) => {
                                const value = parseInt(e.target.value, 10);
                                onChange("maxLines", value >= 0 ? value : 0);
                            }, fullWidth: true, margin: "normal" })] })) }), _jsx("div", { className: "grey-line" }), _jsx(ConditionSelector, { objectId: object.id, condition: object.condition }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.general") }), _jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: t("selectors.position") }), _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: t("selectors.left") })),
                                    },
                                }, type: "number", value: object.x || 0, onChange: (e) => onChange("x", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" }), _jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: t("selectors.top") })),
                                    },
                                }, type: "number", value: object.y || 0, onChange: (e) => onChange("y", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" })] })] }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsxs(Typography, { variant: "subtitle2", children: [" ", t("sidebar.layouts")] }), _jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: t("sidebar.size") }), _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: t("selectors.width") })),
                                    },
                                }, type: "number", value: Math.round(object.width || 300), onChange: (e) => onChange("width", Math.round(parseInt(e.target.value, 10))), fullWidth: true, disabled: object.autoWidth, margin: "normal" }), _jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: t("selectors.height") })),
                                    },
                                }, type: "number", value: object.height || 50, onChange: (e) => onChange("height", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" })] }), _jsx("div", { style: { maxWidth: "196px" }, children: _jsx(ActionToggle, { label: t("sidebar.width"), options: [
                                { value: "auto", label: t("sidebar.auto") },
                                { value: "fixed", label: t("sidebar.fixed") },
                            ], selected: object.autoWidth ? "auto" : "fixed", onChange: (value) => onChange("autoWidth", value === "auto") }) })] }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.typography") }), _jsx(FontSelector, { value: object.fontFamily || "Poppins", onChange: (font) => onChange("fontFamily", font) }), _jsxs("div", { className: "auto-size", children: [_jsx(FormControl, { fullWidth: true, children: _jsxs(Select, { value: object.fontWeight || "400", onChange: (e) => onChange("fontWeight", e.target.value), slotProps: {
                                        root: {
                                            style: {
                                                border: "1px solid #E4E4E4",
                                                backgroundColor: "white",
                                            },
                                        },
                                    }, children: [_jsx(MenuItem, { value: "300", children: t("sidebar.fontWeights.light") }), _jsx(MenuItem, { value: "400", children: t("sidebar.fontWeights.regular") }), _jsx(MenuItem, { value: "500", children: t("sidebar.fontWeights.medium") }), _jsx(MenuItem, { value: "600", children: t("sidebar.fontWeights.semiBold") }), _jsx(MenuItem, { value: "700", children: t("sidebar.fontWeights.bold") }), _jsx(MenuItem, { value: "800", children: t("sidebar.fontWeights.extraBold") }), _jsx(MenuItem, { value: "900", children: t("sidebar.fontWeights.black") })] }) }), _jsx(TextField, { type: "number", value: object.fontSize || 16, onChange: (e) => onChange("fontSize", parseInt(e.target.value, 10)), fullWidth: true, slotProps: {
                                    input: {
                                        style: {
                                            border: "1px solid #E4E4E4",
                                            backgroundColor: "white",
                                        },
                                    },
                                } })] }), _jsx(MuiColorInput, { label: t("sidebar.color"), format: "hex", value: object.color || "#000000", onChange: (newColor) => onChange("color", newColor), isAlphaHidden: true, fullWidth: true, sx: { margin: "32px 0 10px 0" } }), _jsxs("div", { className: "auto-size", children: [_jsx(LineHeightInput, { value: object.lineHeight || "120%", onChange: (value) => onChange("lineHeight", value) }), _jsx(TextField, { label: t("sidebar.letterSpacing"), type: "number", value: object.letterSpacing || 0, onChange: (e) => {
                                    const value = parseFloat(e.target.value);
                                    onChange("letterSpacing", isNaN(value) ? 0 : value);
                                }, fullWidth: true, margin: "normal", inputProps: {
                                    step: 0.1,
                                    min: -2,
                                    max: 5,
                                } })] })] }), _jsx("div", { className: "grey-line" }), _jsx(CustomFontSelector, { templateId: currentProjectId || "" }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsx(TextAlignSelector, { value: object.textAlign || "left", onChange: (value) => onChange("textAlign", value) }), _jsx(FontStyleSelector, { value: object.fontStyle || "normal", onChange: (value) => onChange("fontStyle", value) }), _jsx(TextDecorationSelector, { value: (object.textDecoration || "none").toString(), onChange: (value) => onChange("textDecoration", value) }), _jsx(TextTransformSelector, { value: object.textTransform || "none", onChange: (value) => onChange("textTransform", value || "none") })] }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", style: { marginTop: "20px" }, children: [_jsx(Typography, { variant: "subtitle2", sx: { mb: "10px" }, children: t("sidebar.appearance") }), _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { label: t("sidebar.rotate"), type: "number", value: object.rotate || 0, onChange: (e) => onChange("rotate", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" }), _jsx(TextField, { label: t("sidebar.opacity"), type: "number", slotProps: {
                                    input: {
                                        inputProps: {
                                            step: 1,
                                            min: 1,
                                            max: 100,
                                        },
                                    },
                                }, value: Math.round((Number(object.opacity) || 1) * 100), onChange: (e) => {
                                    let newValue = parseInt(e.target.value, 10);
                                    if (isNaN(newValue))
                                        newValue = 100;
                                    newValue = Math.min(100, Math.max(1, newValue));
                                    onChange("opacity", newValue / 100);
                                }, fullWidth: true, margin: "normal" })] })] })] }));
};

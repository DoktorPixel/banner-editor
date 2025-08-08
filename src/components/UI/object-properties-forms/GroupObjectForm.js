import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Box, Typography, InputLabel, Select, MenuItem, TextField, Button, ButtonGroup, InputAdornment, IconButton, } from "@mui/material";
import { PlusIcon, MinusIcon } from "../../../assets/icons";
import { MuiColorInput } from "mui-color-input";
import { useObjectProperties } from "../../../utils/hooks";
import { ConditionSelector } from "../selectors/ConditionSelector";
import { BorderBottom, BorderLeft, BorderRight, BorderTop, ArrowRight1, ArrowDown1, PaddingLeft, PaddingRight, PaddingTop, PaddingBottom, } from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import { ActionToggleMultiple } from "../button-groups/ActionToggleMultiple";
import { AutoLayoutForm } from "../button-groups/AutoLayoutForm";
import { useTranslation } from "react-i18next";
export const GroupObjectForm = ({ object, onChange, }) => {
    const [isBorderEditing, setIsBorderEditing] = useState(false);
    const { updateObjectMultipleProperties, selectedObject } = useObjectProperties();
    const { t } = useTranslation();
    const [borderSides, setBorderSides] = useState({
        top: true,
        bottom: true,
        left: true,
        right: true,
    });
    const toggleBorderSide = (side) => {
        const isActive = borderSides[side];
        setBorderSides((prev) => ({
            ...prev,
            [side]: !isActive,
        }));
        if (isActive) {
            updateObjectMultipleProperties(object.id, {
                [`border${capitalize(side)}Style`]: undefined,
                [`border${capitalize(side)}Color`]: undefined,
                [`border${capitalize(side)}Width`]: undefined,
            });
        }
        else {
            updateObjectMultipleProperties(object.id, {
                [`border${capitalize(side)}Style`]: "solid",
                [`border${capitalize(side)}Color`]: "#000000",
                [`border${capitalize(side)}Width`]: 1,
            });
        }
    };
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const handleBorderToggle = (isEditing) => {
        setIsBorderEditing(isEditing);
        if (!isEditing) {
            updateObjectMultipleProperties(object.id, {
                borderTopStyle: undefined,
                borderTopColor: undefined,
                borderTopWidth: undefined,
                borderBottomStyle: undefined,
                borderBottomColor: undefined,
                borderBottomWidth: undefined,
                borderLeftStyle: undefined,
                borderLeftColor: undefined,
                borderLeftWidth: undefined,
                borderRightStyle: undefined,
                borderRightColor: undefined,
                borderRightWidth: undefined,
            });
        }
    };
    const handleAddBorder = () => {
        handleBorderToggle(true);
        updateObjectMultipleProperties(object.id, {
            borderTopStyle: "solid",
            borderTopColor: "#000000",
            borderTopWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "#000000",
            borderBottomWidth: 1,
            borderLeftStyle: "solid",
            borderLeftColor: "#000000",
            borderLeftWidth: 1,
            borderRightStyle: "solid",
            borderRightColor: "#000000",
            borderRightWidth: 1,
        });
    };
    const handleBorderChange = (property, value) => {
        updateObjectMultipleProperties(object.id, {
            [`borderTop${property}`]: value,
            [`borderBottom${property}`]: value,
            [`borderLeft${property}`]: value,
            [`borderRight${property}`]: value,
        });
    };
    useEffect(() => {
        const hasBorder = object.borderTopStyle ||
            object.borderTopColor ||
            object.borderTopWidth ||
            object.borderBottomStyle ||
            object.borderBottomColor ||
            object.borderBottomWidth ||
            object.borderLeftStyle ||
            object.borderLeftColor ||
            object.borderLeftWidth ||
            object.borderRightStyle ||
            object.borderRightColor ||
            object.borderRightWidth;
        setIsBorderEditing(!!hasBorder);
    }, [object]);
    useEffect(() => {
        setBorderSides({
            top: !!object.borderTopStyle,
            bottom: !!object.borderBottomStyle,
            left: !!object.borderLeftStyle,
            right: !!object.borderRightStyle,
        });
    }, [object]);
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", className: "padding-wrapper", sx: { mb: 1 }, children: t("sidebar.layout") }), _jsx("div", { className: "grey-line" }), _jsx(ConditionSelector, { objectId: object.id, condition: object.condition }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.general") }), _jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: t("selectors.position") }), _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { slotProps: {
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
                                }, type: "number", value: Math.round(object.height || 50), onChange: (e) => onChange("height", parseInt(e.target.value, 10)), fullWidth: true, disabled: object.autoHeight, margin: "normal" })] }), _jsx("div", { style: { maxWidth: "196px" }, children: _jsx(ActionToggle, { label: t("sidebar.width"), options: [
                                { value: "auto", label: t("sidebar.auto") },
                                { value: "fixed", label: t("sidebar.fixed") },
                            ], selected: object.autoWidth ? "auto" : "fixed", onChange: (value) => onChange("autoWidth", value === "auto") }) }), _jsx("div", { style: { maxWidth: "196px" }, children: _jsx(ActionToggle, { label: t("sidebar.height"), options: [
                                { value: "auto", label: t("sidebar.auto") },
                                { value: "fixed", label: t("sidebar.fixed") },
                            ], selected: object.autoHeight ? "auto" : "fixed", onChange: (value) => onChange("autoHeight", value === "auto") }) }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "30px" }, children: [_jsx("div", { style: { maxWidth: "90px" }, children: _jsx(ActionToggle, { label: t("selectors.direction"), options: [
                                        { value: "row", label: _jsx(ArrowRight1, {}) },
                                        { value: "column", label: _jsx(ArrowDown1, {}) },
                                    ], selected: object.flexDirection, onChange: (value) => onChange("flexDirection", value) }) }), _jsx("div", { children: _jsx("div", { style: { maxWidth: "196px" }, children: _jsx(ActionToggleMultiple, { objectId: object.id, value: object.gap, updateObjectMultipleProperties: updateObjectMultipleProperties }) }) })] }), _jsx(InputLabel, { sx: { mt: 1, mb: "2px", fontSize: "12px" }, children: t("sidebar.alignment") }), _jsx(AutoLayoutForm, { flexDirection: selectedObject?.flexDirection || "row", justifyContent: selectedObject?.justifyContent || "center", alignItems: selectedObject?.alignItems || "center", onChange: (changes) => selectedObject &&
                            updateObjectMultipleProperties(selectedObject.id, changes) }), _jsxs("div", { children: [_jsx(InputLabel, { sx: { mt: 1, mb: "2px", fontSize: "12px" }, children: t("sidebar.padding") }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "7px" }, children: [_jsxs("div", { style: {
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "7px",
                                            maxWidth: "250px",
                                        }, children: [_jsx(TextField, { slotProps: {
                                                    input: {
                                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PaddingLeft, {}) })),
                                                    },
                                                }, type: "number", value: object.paddingLeft || 0, onChange: (e) => onChange("paddingLeft", Math.max(0, parseFloat(e.target.value))), fullWidth: true }), _jsx(TextField, { slotProps: {
                                                    input: {
                                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PaddingRight, {}) })),
                                                    },
                                                }, type: "number", value: object.paddingRight || 0, onChange: (e) => onChange("paddingRight", Math.max(0, parseFloat(e.target.value))), fullWidth: true })] }), _jsxs("div", { style: {
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "7px",
                                            maxWidth: "250px",
                                        }, children: [_jsx(TextField, { slotProps: {
                                                    input: {
                                                        startAdornment: (_jsxs(InputAdornment, { position: "start", children: [" ", _jsx(PaddingTop, {})] })),
                                                    },
                                                }, type: "number", value: object.paddingTop || 0, onChange: (e) => onChange("paddingTop", Math.max(0, parseFloat(e.target.value))), fullWidth: true }), _jsx(TextField, { slotProps: {
                                                    input: {
                                                        startAdornment: (_jsxs(InputAdornment, { position: "start", children: [" ", _jsx(PaddingBottom, {})] })),
                                                    },
                                                }, type: "number", value: object.paddingBottom || 0, onChange: (e) => onChange("paddingBottom", Math.max(0, parseFloat(e.target.value))), fullWidth: true })] })] })] })] }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsx(Typography, { variant: "subtitle2", sx: { mb: "10px" }, children: t("sidebar.appearance") }), _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { label: t("sidebar.opacity"), type: "number", slotProps: {
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
                                }, fullWidth: true, margin: "normal" }), _jsx(TextField, { label: t("sidebar.borderRadius"), type: "number", value: object.borderRadius || 0, onChange: (e) => {
                                    const value = parseInt(e.target.value, 10);
                                    onChange("borderRadius", value >= 0 ? value : 0);
                                }, fullWidth: true, margin: "normal" })] }), _jsx("div", { className: "auto-size", style: { width: "calc(50% - 5px)" }, children: _jsx(TextField, { label: t("sidebar.rotate"), type: "number", value: object.rotate || 0, onChange: (e) => onChange("rotate", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" }) })] }), _jsx("div", { className: "grey-line" }), _jsx("div", { className: "padding-wrapper", children: _jsx(Box, { children: object.backgroundColor && object.backgroundColor !== "none" ? (_jsxs("div", { children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsxs(Typography, { variant: "subtitle2", children: [t("sidebar.backgroundColor"), " "] }), _jsx(IconButton, { onClick: () => {
                                            onChange("backgroundColor", "none");
                                        }, children: _jsx(MinusIcon, {}) })] }), _jsx(MuiColorInput, { label: t("sidebar.color"), format: "hex", value: object.backgroundColor === "none"
                                    ? ""
                                    : object.backgroundColor, onChange: (newColor) => onChange("backgroundColor", newColor), isAlphaHidden: true, fullWidth: true, sx: { margin: "16px 0 10px 0" } })] })) : (
                    //
                    _jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.backgroundColor") }), _jsx(IconButton, { onClick: () => onChange("backgroundColor", "#F1F1F1"), children: _jsx(PlusIcon, {}) })] })) }) }), _jsx("div", { className: "grey-line" }), _jsx("div", { className: "padding-wrapper", children: !isBorderEditing ? (_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.stroke") }), _jsx(IconButton, { onClick: handleAddBorder, children: _jsx(PlusIcon, {}) })] })) : (_jsxs(Box, { className: "border-editor", children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.stroke") }), _jsx(IconButton, { onClick: () => handleBorderToggle(false), children: _jsx(MinusIcon, {}) })] }), _jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [_jsx(MuiColorInput, { label: t("sidebar.color"), format: "hex", value: object.borderTopColor || "#000000", onChange: (newColor) => handleBorderChange("Color", newColor), isAlphaHidden: true, fullWidth: true, sx: { marginTop: "20px" } }), _jsxs("div", { className: "auto-size", style: { marginBottom: "10px" }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx(InputLabel, { sx: { mb: "2px", fontSize: "12px" }, children: t("sidebar.style") }), _jsxs(Select, { value: object.borderTopStyle || "solid", onChange: (e) => handleBorderChange("Style", e.target.value), fullWidth: true, children: [_jsx(MenuItem, { value: "solid", children: t("sidebar.borderStyles.solid") }), _jsx(MenuItem, { value: "dotted", children: t("sidebar.borderStyles.dotted") }), _jsx(MenuItem, { value: "dashed", children: t("sidebar.borderStyles.dashed") }), _jsx(MenuItem, { value: "double", children: t("sidebar.borderStyles.double") })] })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx(InputLabel, { sx: { mb: "2px", fontSize: "12px" }, children: t("sidebar.weight") }), _jsx(TextField, { type: "number", value: object.borderTopWidth || 1, onChange: (e) => handleBorderChange("Width", parseInt(e.target.value, 10) || undefined), fullWidth: true })] })] }), _jsxs("div", { className: "border-selectors", style: { display: "none" }, children: [_jsxs(ButtonGroup, { children: [_jsx(Button, { variant: borderSides.top ? "contained" : "outlined", onClick: () => toggleBorderSide("top"), sx: { padding: "4px 10px" }, children: _jsx(BorderTop, { width: "24px", height: "24px" }) }), _jsx(Button, { variant: borderSides.bottom ? "contained" : "outlined", onClick: () => toggleBorderSide("bottom"), sx: { padding: "4px 10px" }, children: _jsx(BorderBottom, { width: "24px", height: "24px" }) })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { variant: borderSides.left ? "contained" : "outlined", onClick: () => toggleBorderSide("left"), sx: { padding: "4px 10px" }, children: _jsx(BorderLeft, { width: "24px", height: "24px" }) }), _jsx(Button, { variant: borderSides.right ? "contained" : "outlined", onClick: () => toggleBorderSide("right"), sx: { padding: "4px 10px" }, children: _jsx(BorderRight, { width: "24px", height: "24px" }) })] })] })] })] })) })] }));
};

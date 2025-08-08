import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Typography, InputAdornment, Box, } from "@mui/material";
import UpdateImageDialog from "../dialogs/UpdateImageDialog";
import { ConditionSelector } from "../selectors/ConditionSelector";
import ManageDynamicImgsComponent from "../dialogs/ManageDynamicImgsComponent";
import { useTranslation } from "react-i18next";
export const ImageObjectForm = ({ object, onChange, }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const { t } = useTranslation();
    const handleUpdateUrl = (newUrl) => {
        onChange("src", newUrl);
    };
    const handleInputChange = (key, value) => {
        onChange(key, value);
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", className: "padding-wrapper", sx: { mb: 1 }, children: t("sidebar.image") }), _jsx("div", { className: "grey-line" }), _jsx(ConditionSelector, { objectId: object.id, condition: object.condition }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.general") }), _jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: t("selectors.position") }), _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: t("selectors.left") })),
                                    },
                                }, type: "number", value: object.x || 0, onChange: (e) => onChange("x", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" }), _jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsxs(InputAdornment, { position: "start", children: [" ", t("selectors.top")] })),
                                    },
                                }, type: "number", value: object.y || 0, onChange: (e) => onChange("y", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" })] })] }), _jsx("div", { className: "grey-line" }), _jsxs("div", { className: "padding-wrapper", children: [_jsxs(Typography, { variant: "subtitle2", children: [" ", t("sidebar.layouts")] }), _jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: t("sidebar.size") }), _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: t("selectors.width") })),
                                    },
                                }, type: "number", value: Math.round(object.width || 300), onChange: (e) => onChange("width", Math.round(parseInt(e.target.value, 10))), fullWidth: true, disabled: object.autoWidth, margin: "normal" }), _jsx(TextField, { slotProps: {
                                    input: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: t("selectors.height") })),
                                    },
                                }, type: "number", value: Math.round(object.height || 50), onChange: (e) => onChange("height", parseInt(e.target.value, 10)), fullWidth: true, disabled: object.autoHeight, margin: "normal" })] })] }), object.dynamics && (_jsxs("div", { className: "padding-wrapper", children: [_jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: "URL" }), _jsx(TextField, { type: "text", value: object.src, onChange: (e) => onChange("src", e.target.value), fullWidth: true, margin: "normal" })] })), _jsxs("div", { className: "padding-wrapper", children: [_jsx(InputLabel, { sx: { mt: 1, mb: -2, fontSize: "12px" }, children: t("sidebar.objectFit.label") }), _jsx(FormControl, { fullWidth: true, margin: "normal", children: _jsxs(Select, { value: object.objectFit || "fill", onChange: (e) => handleInputChange("objectFit", e.target.value), children: [_jsx(MenuItem, { value: "fill", children: t("sidebar.objectFit.fill") }), _jsx(MenuItem, { value: "contain", children: t("sidebar.objectFit.contain") }), _jsx(MenuItem, { value: "cover", children: t("sidebar.objectFit.cover") }), _jsx(MenuItem, { value: "none", children: t("sidebar.objectFit.none") })] }) })] }), _jsx("div", { className: "grey-line" }), _jsx("div", { className: "padding-wrapper", style: { marginTop: "10px" }, children: _jsxs("div", { className: "auto-size", children: [_jsx(TextField, { label: t("sidebar.rotate"), type: "number", value: object.rotate || 0, onChange: (e) => onChange("rotate", parseInt(e.target.value, 10)), fullWidth: true, margin: "normal" }), _jsx(TextField, { label: t("sidebar.opacity"), type: "number", slotProps: {
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
                            }, fullWidth: true, margin: "normal" })] }) }), _jsx("div", { className: "grey-line" }), object.dynamicsLogo && (_jsx("div", { className: "padding-wrapper", children: _jsx(ManageDynamicImgsComponent, { object_id: object.object_id, logoName: object.logoName, onChange: onChange }) })), _jsx(UpdateImageDialog, { open: isDialogOpen, initialUrl: object.src || "", onClose: handleDialogClose, onUpdate: handleUpdateUrl })] }));
};

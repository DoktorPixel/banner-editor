import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, CircularProgress, } from "@mui/material";
import { fetchPresetsList, downloadPresetFromS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { useTranslation } from "react-i18next";
const ApplyPresetButton = () => {
    const { objects, updateHistory } = useBanner();
    const [open, setOpen] = useState(false);
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const fetchPresets = async () => {
        setLoading(true);
        const presetsList = await fetchPresetsList();
        setPresets(presetsList);
        setLoading(false);
    };
    useEffect(() => {
        if (open)
            fetchPresets();
    }, [open]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleApplyPreset = async (presetId) => {
        const preset = await downloadPresetFromS3(presetId);
        if (!preset)
            return;
        const updateObjectIds = (obj) => ({
            ...obj,
            id: Date.now() + Math.random(),
            children: obj.children ? obj.children.map(updateObjectIds) : undefined,
        });
        const updatedObjects = preset.objects.map((updateObjectIds));
        updateHistory([...objects, ...updatedObjects]);
        handleClose();
    };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", color: "primary", onClick: handleOpen, children: t("imagePanelButtons.addPreset") }), _jsxs(Dialog, { open: open, onClose: handleClose, children: [_jsx(DialogTitle, { children: "Select a preset" }), _jsx(DialogContent, { children: loading ? (_jsx(CircularProgress, {})) : (_jsx(List, { children: presets.length > 0 ? (presets.map((preset) => (_jsx(ListItem, { children: _jsxs(ListItemButton, { onClick: () => handleApplyPreset(preset.id), children: [preset.previewUrl && preset.previewUrl.trim() !== "" && (_jsx("img", { src: preset.previewUrl, alt: "logo", width: "200rem", height: "auto" })), preset.name] }) }, preset.id)))) : (_jsx("p", { children: "No presets available" })) })) })] })] }));
};
export default ApplyPresetButton;

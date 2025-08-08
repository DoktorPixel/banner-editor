import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@mui/material";
import { uploadPresetToS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
const SavePresetButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const { objects, selectedObjectIds } = useBanner();
    const { t } = useTranslation();
    const handleSavePreset = async () => {
        if (selectedObjectIds.length < 2) {
            console.warn("Select at least 2 objects to create a preset");
            return;
        }
        const presetObjects = objects.filter((obj) => selectedObjectIds.includes(obj.id));
        if (!presetObjects.length) {
            console.warn("No objects found to save to preset");
            return;
        }
        setIsLoading(true);
        const preset = {
            id: `${Date.now()}`,
            name: `Preset-${new Date().toLocaleTimeString()}`,
            previewUrl: "",
            objects: presetObjects,
        };
        try {
            await uploadPresetToS3(preset);
            setNotification("Data successfully uploaded to the server");
        }
        catch (error) {
            console.error("Server upload error", error);
            setNotification("Error while uploading to the server");
        }
        finally {
            setTimeout(() => setNotification(null), 2000);
            setIsLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", color: "secondary", onClick: handleSavePreset, disabled: selectedObjectIds.length < 2 || isLoading, startIcon: isLoading && _jsx(CircularProgress, { size: 20 }), children: isLoading ? t("loading") : t("imagePanelButtons.saveAsPreset") }), notification && (_jsx(Typography, { variant: "body2", color: "success.main", sx: { fontWeight: "bold" }, children: notification }))] }));
};
export default SavePresetButton;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import ImageDialog from "../dialogs/ImageDialog";
import SavePresetButton from "../updates-components/SavePresetButton";
import ApplyPresetButton from "../updates-components/ApplyPresetButton";
import ImageUploader from "./ImageUploader";
import ImageGallery from "./ImageGallery";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
const ImagePanel = () => {
    const { addObject } = useBanner();
    const [dialogState, setDialogState] = useState({
        isImageDialogOpen: false,
    });
    const [imageSrc, setImageSrc] = useState("");
    const { t } = useTranslation();
    const closeDialog = (type) => setDialogState((prev) => ({ ...prev, [type]: false }));
    const handleAddImage = (src) => {
        addObject({
            id: Date.now(),
            type: "image",
            width: 250,
            height: 250,
            x: 50,
            y: 50,
            src,
            name: "",
        });
        setImageSrc("");
        closeDialog("isImageDialogOpen");
    };
    const handleAddDynamicsImage = (url) => {
        addObject({
            id: Date.now(),
            type: "image",
            width: 250,
            height: 250,
            x: 50,
            y: 50,
            src: url,
            name: "",
            dynamics: true,
        });
    };
    const handleAddDynamicsLogo = (url) => {
        addObject({
            id: Date.now(),
            type: "image",
            width: 200,
            height: 150,
            x: 50,
            y: 50,
            src: url,
            name: "",
            dynamicsLogo: true,
            object_id: uuidv4(),
        });
    };
    const handleAddFigure = () => {
        addObject({
            id: Date.now(),
            type: "figure",
            x: 50,
            y: 50,
            width: 200,
            height: 200,
            backgroundColor: "#f0f0f0",
            name: "",
        });
    };
    return (_jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: "10px" }, children: [_jsx(ImageUploader, {}), _jsx(Button, { variant: "contained", color: "primary", onClick: () => handleAddDynamicsImage("{{img}}"), children: t("imagePanelButtons.addDynamicImage") }), _jsx(Button, { variant: "contained", color: "primary", onClick: () => handleAddDynamicsLogo("{{dynamic_img}}"), children: t("imagePanelButtons.addDynamicLogo") }), _jsx(Button, { variant: "contained", color: "primary", onClick: () => handleAddFigure(), children: t("imagePanelButtons.addFigure") }), _jsx(SavePresetButton, {}), _jsx(ApplyPresetButton, {}), _jsx(ImageDialog, { open: dialogState.isImageDialogOpen, imageSrc: imageSrc, onChange: (e) => setImageSrc(e.target.value), onClose: () => closeDialog("isImageDialogOpen"), onAdd: (src) => handleAddImage(src) }), _jsx("div", { className: "grey-line" }), _jsx(ImageGallery, {})] }));
};
export default ImagePanel;

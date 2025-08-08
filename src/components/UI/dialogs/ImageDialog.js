import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box, IconButton, Slider, InputLabel, } from "@mui/material";
import ImageCompression from "browser-image-compression";
import ClearIcon from "@mui/icons-material/Clear";
import DragAndDropFileInput from "../inputs/DragAndDropFileInput";
import { useTranslation } from "react-i18next";
const ImageDialog = ({ open, imageSrc, onChange, onClose, onAdd, }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(600);
    const { t } = useTranslation();
    useEffect(() => {
        if (!open) {
            resetFields();
        }
        else {
            setPreview(imageSrc || "");
        }
    }, [open, imageSrc]);
    const resetFields = () => {
        setFile(null);
        setPreview("");
        setMaxWidthOrHeight(600);
    };
    const handleFileChange = async (newFile) => {
        if (newFile) {
            setFile(newFile);
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight,
                useWebWorker: true,
            };
            try {
                const compressedFile = await ImageCompression(newFile, options);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(compressedFile);
            }
            catch (error) {
                console.error("Image compression error:", error);
            }
        }
        else {
            setFile(null);
            setPreview("");
        }
    };
    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setFile(null);
        setPreview(newUrl);
        onChange(e);
    };
    const handleClearUrl = () => {
        onChange({ target: { value: "" } });
        setPreview("");
    };
    const handleClearFile = () => {
        setFile(null);
        setPreview("");
    };
    const handleAdd = () => {
        if (preview) {
            onAdd(preview);
        }
        onClose();
    };
    const handleSliderChange = (event, value) => {
        setMaxWidthOrHeight(value);
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsxs(DialogTitle, { children: [" ", t("imageDialog.title")] }), _jsxs(DialogContent, { children: [_jsx(Typography, { variant: "body2", gutterBottom: true, children: t("imageDialog.subTitle") }), _jsxs(InputLabel, { sx: { mt: 1, mb: -1, fontSize: "12px" }, children: [" ", t("imageDialog.inputLabel")] }), _jsxs(Box, { display: "flex", alignItems: "center", mb: 2, children: [_jsx(TextField, { margin: "dense", fullWidth: true, value: imageSrc, onChange: handleUrlChange, disabled: Boolean(file) }), imageSrc && (_jsx(IconButton, { onClick: handleClearUrl, children: _jsx(ClearIcon, {}) }))] }), _jsxs(Box, { mt: 2, sx: {
                            width: "98%",
                            opacity: file || preview ? 0.5 : 1,
                            pointerEvents: file || preview ? "none" : "auto",
                        }, children: [_jsxs(Typography, { gutterBottom: true, children: [t("imageDialog.maximumWidth"), " ", maxWidthOrHeight] }), _jsx(Slider, { value: maxWidthOrHeight, onChange: handleSliderChange, min: 20, max: 600, step: 1, valueLabelDisplay: "auto" })] }), _jsxs(Box, { mt: 2, display: "flex", alignItems: "center", children: [_jsx(DragAndDropFileInput, { value: file, onChange: handleFileChange, accept: "image/*", disabled: Boolean(imageSrc) }), file && (_jsx(IconButton, { onClick: handleClearFile, children: _jsx(ClearIcon, {}) }))] }), preview && (_jsx("img", { src: preview, alt: "Preview", style: {
                            maxWidth: "367px",
                            maxHeight: "100%",
                            border: "1px solid #ccc",
                            marginTop: "1rem",
                        } }))] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, color: "secondary", children: t("cancel") }), _jsx(Button, { onClick: handleAdd, color: "primary", disabled: !preview, children: t("add") })] })] }));
};
export default ImageDialog;

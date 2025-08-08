import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Box, Typography, IconButton, TextField, Button, List, ListItem, ListItemText, CircularProgress, Snackbar, Alert, } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PlusIcon, MinusIcon, DeleteFile } from "../../../assets/icons";
import { useFonts, useUploadFont, useDeleteFont, } from "../../../utils/useFonts";
import { useConfig } from "../../../context/ConfigContext";
export const CustomFontSelector = ({ templateId }) => {
    const [open, setOpen] = useState(false);
    const [fontName, setFontName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef(null);
    const { t } = useTranslation();
    const { setCustomFonts } = useConfig();
    const { data: fonts, isLoading: isLoadingFonts, refetch, } = useFonts(templateId);
    // console.log("Fonts data:", fonts);
    const uploadFont = useUploadFont(templateId);
    const deleteFont = useDeleteFont(templateId);
    const handleToggle = () => setOpen((prev) => !prev);
    const handleUpload = async () => {
        if (!selectedFile || !fontName.trim())
            return;
        const cleanFontFamily = fontName.replace(/\s+/g, "");
        uploadFont.mutate({
            file: selectedFile,
            font_name: fontName.trim(),
            font_family: cleanFontFamily,
        }, {
            onSuccess: async () => {
                setFontName("");
                setSelectedFile(null);
                setSuccessMessage(t("customFont.uploadSuccess"));
                const updated = await refetch();
                setCustomFonts(updated.data || []);
            },
            onError: (error) => {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                }
                else {
                    setErrorMessage(t("customFont.unexpectedError"));
                }
            },
        });
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    const handleDelete = (fontId) => {
        deleteFont.mutate(fontId, {
            onSuccess: async () => {
                setSuccessMessage(t("customFont.deleteSuccess"));
                const updated = await refetch();
                setCustomFonts(updated.data || []);
            },
            onError: (error) => {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                }
                else {
                    setErrorMessage(t("customFont.unexpectedError"));
                }
            },
        });
    };
    const handleReset = () => {
        setFontName("");
        setSelectedFile(null);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file)
            setSelectedFile(file);
    };
    const handleClickUploadArea = () => {
        fileInputRef.current?.click();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file)
            setSelectedFile(file);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleCloseSnackbar = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };
    const isActionPending = uploadFont.isPending || deleteFont.isPending || isLoadingFonts;
    return (_jsxs(Box, { px: "10px", children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle2", children: open ? t("customFont.manage") : t("customFont.title") }), _jsx(IconButton, { onClick: handleToggle, children: open ? _jsx(MinusIcon, {}) : _jsx(PlusIcon, {}) })] }), open && (_jsxs(_Fragment, { children: [_jsx(Box, { sx: { maxWidth: "170px", mt: 1 }, children: _jsx(TextField, { fullWidth: true, size: "small", label: t("customFont.fontName"), value: fontName, onChange: (e) => setFontName(e.target.value), slotProps: {
                                input: { style: { height: "40px" } },
                            } }) }), _jsxs(Box, { onClick: handleClickUploadArea, onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, sx: {
                            mt: 2,
                            border: "1px dashed gray",
                            borderRadius: 2,
                            padding: 2,
                            textAlign: "center",
                            backgroundColor: isDragging ? "#f0f0f0" : "transparent",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                        }, children: [_jsx(Typography, { children: selectedFile
                                    ? `${t("customFont.selectedFile")}: ${selectedFile.name}`
                                    : t("customFont.uploadPrompt") }), _jsx("input", { type: "file", accept: ".ttf,.otf,.woff,.woff2", ref: fileInputRef, style: { display: "none" }, onChange: handleFileChange })] }), _jsxs(Box, { sx: { display: "flex", gap: 2, mt: 2 }, children: [_jsx(Button, { variant: "contained", fullWidth: true, disabled: !fontName.trim() || !selectedFile || uploadFont.isPending, onClick: handleUpload, children: uploadFont.isPending ? (_jsx(CircularProgress, { size: 20, color: "inherit" })) : (t("customFont.upload")) }), _jsx(Button, { variant: "outlined", color: "secondary", fullWidth: true, onClick: handleReset, children: t("customFont.reset") })] }), _jsx(Box, { mt: 2, children: isActionPending ? (_jsx(Box, { display: "flex", justifyContent: "center", children: _jsx(CircularProgress, { size: 24 }) })) : (_jsxs(List, { dense: true, children: [fonts?.map((font) => (_jsx(ListItem, { sx: {
                                        cursor: "pointer",
                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                        borderRadius: 2,
                                    }, secondaryAction: deleteFont.isPending ? (_jsx(CircularProgress, { size: 20 })) : (_jsx(IconButton, { edge: "end", onClick: () => handleDelete(font.id), children: _jsx(DeleteFile, {}) })), children: _jsx(ListItemText, { primary: font.font_name, secondary: `${t("customFont.format")}: ${font.font_format}` }) }, font.id))), fonts?.length === 0 && (_jsx(Typography, { variant: "caption", color: "textSecondary", ml: 1, children: t("customFont.empty") }))] })) }), _jsx(Snackbar, { open: !!errorMessage || !!successMessage, autoHideDuration: 3000, onClose: handleCloseSnackbar, anchorOrigin: { vertical: "bottom", horizontal: "center" }, children: _jsx(Alert, { onClose: handleCloseSnackbar, severity: errorMessage ? "error" : "success", variant: "filled", children: errorMessage || successMessage }) })] }))] }));
};

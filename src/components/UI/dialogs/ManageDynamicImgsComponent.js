import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, CircularProgress, Snackbar, Alert, Tooltip, } from "@mui/material";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";
import { DeleteBtn } from "../../../assets/icons";
import { useTranslation } from "react-i18next";
const ManageDynamicImgsComponent = ({ object_id, logoName, onChange, }) => {
    const { currentProjectId, dynamicImgs, deleteDynamicImg, addDynamicImg, updateDynamicImgName, } = useBanner();
    const { useImages, deleteImage, uploadImage } = useSupabaseImages();
    const [image, setImage] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingNewImage, setUploadingNewImage] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);
    const [localLogoName, setLocalLogoName] = useState(logoName || "");
    const [errorMessage, setErrorMessage] = useState(null);
    const fileInputRef = useRef(null);
    const { t } = useTranslation();
    const { data: images, isLoading: loadingLogo, error, } = useImages(currentProjectId ?? "", object_id);
    // console.log("data useImages:", images);
    // console.log("dynamicImgs :", dynamicImgs);
    useEffect(() => {
        setLocalLogoName(logoName || "");
    }, [logoName]);
    const normalizeImagePath = (url) => {
        if (url.includes("/feedmaker/"))
            return url;
        return url.replace("/templates/", "/feedmaker/templates/");
    };
    useEffect(() => {
        if (!images || !dynamicImgs)
            return;
        const dynamicImgsMap = new Map(dynamicImgs.map((d) => [d.id, d]));
        const imagesMap = new Map(images.map((img) => [img.id, img]));
        const enrichedImgs = images.map((img) => ({
            ...img,
            name: dynamicImgsMap.get(img.id)?.name || img.name,
        }));
        const newImgs = enrichedImgs.filter((img) => !dynamicImgsMap.has(img.id));
        newImgs.forEach((img) => addDynamicImg?.(img));
        const deadImgs = dynamicImgs.filter((d) => d.object_id === object_id && !imagesMap.has(d.id));
        deadImgs.forEach((img) => deleteDynamicImg?.(img.id));
        setImage(enrichedImgs);
        if (error) {
            setErrorMessage("Error loading images.");
            console.error("Error loading images:", error);
        }
    }, [images, dynamicImgs, object_id, addDynamicImg, deleteDynamicImg, error]);
    const handleDelete = async (id) => {
        if (!object_id || !currentProjectId)
            return;
        const imageToDelete = images?.find((img) => img.id === id);
        if (!imageToDelete)
            return;
        setDeletingIds((prev) => [...prev, id]);
        try {
            deleteDynamicImg?.(id);
            await deleteImage({ id, objectId: object_id });
            setImage((prev) => prev.filter((img) => img.id !== id));
        }
        catch (error) {
            setErrorMessage("Error deleting image.");
            console.error("Delete error:", error);
        }
        finally {
            setDeletingIds((prev) => prev.filter((delId) => delId !== id));
        }
    };
    const handleUpload = async (file) => {
        if (!currentProjectId || !object_id)
            return;
        setUploadingNewImage(true);
        try {
            const result = await uploadImage({
                file,
                templateId: currentProjectId,
                objectId: object_id,
                compress: true,
            });
            addDynamicImg?.(result);
            setImage((prev) => [...prev, result]);
        }
        catch (error) {
            setErrorMessage("Error uploading image.");
            console.error("Upload error:", error);
        }
        finally {
            setUploadingNewImage(false);
        }
    };
    const handleDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            await handleUpload(file);
        }
    };
    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };
    const handleDragEnter = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (event) => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
        }
    };
    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            await handleUpload(file);
        }
        event.target.value = "";
    };
    const handleNameChange = (id, newName) => {
        setImage((prev) => prev.map((img) => (img.id === id ? { ...img, name: newName } : img)));
        updateDynamicImgName?.(id, newName);
    };
    const handleClickUploadArea = () => {
        fileInputRef.current?.click();
    };
    const handleCloseSnackbar = () => setErrorMessage(null);
    return (_jsxs(Box, { onDrop: handleDrop, onDragOver: handleDragOver, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, children: [_jsx(Typography, { variant: "subtitle2", children: t("dialogs.dynamicImageDialog.dynamicLogos") }), _jsxs(Box, { sx: { position: "relative", marginTop: 2, maxWidth: 199 }, children: [_jsx(Typography, { variant: "caption", sx: {
                            position: "absolute",
                            top: "-18px",
                            fontSize: "0.75rem",
                            color: "rgba(0, 0, 0, 0.6)",
                        }, children: t("dialogs.dynamicImageDialog.logoName") }), _jsx(TextField, { size: "small", value: localLogoName, onChange: (e) => {
                            setLocalLogoName(e.target.value);
                            onChange?.("logoName", e.target.value);
                        }, fullWidth: true })] }), (loadingLogo || uploadingNewImage) && (_jsxs(Typography, { sx: { marginTop: 2 }, children: [_jsx(CircularProgress, { size: 15 }), " ", loadingLogo ? t("loading") : t("uploading")] })), !loadingLogo && (_jsxs("div", { className: "dynamic-images-container", children: [_jsxs(Box, { onClick: handleClickUploadArea, sx: {
                            mt: 2,
                            border: "1px dashed gray",
                            borderRadius: 2,
                            padding: 2,
                            textAlign: "center",
                            backgroundColor: isDragging ? "#f0f0f0" : "transparent",
                            cursor: "pointer",
                        }, children: [_jsx(Typography, { children: t("dialogs.dynamicImageDialog.subTitle") }), _jsx("input", { type: "file", accept: "image/*", ref: fileInputRef, style: { display: "none" }, onChange: handleFileSelect })] }), image && image.length > 0 ? ([...image].reverse().map((img) => (_jsxs("div", { className: "image-container", children: [_jsx(Tooltip, { title: _jsx("img", { src: normalizeImagePath(img.file_url), alt: img.name || "", style: { maxWidth: 250, maxHeight: 250 } }), placement: "left", arrow: true, slotProps: {
                                    popper: {
                                        modifiers: [
                                            {
                                                name: "offset",
                                                options: {
                                                    offset: [0, 10],
                                                },
                                            },
                                        ],
                                    },
                                    tooltip: {
                                        sx: {
                                            backgroundColor: "#fbfbfb",
                                            padding: 1,
                                            border: "1px solid #ccc",
                                        },
                                    },
                                    arrow: {
                                        sx: {
                                            color: "#ccc",
                                        },
                                    },
                                }, children: _jsx("img", { src: normalizeImagePath(img.file_url), alt: img.name || "", className: "image", style: { cursor: "pointer" } }) }), _jsxs(Box, { sx: { position: "relative", marginTop: 1 }, children: [_jsx(Typography, { variant: "caption", sx: {
                                            position: "absolute",
                                            top: "-16px",
                                            left: 8,
                                            fontSize: "0.75rem",
                                            color: "rgba(0, 0, 0, 0.6)",
                                        }, children: t("dialogs.dynamicImageDialog.imageName") }), _jsx(TextField, { size: "small", value: img.name || "", onChange: (e) => handleNameChange(img.id, e.target.value), fullWidth: true })] }), _jsx("button", { className: "delete-button", onClick: (e) => {
                                    e.stopPropagation();
                                    handleDelete(img.id);
                                }, disabled: deletingIds.includes(img.id), children: deletingIds.includes(img.id) ? (_jsx(CircularProgress, { size: 16 })) : (_jsx(DeleteBtn, {})) })] }, img.id)))) : (_jsx(Typography, { sx: { mt: 2, color: "text.secondary" }, children: t("dialogs.dynamicImageDialog.noImages") }))] })), _jsx(Snackbar, { open: !!errorMessage, autoHideDuration: 3000, onClose: handleCloseSnackbar, anchorOrigin: { vertical: "bottom", horizontal: "center" }, children: _jsx(Alert, { onClose: handleCloseSnackbar, severity: "error", variant: "filled", children: errorMessage }) })] }));
};
export default ManageDynamicImgsComponent;

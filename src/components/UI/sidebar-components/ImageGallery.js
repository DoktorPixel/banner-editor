import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";
import { DeleteBtn } from "../../../assets/icons";
import { CircularProgress } from "@mui/material";
const ImageGallery = () => {
    const { currentProjectId, 
    // refreshCounter,
    triggerRefresh, addObject, deleteObjectsByImageSrc, } = useBanner();
    const [isDragging, setIsDragging] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const normalizeImagePath = (url) => {
        if (url.includes("/feedmaker/"))
            return url;
        return url.replace("/templates/", "/feedmaker/templates/");
    };
    const { data: images = [], isLoading } = useSupabaseImages().useImages(currentProjectId, undefined);
    const { uploadImage, deleteImage } = useSupabaseImages();
    const handleDelete = async (id) => {
        const imageToDelete = images.find((img) => img.id === id);
        if (!imageToDelete)
            return;
        setDeletingIds((prev) => [...prev, id]);
        try {
            await deleteImage({ id });
            deleteObjectsByImageSrc(normalizeImagePath(imageToDelete.file_url));
        }
        catch (error) {
            console.error("❌ Delete error:", error);
        }
        finally {
            setDeletingIds((prev) => prev.filter((delId) => delId !== id));
        }
    };
    const handleDrop = async (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (!file || !currentProjectId)
            return;
        setIsUploading(true);
        try {
            const result = await uploadImage({
                file,
                templateId: currentProjectId,
            });
            triggerRefresh();
            addObject({
                id: Date.now(),
                type: "image",
                width: 250,
                height: 250,
                x: 50,
                y: 50,
                src: normalizeImagePath(result.file_url),
                name: "",
            });
        }
        catch (error) {
            console.error("❌ Upload error:", error);
        }
        finally {
            setIsUploading(false);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
        }
    };
    return (_jsxs("div", { className: `image-gallery-wrapper ${isDragging ? "drag-over" : ""}`, onDrop: handleDrop, onDragOver: handleDragOver, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, children: [(isLoading || isUploading) && (_jsx("div", { className: "gallery-loading-overlay", children: _jsx(CircularProgress, {}) })), _jsx("div", { className: "image-grid", children: images.map((img, index) => {
                    const fullSrc = img.file_url;
                    return (_jsxs("div", { className: "image-container", onClick: () => addObject({
                            id: Date.now(),
                            type: "image",
                            width: 250,
                            height: 250,
                            x: 50,
                            y: 50,
                            src: normalizeImagePath(fullSrc),
                            name: "",
                        }), children: [_jsx("img", { src: encodeURI(fullSrc), alt: `img-${index + 1}`, className: "image" }), _jsx("button", { className: "delete-button", onClick: (e) => {
                                    e.stopPropagation();
                                    handleDelete(img.id);
                                }, children: deletingIds.includes(img.id) ? (_jsx(CircularProgress, { size: 15 })) : (_jsx(DeleteBtn, {})) })] }, img.id));
                }) })] }));
};
export default ImageGallery;

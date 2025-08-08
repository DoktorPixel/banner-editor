import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Button } from "@mui/material";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";
import { useTranslation } from "react-i18next";
const ImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const { uploadImage } = useSupabaseImages();
    const { currentProjectId, triggerRefresh, addObject } = useBanner();
    const { t } = useTranslation();
    const normalizeImagePath = (url) => {
        if (url.includes("/feedmaker/"))
            return url;
        return url.replace("/templates/", "/feedmaker/templates/");
    };
    const handleAddImage = (url) => {
        addObject({
            id: Date.now(),
            type: "image",
            width: 250,
            height: 250,
            x: 50,
            y: 50,
            src: normalizeImagePath(url),
            name: "",
        });
    };
    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !currentProjectId)
            return;
        setLoading(true);
        try {
            const result = await uploadImage({ file, templateId: currentProjectId });
            event.target.value = "";
            triggerRefresh();
            handleAddImage(result.file_url);
        }
        catch (error) {
            console.error("❌ Upload error:", error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("input", { type: "file", ref: inputRef, onChange: handleUpload, accept: "image/*", style: { display: "none" } }), _jsx(Button, { variant: "contained", onClick: () => inputRef.current?.click(), disabled: loading, children: loading ? t("loading") : t("imagePanelButtons.addImage") })] }));
};
export default ImageUploader;

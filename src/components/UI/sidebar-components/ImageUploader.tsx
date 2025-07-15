import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";
import { useTranslation } from "react-i18next";

const ImageUploader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { uploadImage } = useSupabaseImages();
  const { currentProjectId, triggerRefresh, addObject } = useBanner();
  const { t } = useTranslation();
  const normalizeImagePath = (url: string): string => {
    if (url.includes("/feedmaker/")) return url;
    return url.replace("/templates/", "/feedmaker/templates/");
  };
  const handleAddImage = (url: string) => {
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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentProjectId) return;
    setLoading(true);
    try {
      const result = await uploadImage({ file, templateId: currentProjectId });
      event.target.value = "";
      triggerRefresh();
      handleAddImage(result.file_url);
    } catch (error) {
      console.error("❌ Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
      <Button
        variant="contained"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? t("loading") : t("imagePanelButtons.addImage")}
      </Button>
    </>
  );
};

export default ImageUploader;

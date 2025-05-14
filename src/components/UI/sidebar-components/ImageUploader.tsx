import React, { useRef } from "react";
import { Button } from "@mui/material";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";

const ImageUploader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { uploadImage } = useSupabaseImages();
  const { currentProjectId, triggerRefresh, addObject } = useBanner();
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
      // src: url,
      src: normalizeImagePath(url),
      name: "",
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentProjectId) return;

    try {
      const result = await uploadImage(file, currentProjectId);
      event.target.value = ""; // сбрасываем значение для повторной загрузки того же файла
      triggerRefresh(); // обновляем галерею
      handleAddImage(result.file_url);
    } catch (error) {
      console.error("❌ Upload error:", error);
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
      <Button variant="contained" onClick={() => inputRef.current?.click()}>
        Add Image
      </Button>
    </>
  );
};

export default ImageUploader;

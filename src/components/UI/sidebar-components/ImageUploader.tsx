import React, { useRef } from "react";
import { useFeededifyApi } from "../../../utils/useFeededifyApi";
import { useBanner } from "../../../context/BannerContext";
import { Button } from "@mui/material";

const IMAGE_BASE_URL = "https://api.feededify.app/client/";

const ImageUploader: React.FC = () => {
  const { uploadImage } = useFeededifyApi();
  const { currentProjectId, triggerRefresh, addObject } = useBanner();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddImage = (url: string) => {
    addObject({
      id: Date.now(),
      type: "image",
      width: 250,
      height: 250,
      x: 50,
      y: 50,
      src: `${IMAGE_BASE_URL}${url}`, // сохраняем как есть, без encodeURI
      name: "",
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentProjectId) return;
    try {
      const result = await uploadImage(file, currentProjectId);
      event.target.value = "";
      triggerRefresh();
      handleAddImage(result.url); // raw url
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
        style={{ display: "none" }}
        accept="image/*"
      />
      <Button variant="contained" onClick={() => inputRef.current?.click()}>
        Add Image
      </Button>
    </>
  );
};

export default ImageUploader;

import React from "react";
import { useFeededifyApi } from "../../../utils/useFeededifyApi";
import { useBanner } from "../../../context/BannerContext";
import { TextField } from "@mui/material";

const ImageUploader: React.FC = () => {
  const { uploadImage } = useFeededifyApi();
  const { currentProjectId, triggerRefresh, addObject } = useBanner();
  // console.log("🖼️ ImageUploader, currentProjectId:", currentProjectId);

  const handleAddImage = (src: string) => {
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
  };
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentProjectId) return;
    try {
      const result = await uploadImage(file, currentProjectId);
      event.target.value = "";
      triggerRefresh();
      const fullUrl = `https://api.feededify.app/client/${result.url}`;
      handleAddImage(fullUrl);
    } catch (error) {
      console.error("❌ Upload error:", error);
    }
  };

  return (
    <TextField
      type="file"
      onChange={handleUpload}
      inputProps={{ accept: "image/*" }}
    />
  );
};

export default ImageUploader;

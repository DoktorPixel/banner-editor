import React from "react";
import { useFeededifyApi } from "../../../utils/useFeededifyApi";
import { useBanner } from "../../../context/BannerContext";
import { TextField } from "@mui/material";

const ImageUploader: React.FC = () => {
  const { uploadImage } = useFeededifyApi();
  const { currentProjectId } = useBanner();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentProjectId) return;
    try {
      await uploadImage(file, currentProjectId);
      event.target.value = ""; // Clear the input value to allow re-uploading the same file
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

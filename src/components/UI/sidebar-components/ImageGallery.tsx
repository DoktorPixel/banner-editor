import React, { useEffect, useState } from "react";
import { useFeededifyApi, ImageItem } from "../../../utils/useFeededifyApi";
import { useBanner } from "../../../context/BannerContext";

const ImageGallery: React.FC = () => {
  const { getImages, deleteImage } = useFeededifyApi();
  const { currentProjectId } = useBanner();
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (!currentProjectId) return;
    getImages(currentProjectId).then(setImages).catch(console.error);
  }, [currentProjectId, getImages]);

  const handleDelete = async (id: string) => {
    await deleteImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {images.map((img) => (
        <div key={img.id}>
          <img
            src={img.url}
            alt={`img-${img.id}`}
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
          <button onClick={() => handleDelete(img.id)}>🗑</button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;

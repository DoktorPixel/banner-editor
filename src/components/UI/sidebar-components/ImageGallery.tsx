import React, { useEffect, useState } from "react";
import { useFeededifyApi, ImageItem } from "../../../utils/useFeededifyApi";
import { useBanner } from "../../../context/BannerContext";
import { DeleteBtn } from "../../../assets/icons";

const ImageGallery: React.FC = () => {
  const { getImages, deleteImage } = useFeededifyApi();
  const { currentProjectId, refreshCounter } = useBanner();
  const [images, setImages] = useState<ImageItem[]>([]);
  // console.log("🖼️ ImageGallery", images);
  // console.log("🖼️ ImageGallery, currentProjectId:", currentProjectId);
  const IMAGE_BASE_URL = "https://api.feededify.app/client/";

  useEffect(() => {
    if (!currentProjectId) return;
    getImages(currentProjectId).then(setImages).catch(console.error);
  }, [currentProjectId, getImages, refreshCounter]);

  const handleDelete = async (id: string) => {
    await deleteImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="image-gallery-wrapper">
      <h3>Image Gallery</h3>
      <div className="image-grid">
        {images.map((img, index) => (
          <div key={img.id} className="image-container">
            <img
              src={`${IMAGE_BASE_URL}${encodeURI(img.url)}`}
              alt={`img-${index + 1}`}
              className="image"
            />
            <button
              className="delete-button"
              onClick={() => handleDelete(img.id)}
            >
              <DeleteBtn />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

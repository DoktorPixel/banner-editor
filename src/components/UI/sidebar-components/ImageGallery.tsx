import React, { useEffect, useState, DragEvent } from "react";
import {
  useSupabaseImages,
  SupabaseImageItem,
} from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";
import { DeleteBtn } from "../../../assets/icons";
import { CircularProgress } from "@mui/material";

const ImageGallery: React.FC = () => {
  const { getImages, deleteImage, uploadImage } = useSupabaseImages();
  const {
    currentProjectId,
    refreshCounter,
    triggerRefresh,
    addObject,
    deleteObjectsByImageSrc,
  } = useBanner();

  const [images, setImages] = useState<SupabaseImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const normalizeImagePath = (url: string): string => {
    if (url.includes("/feedmaker/")) return url;
    return url.replace("/templates/", "/feedmaker/templates/");
  };

  useEffect(() => {
    if (!currentProjectId) return;
    setIsLoading(true);
    getImages(currentProjectId)
      .then(setImages)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentProjectId, getImages, refreshCounter]);

  const handleDelete = async (id: string) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (!imageToDelete) return;

    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      deleteObjectsByImageSrc(normalizeImagePath(imageToDelete.file_url));
    } catch (error) {
      console.error("❌ Delete error:", error);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !currentProjectId) return;

    setIsLoading(true);
    try {
      const result = await uploadImage(file, currentProjectId);
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
    } catch (error) {
      console.error("❌ Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  return (
    <div
      className={`image-gallery-wrapper ${isDragging ? "drag-over" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isLoading && (
        <div className="gallery-loading-overlay">
          <CircularProgress />
        </div>
      )}

      <div className="image-grid">
        {images.map((img, index) => {
          const fullSrc = img.file_url;

          return (
            <div
              key={img.id}
              className="image-container"
              onClick={() =>
                addObject({
                  id: Date.now(),
                  type: "image",
                  width: 250,
                  height: 250,
                  x: 50,
                  y: 50,
                  src: normalizeImagePath(fullSrc),
                  name: "",
                })
              }
            >
              <img
                src={encodeURI(fullSrc)}
                alt={`img-${index + 1}`}
                className="image"
              />

              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(img.id);
                }}
              >
                {deletingIds.includes(img.id) ? (
                  <CircularProgress size={15} />
                ) : (
                  <DeleteBtn />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGallery;

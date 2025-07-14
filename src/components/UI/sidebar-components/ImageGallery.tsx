import React, { DragEvent, useState } from "react";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";
import { DeleteBtn } from "../../../assets/icons";
import { CircularProgress } from "@mui/material";

const ImageGallery: React.FC = () => {
  const {
    currentProjectId,
    // refreshCounter,
    triggerRefresh,
    addObject,
    deleteObjectsByImageSrc,
  } = useBanner();

  const [isDragging, setIsDragging] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const normalizeImagePath = (url: string): string => {
    if (url.includes("/feedmaker/")) return url;
    return url.replace("/templates/", "/feedmaker/templates/");
  };

  const { data: images = [], isLoading } = useSupabaseImages().useImages(
    currentProjectId!,
    undefined
  );

  const { uploadImage, deleteImage } = useSupabaseImages();

  const handleDelete = async (id: string) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (!imageToDelete) return;

    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteImage({ id });
      deleteObjectsByImageSrc(normalizeImagePath(imageToDelete.file_url));
    } catch (error) {
      console.error("❌ Delete error:", error);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !currentProjectId) return;

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
    } catch (error) {
      console.error("❌ Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
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
      {(isLoading || isUploading) && (
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

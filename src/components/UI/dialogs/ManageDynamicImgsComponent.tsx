import { useState, useEffect, DragEvent, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";

import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";
import { DeleteBtn } from "../../../assets/icons";
import { SupabaseImageItem } from "../../../types";

interface ManageDynamicImgsComponentProps {
  object_id?: string;
  logoName?: string;
  onChange?: (key: string, value: string) => void;
}

interface UploadedImage {
  id: string;
  file_url: string;
  name?: string;
  template_id?: string;
  object_id?: string;
}

const ManageDynamicImgsComponent: React.FC<ManageDynamicImgsComponentProps> = ({
  object_id,
  logoName,
  onChange,
}) => {
  const {
    currentProjectId,
    deleteObjectsByImageSrc,
    dynamicImgs,
    deleteDynamicImg,
    addDynamicImg,
    updateDynamicImgName,
  } = useBanner();
  const { useImages, deleteImage, uploadImage } = useSupabaseImages();
  const [image, setImage] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingNewImage, setUploadingNewImage] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [localLogoName, setLocalLogoName] = useState(logoName || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    data: images,
    isLoading: loadingLogo,
    error,
  } = useImages(currentProjectId ?? "", object_id);
  useEffect(() => {
    setLocalLogoName(logoName || "");
  }, [logoName]);

  const normalizeImagePath = (url: string): string => {
    if (url.includes("/feedmaker/")) return url;
    return url.replace("/templates/", "/feedmaker/templates/");
  };

  // Синхронизация изображений с контекстом useBanner
  useEffect(() => {
    if (images && dynamicImgs) {
      const enrichedImgs = images.map((img) => {
        const ctxImg = dynamicImgs.find((d) => d.id === img.id);
        return {
          ...img,
          name: ctxImg?.name || img.name,
        };
      });
      enrichedImgs.forEach((img) => addDynamicImg?.(img));
      setImage(enrichedImgs);
    }
    if (error) {
      setErrorMessage("Error loading images.");
      console.error("Error loading images:", error);
    }
  }, [images, dynamicImgs, addDynamicImg, error]);

  const handleDelete = async (id: string) => {
    if (!object_id || !currentProjectId) return;
    const imageToDelete = images?.find((img) => img.id === id);
    if (!imageToDelete) return;

    setDeletingIds((prev) => [...prev, id]);
    const fullSrc = imageToDelete.file_url;

    try {
      await deleteImage({ id, objectId: object_id });
      deleteDynamicImg?.(id);
      setImage((prev) => prev.filter((img) => img.id !== id));
      deleteObjectsByImageSrc(normalizeImagePath(fullSrc));
    } catch (error) {
      setErrorMessage("Error deleting image.");
      console.error("Delete error:", error);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const handleUpload = async (file: File) => {
    if (!currentProjectId || !object_id) return;
    setUploadingNewImage(true);
    try {
      const result: SupabaseImageItem = await uploadImage({
        file,
        templateId: currentProjectId,
        objectId: object_id,
        compress: true,
      });
      addDynamicImg?.(result);
      setImage((prev) => [...prev, result]);
    } catch (error) {
      setErrorMessage("Error uploading image.");
      console.error("Upload error:", error);
    } finally {
      setUploadingNewImage(false);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await handleUpload(file);
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

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
    event.target.value = "";
  };

  const handleNameChange = (id: string, newName: string) => {
    setImage((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name: newName } : img))
    );
    updateDynamicImgName?.(id, newName);
  };

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  const handleCloseSnackbar = () => setErrorMessage(null);

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <Typography variant="subtitle2">Dynamic logos</Typography>

      <Box sx={{ position: "relative", marginTop: 2, maxWidth: 199 }}>
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: "-18px",
            fontSize: "0.75rem",
            color: "rgba(0, 0, 0, 0.6)",
          }}
        >
          Logo name (props)
        </Typography>
        <TextField
          size="small"
          value={localLogoName}
          onChange={(e) => {
            setLocalLogoName(e.target.value);
            onChange?.("logoName", e.target.value);
          }}
          fullWidth
        />
      </Box>

      {(loadingLogo || uploadingNewImage) && (
        <Typography sx={{ marginTop: 2 }}>
          <CircularProgress size={15} />{" "}
          {loadingLogo ? "Loading..." : "Uploading..."}
        </Typography>
      )}

      {!loadingLogo && (
        <div className="dynamic-images-container">
          <Box
            onClick={handleClickUploadArea}
            sx={{
              mt: 2,
              border: "1px dashed gray",
              borderRadius: 2,
              padding: 2,
              textAlign: "center",
              backgroundColor: isDragging ? "#f0f0f0" : "transparent",
              cursor: "pointer",
            }}
          >
            <Typography>
              Click or drag & drop a dynamic image here to upload it to your
              project.
            </Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </Box>

          {image && image.length > 0 ? (
            [...image].reverse().map((img) => (
              <div className="image-container" key={img.id}>
                <Tooltip
                  title={
                    <img
                      src={normalizeImagePath(img.file_url)}
                      alt={img.name || ""}
                      style={{ maxWidth: 250, maxHeight: 250 }}
                    />
                  }
                  placement="left"
                  arrow
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 10],
                          },
                        },
                      ],
                    },
                    tooltip: {
                      sx: {
                        backgroundColor: "#fbfbfb",
                        padding: 1,
                        border: "1px solid #ccc",
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#ccc",
                      },
                    },
                  }}
                >
                  <img
                    src={normalizeImagePath(img.file_url)}
                    alt={img.name || ""}
                    className="image"
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <Box sx={{ position: "relative", marginTop: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: "-16px",
                      left: 8,
                      fontSize: "0.75rem",
                      color: "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Image name
                  </Typography>
                  <TextField
                    size="small"
                    value={img.name || ""}
                    onChange={(e) => handleNameChange(img.id, e.target.value)}
                    fullWidth
                  />
                </Box>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(img.id);
                  }}
                  disabled={deletingIds.includes(img.id)}
                >
                  {deletingIds.includes(img.id) ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DeleteBtn />
                  )}
                </button>
              </div>
            ))
          ) : (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              No dynamic images uploaded yet.
            </Typography>
          )}
        </div>
      )}

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageDynamicImgsComponent;

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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const {
    data: images,
    isLoading: loadingLogo,
    error,
  } = useImages(currentProjectId ?? "", object_id);
  // console.log("data useImages:", images);
  // console.log("dynamicImgs :", dynamicImgs);
  useEffect(() => {
    setLocalLogoName(logoName || "");
  }, [logoName]);

  const normalizeImagePath = (url: string): string => {
    if (url.includes("/feedmaker/")) return url;
    return url.replace("/templates/", "/feedmaker/templates/");
  };

  // const normalizeImagePath = (url: string): string => {
  //   return url;
  // };

  useEffect(() => {
    if (!images || !dynamicImgs) return;

    const dynamicImgsMap = new Map(dynamicImgs.map((d) => [d.id, d]));
    const imagesMap = new Map(images.map((img) => [img.id, img]));
    const enrichedImgs = images.map((img) => ({
      ...img,
      name: dynamicImgsMap.get(img.id)?.name || img.name,
    }));

    const newImgs = enrichedImgs.filter((img) => !dynamicImgsMap.has(img.id));
    newImgs.forEach((img) => addDynamicImg?.(img));

    const deadImgs = dynamicImgs.filter(
      (d) => d.object_id === object_id && !imagesMap.has(d.id)
    );
    deadImgs.forEach((img) => deleteDynamicImg?.(img.id));

    setImage(enrichedImgs);

    if (error) {
      setErrorMessage("Error loading images.");
      console.error("Error loading images:", error);
    }
  }, [images, dynamicImgs, object_id, addDynamicImg, deleteDynamicImg, error]);

  const handleDelete = async (id: string) => {
    if (!object_id || !currentProjectId) return;
    const imageToDelete = images?.find((img) => img.id === id);
    if (!imageToDelete) return;

    setDeletingIds((prev) => [...prev, id]);

    try {
      deleteDynamicImg?.(id);
      await deleteImage({ id, objectId: object_id });
      setImage((prev) => prev.filter((img) => img.id !== id));
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
      <Typography variant="subtitle2">
        {t("dialogs.dynamicImageDialog.dynamicLogos")}
      </Typography>

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
          {t("dialogs.dynamicImageDialog.logoName")}
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
          {loadingLogo ? t("loading") : t("uploading")}
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
            <Typography>{t("dialogs.dynamicImageDialog.subTitle")}</Typography>
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
                    {t("dialogs.dynamicImageDialog.imageName")}
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
              {t("dialogs.dynamicImageDialog.noImages")}
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

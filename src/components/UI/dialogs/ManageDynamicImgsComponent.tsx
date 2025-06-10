import { useState, useEffect, DragEvent } from "react";
import { Box, Typography, Grid, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";

interface UploadedImage {
  id: string;
  file_url: string;
  name?: string;
  template_id?: string;
  object_id?: string;
}

interface ManageDynamicImgsComponentProps {
  object_id?: string;
  logoName?: string;
  onChange?: (key: string, value: string) => void;
}

const ManageDynamicImgsComponent: React.FC<ManageDynamicImgsComponentProps> = ({
  object_id,
  logoName,
  onChange,
}) => {
  const {
    currentProjectId,
    triggerRefresh,
    deleteObjectsByImageSrc,
    dynamicImgs,
    deleteDynamicImg,
    addDynamicImg,
    updateDynamicImgName,
  } = useBanner();
  const { getDynamicImages, deleteDynamicImage, uploadDynamicImage } =
    useSupabaseImages();

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localLogoName, setLocalLogoName] = useState(logoName || "");

  useEffect(() => {
    setLocalLogoName(logoName || "");
  }, [logoName]);

  const normalizeImagePath = (url: string): string => {
    if (url.includes("/feedmaker/")) return url;
    return url.replace("/templates/", "/feedmaker/templates/");
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (!currentProjectId || !object_id) return;
      setLoading(true);
      try {
        const imgs = await getDynamicImages(currentProjectId, object_id);

        // Добавляем имя из context, если оно есть
        const enrichedImgs = imgs.map((img) => {
          const ctxImg = dynamicImgs?.find((d) => d.id === img.id);
          return {
            ...img,
            name: ctxImg?.name || img.name,
          };
        });

        setImages(enrichedImgs);
        enrichedImgs.forEach((img) => addDynamicImg?.(img));
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [currentProjectId, object_id, getDynamicImages]);

  const handleDelete = async (id: string) => {
    if (!object_id) return;
    const imageToDelete = images.find((img) => img.id === id);
    if (!imageToDelete) return;

    const fullSrc = imageToDelete.file_url;
    await deleteDynamicImage(id, object_id);
    deleteDynamicImg?.(id);

    setImages((prev) => prev.filter((img) => img.id !== id));
    deleteObjectsByImageSrc(normalizeImagePath(fullSrc));
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !currentProjectId) return;

    try {
      const result = await uploadDynamicImage(
        file,
        currentProjectId,
        object_id
      );
      triggerRefresh();
      setImages((prev) => [...prev, result]);
      addDynamicImg?.(result);
    } catch (error) {
      console.error("Upload error:", error);
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

  const handleNameChange = (id: string, newName: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, name: newName } : img))
    );
    updateDynamicImgName?.(id, newName);
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      sx={{ mt: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Dynamic logos (object_id: {images[0]?.object_id})
      </Typography>
      <Box sx={{ position: "relative", marginTop: 2, maxWidth: 200 }}>
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
          Logo name
        </Typography>
        <TextField
          size="small"
          value={localLogoName}
          onChange={(e) => {
            setLocalLogoName(e.target.value);
            onChange?.("logoName", e.target.value);
          }}
          fullWidth
          label=""
        />
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Box
            sx={{
              mt: 4,
              border: "2px dashed gray",
              borderRadius: 2,
              padding: 3,
              textAlign: "center",
              backgroundColor: isDragging ? "#f0f0f0" : "transparent",
            }}
          >
            <Typography>
              Drag & drop an image here to upload it to the project
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {images.map((img) => (
              <Grid item xs={12} sm={6} md={4} key={img.id}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img
                    src={normalizeImagePath(img.file_url)}
                    alt={img.name || ""}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      marginBottom: 5,
                    }}
                  />
                  <Box sx={{ position: "relative" }}>
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
                      label=""
                    />
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(img.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ManageDynamicImgsComponent;

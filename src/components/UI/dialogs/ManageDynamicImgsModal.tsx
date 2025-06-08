import { useState, useEffect, DragEvent } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSupabaseImages } from "../../../utils/useSupabaseImages";
import { useBanner } from "../../../context/BannerContext";

interface ManageDynamicImgsModalProps {
  open: boolean;
  onClose: () => void;
}

interface UploadedImage {
  id: string;
  file_url: string;
  name?: string;
  template_id?: string;
  object_id?: string;
}

const ManageDynamicImgsModal: React.FC<ManageDynamicImgsModalProps> = ({
  open,
  onClose,
}) => {
  const { currentProjectId, triggerRefresh, deleteObjectsByImageSrc } =
    useBanner();
  const { getDynamicImages, deleteDynamicImage, uploadDynamicImage } =
    useSupabaseImages();

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeImagePath = (url: string): string => {
    if (url.includes("/feedmaker/")) return url;
    return url.replace("/templates/", "/feedmaker/templates/");
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (!currentProjectId) return;
      setLoading(true);
      try {
        const imgs = await getDynamicImages(currentProjectId);
        setImages(imgs);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchImages();
    }
  }, [open, currentProjectId, getDynamicImages]);

  const handleDelete = async (id: string) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (!imageToDelete) return;

    const fullSrc = imageToDelete.file_url;
    await deleteDynamicImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    deleteObjectsByImageSrc(normalizeImagePath(fullSrc));
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !currentProjectId) return;

    try {
      const result = await uploadDynamicImage(file, currentProjectId);
      triggerRefresh();
      setImages((prev) => [...prev, result]);
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
          maxHeight: "90vh",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <Typography variant="h6" gutterBottom>
          Manage dynamic images object_id: {images[0]?.object_id}
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Grid container spacing={2}>
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
                      style={{ width: 100, height: 100, objectFit: "contain" }}
                    />
                    <Typography variant="body2" noWrap>
                      {img.name || "Unnamed"}
                    </Typography>
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

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={onClose}>
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ManageDynamicImgsModal;

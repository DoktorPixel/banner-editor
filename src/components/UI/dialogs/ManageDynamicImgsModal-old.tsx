import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  downloadFromS3,
  updateDynamicImgsInProject,
} from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { DynamicImg } from "../../../types";
import DragAndDropFileInput2 from "./DragAndDropFileInput2";
import ImageCompression from "browser-image-compression";

interface ManageDynamicImgsModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
}

const ManageDynamicImgsModal: React.FC<ManageDynamicImgsModalProps> = ({
  open,
  onClose,
  projectId,
}) => {
  const [loading, setLoading] = useState(false);
  const [newDynamicImg, setNewDynamicImg] = useState<DynamicImg>({
    name: "",
    file_url: "",
  });

  const { dynamicImgs, setDynamicImgs, addDynamicImg } = useBanner();

  useEffect(() => {
    const fetchDynamicImgs = async () => {
      if (!projectId) return;

      setLoading(true);
      try {
        const projectData = await downloadFromS3(`projects/${projectId}.json`);
        setDynamicImgs?.(projectData?.dynamicImgs || []);
      } catch (error) {
        console.error("Error uploading images to server:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDynamicImgs();
    }
  }, [open, projectId, setDynamicImgs]);

  const handleAddDynamicImg = async () => {
    if (!projectId || !newDynamicImg.name || !newDynamicImg.file_url) return;

    try {
      await updateDynamicImgsInProject(projectId, [newDynamicImg]);
      addDynamicImg?.(newDynamicImg);
      setNewDynamicImg({ name: "", file_url: "" });
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleDeleteDynamicImg = async (index: number) => {
    if (!projectId) return;
    let updatedDynamicImgs: DynamicImg[] = [];
    if (dynamicImgs) {
      updatedDynamicImgs = dynamicImgs.filter((_, i) => i !== index);
    }

    try {
      await updateDynamicImgsInProject(projectId, updatedDynamicImgs);
      setDynamicImgs?.(updatedDynamicImgs);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      try {
        const compressedFile = await ImageCompression(file, options);
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = reader.result as string;
          setNewDynamicImg((prev) => ({ ...prev, file_url: base64 }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Correction when squeezing an image:", error);
      }
    } else {
      setNewDynamicImg((prev) => ({ ...prev, file_url: "" }));
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
      >
        <Typography variant="h6" gutterBottom>
          Image management
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Box>
              <Grid container spacing={2}>
                {dynamicImgs?.map((dynamicImg, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <img
                        src={dynamicImg.file_url}
                        alt={dynamicImg.name}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                        }}
                      />
                      <Typography variant="body2" noWrap>
                        {dynamicImg.name}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteDynamicImg(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1">Add new image</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel sx={{ fontSize: "12px" }}>Image name</InputLabel>
                  <TextField
                    value={newDynamicImg.name}
                    onChange={(e) =>
                      setNewDynamicImg((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel sx={{ fontSize: "12px" }}>URL</InputLabel>
                  <TextField
                    value={newDynamicImg.file_url}
                    onChange={(e) =>
                      setNewDynamicImg((prev) => ({
                        ...prev,
                        file_url: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <DragAndDropFileInput2
                    value={null}
                    onChange={handleFileChange}
                    accept="image/*"
                  />

                  <IconButton
                    color="primary"
                    onClick={handleAddDynamicImg}
                    disabled={!newDynamicImg.name || !newDynamicImg.file_url}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </div>
              </Box>
            </Box>
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
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

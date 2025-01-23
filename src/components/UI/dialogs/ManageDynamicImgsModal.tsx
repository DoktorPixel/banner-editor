import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  downloadFromS3,
  uploadToS3,
  //   deleteFromS3,
  updateDynamicImgsInProject,
} from "../../../S3/s3Storage";
import { DynamicImg } from "../../../types";

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
  const [newDynamicImg, setNewDynamicImg] = useState<DynamicImg>({
    name: "",
    logoUrl: "",
  });
  const [currentDynamicImgs, setCurrentDynamicImgs] = useState<DynamicImg[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Загрузка брендов из S3 при открытии модального окна
  useEffect(() => {
    const fetchDynamicImgs = async () => {
      setLoading(true);
      try {
        const projectData = await downloadFromS3(`projects/${projectId}.json`);
        setCurrentDynamicImgs(projectData?.dynamicImgs || []);
      } catch (error) {
        console.error("Ошибка при загрузке брендов:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDynamicImgs();
    }
  }, [open, projectId]);

  const handleAddDynamicImg = async () => {
    if (newDynamicImg.name && newDynamicImg.logoUrl) {
      const updatedDynamicImgs = [...currentDynamicImgs, newDynamicImg];
      setCurrentDynamicImgs(updatedDynamicImgs);
      setNewDynamicImg({ name: "", logoUrl: "" });

      try {
        await updateDynamicImgsInProject(projectId, [newDynamicImg]);
        console.log("Бренд успешно добавлен.");
      } catch (error) {
        console.error("Ошибка при добавлении бренда:", error);
      }
    }
  };

  const handleDeleteDynamicImg = async (index: number) => {
    // const dynamicImgToDelete = currentDynamicImgs[index];
    const updatedDynamicImgs = currentDynamicImgs.filter((_, i) => i !== index);
    setCurrentDynamicImgs(updatedDynamicImgs);

    try {
      // Обновляем список брендов в S3
      const key = `projects/${projectId}.json`;
      const projectData = await downloadFromS3(key);

      if (projectData) {
        projectData.dynamicImgs = updatedDynamicImgs;
        await uploadToS3(key, projectData);
        console.log("Бренд успешно удалён.");
      }
    } catch (error) {
      console.error("Ошибка при удалении бренда:", error);
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
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Управління брендами
        </Typography>
        {loading ? (
          <Typography>Загрузка...</Typography>
        ) : (
          <>
            <Box>
              <Grid container spacing={2}>
                {currentDynamicImgs.map((dynamicImg, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Avatar
                        src={dynamicImg.logoUrl}
                        alt={dynamicImg.name}
                        sx={{ width: 80, height: 80 }}
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
              <Typography variant="subtitle1">Додати новий бренд</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <TextField
                  label="Название бренда"
                  value={newDynamicImg.name}
                  onChange={(e) =>
                    setNewDynamicImg((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  fullWidth
                />
                <TextField
                  label="URL логотипа"
                  value={newDynamicImg.logoUrl}
                  onChange={(e) =>
                    setNewDynamicImg((prev) => ({
                      ...prev,
                      logoUrl: e.target.value,
                    }))
                  }
                  fullWidth
                />
                <IconButton
                  color="primary"
                  onClick={handleAddDynamicImg}
                  disabled={!newDynamicImg.name || !newDynamicImg.logoUrl}
                >
                  <AddCircleIcon />
                </IconButton>
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
                Отмена
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ManageDynamicImgsModal;

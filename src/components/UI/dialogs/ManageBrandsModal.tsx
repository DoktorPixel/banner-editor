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
  updateBrandsInProject,
} from "../../../S3/s3Storage";
import { Brand } from "../../../types";

interface ManageBrandsModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
}

const ManageBrandsModal: React.FC<ManageBrandsModalProps> = ({
  open,
  onClose,
  projectId,
}) => {
  const [newBrand, setNewBrand] = useState<Brand>({ name: "", logoUrl: "" });
  const [currentBrands, setCurrentBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  // Загрузка брендов из S3 при открытии модального окна
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const projectData = await downloadFromS3(`projects/${projectId}.json`);
        setCurrentBrands(projectData?.brands || []);
      } catch (error) {
        console.error("Ошибка при загрузке брендов:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchBrands();
    }
  }, [open, projectId]);

  const handleAddBrand = async () => {
    if (newBrand.name && newBrand.logoUrl) {
      const updatedBrands = [...currentBrands, newBrand];
      setCurrentBrands(updatedBrands);
      setNewBrand({ name: "", logoUrl: "" });

      try {
        await updateBrandsInProject(projectId, [newBrand]);
        console.log("Бренд успешно добавлен.");
      } catch (error) {
        console.error("Ошибка при добавлении бренда:", error);
      }
    }
  };

  const handleDeleteBrand = async (index: number) => {
    // const brandToDelete = currentBrands[index];
    const updatedBrands = currentBrands.filter((_, i) => i !== index);
    setCurrentBrands(updatedBrands);

    try {
      // Обновляем список брендов в S3
      const key = `projects/${projectId}.json`;
      const projectData = await downloadFromS3(key);

      if (projectData) {
        projectData.brands = updatedBrands;
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
                {currentBrands.map((brand, index) => (
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
                        src={brand.logoUrl}
                        alt={brand.name}
                        sx={{ width: 80, height: 80 }}
                      />
                      <Typography variant="body2" noWrap>
                        {brand.name}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteBrand(index)}
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
                  value={newBrand.name}
                  onChange={(e) =>
                    setNewBrand((prev) => ({ ...prev, name: e.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  label="URL логотипа"
                  value={newBrand.logoUrl}
                  onChange={(e) =>
                    setNewBrand((prev) => ({
                      ...prev,
                      logoUrl: e.target.value,
                    }))
                  }
                  fullWidth
                />
                <IconButton
                  color="primary"
                  onClick={handleAddBrand}
                  disabled={!newBrand.name || !newBrand.logoUrl}
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

export default ManageBrandsModal;

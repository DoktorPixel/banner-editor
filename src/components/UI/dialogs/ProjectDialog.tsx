import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { uploadToS3, downloadFromS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { BannerObject } from "../../../types";

const ProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const { addJson, setCurrentProjectName, clearHistory } = useBanner();

  const handleCreateNewProject = async () => {
    if (!projectName) {
      alert("Назва проекту не може бути порожньою!");
      return;
    }

    setLoading(true);
    try {
      const key = `projects/${projectName}.json`;
      const initialData: BannerObject[] = []; // Новый проект начинается с пустого массива объектов
      await uploadToS3(key, initialData);
      setCurrentProjectName(projectName); // Устанавливаем имя текущего проекта
      alert("Новий проект створено успішно!");
      clearHistory();
      onClose();
    } catch (error) {
      console.error("Помилка створення проекту:", error);
      alert("Не вдалося створити новий проект.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExistingProject = async () => {
    if (!projectName) {
      alert("Назва проекту не може бути порожньою!");
      return;
    }

    setLoading(true);
    try {
      const key = `projects/${projectName}.json`;
      const data = await downloadFromS3(key);

      if (Array.isArray(data)) {
        addJson(data); // Загружаем данные в контекст
        setCurrentProjectName(projectName); // Устанавливаем имя текущего проекта
        alert("Проект завантажено успішно!");
        onClose();
      } else {
        alert("Помилка: Завантажені дані мають невірний формат.");
      }
    } catch (error) {
      console.error("Помилка завантаження проекту:", error);
      alert("Не вдалося завантажити проект.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Виберіть дію</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          label="Назва проекту"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={loading}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCreateNewProject}
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Створити новий проект"}
        </Button>
        <Button
          onClick={handleLoadExistingProject}
          color="secondary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Завантажити існуючий"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { uploadToS3, downloadFromS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { ProjectData } from "../../../types";
import { useConfig } from "../../../context/ConfigContext";

const ProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const { setConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const { addJson, setCurrentProjectName, clearHistory } = useBanner();

  const validateProjectName = (name: string): boolean => {
    if (name.length < 6) {
      setError("Назва проекту повинна містити не менше 6 символів.");
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setError(
        "Назва проекту повинна містити тільки латинські букви, цифри, дефіси або підкреслення."
      );
      return false;
    }
    if (name.length > 36) {
      setError("Назва проекту не може перевищувати 36 символів.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleCreateNewProject = async () => {
    if (!validateProjectName(projectName)) return;

    setLoading(true);
    try {
      const key = `projects/${projectName}.json`;

      const existingProject = await downloadFromS3(key);
      if (existingProject) {
        setSnackbar({
          open: true,
          message: "Проект із таким ім'ям уже існує!",
        });
        return;
      }

      const initialData: ProjectData = { objects: [] };
      await uploadToS3(key, initialData);
      setCurrentProjectName(projectName);
      clearHistory();
      setSnackbar({
        open: true,
        message: "Новий проект створено успішно!",
      });
      onClose();
    } catch (error) {
      console.error("Помилка створення проекту:", error);
      setSnackbar({
        open: true,
        message: "Не вдалося створити новий проект.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExistingProject = async () => {
    if (!validateProjectName(projectName)) return;

    setLoading(true);
    try {
      const key = `projects/${projectName}.json`;
      const data = await downloadFromS3(key);

      if (data && typeof data === "object" && Array.isArray(data.objects)) {
        addJson(data.objects);
        setCurrentProjectName(projectName);
        setConfig(
          data.config || [
            {
              function: "price",
              key: "price",
              value1: "sale_price",
              value2: "discount",
            },
          ]
        );
        setSnackbar({
          open: true,
          message: "Проект завантажено успішно!",
        });
        onClose();
      } else {
        setSnackbar({
          open: true,
          message: "Помилка: Проект не знайдено, перевірте назву.",
        });
      }
    } catch (error) {
      console.error("Помилка завантаження проекту:", error);
      setSnackbar({
        open: true,
        message: "Не вдалося завантажити проект.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateProjectName(projectName);
  }, [projectName]);

  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Виберіть дію</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Назва проекту"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => validateProjectName(projectName)}
            disabled={loading}
            margin="normal"
            error={!!error}
            helperText={error}
          />
        </DialogContent>

        <DialogActions
          style={{
            position: "relative",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            message={snackbar.message}
            sx={{
              position: "relative",
              top: "-15px!important",
              width: "100%",
              textAlign: "center",
            }}
          />
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <Button
              onClick={handleCreateNewProject}
              color="primary"
              disabled={loading || !!error || projectName.length < 6}
              fullWidth
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                "Створити новий проект"
              )}
            </Button>
            <Button
              onClick={handleLoadExistingProject}
              color="secondary"
              disabled={loading || !!error || projectName.length < 6}
              fullWidth
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                "Завантажити існуючий"
              )}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectDialog;

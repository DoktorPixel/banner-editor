import { useState, useEffect } from "react";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { uploadToS3 } from "../../S3/s3Storage";
import { useBanner } from "../../context/BannerContext";
import { ProjectData } from "../../types";

const UploadToS3Button: React.FC = () => {
  const { objects, brands, currentProjectName } = useBanner(); // Предполагается, что brands теперь доступен из контекста
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [initialData, setInitialData] = useState({ objects, brands });

  useEffect(() => {
    setInitialData({ objects, brands });
  }, [currentProjectName]);

  const hasChanges =
    JSON.stringify(objects) !== JSON.stringify(initialData.objects) ||
    JSON.stringify(brands) !== JSON.stringify(initialData.brands);

  const handleUpload = async () => {
    if (!currentProjectName) {
      setSnackbarMessage(
        "Назва проекту не задана! Спочатку створіть або завантажте проект."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const key = `projects/${currentProjectName}.json`;

    const formattedBrands: Record<string, string> = brands
      ? brands.reduce((acc, brand) => {
          if (brand.name && brand.logoUrl) {
            acc[brand.name] = brand.logoUrl; // Ключ — имя бренда, значение — URL логотипа
          }
          return acc;
        }, {} as Record<string, string>)
      : {};

    const projectData: ProjectData = { objects, brands: formattedBrands };
    setIsLoading(true);

    try {
      await uploadToS3(key, projectData);
      setSnackbarMessage(`Дані ${currentProjectName} успішно завантажені в S3`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setInitialData({ objects, brands }); // Обновляем начальные данные
    } catch (error) {
      console.error("Ошибка завантаження в S3:", error);
      setSnackbarMessage("Ошибка завантаження даних в S3");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Button
        onClick={handleUpload}
        color="primary"
        variant="contained"
        disabled={isLoading || !hasChanges}
        startIcon={isLoading && <CircularProgress size={20} />}
      >
        {isLoading ? "Загрузка..." : "Відправити дані в S3"}
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        sx={{
          position: "absolute",
          top: "23px!important",
          left: "370px!important",
          width: "500px",
          textAlign: "center",
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadToS3Button;

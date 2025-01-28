import { useState, useEffect } from "react";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { uploadToS3 } from "../../S3/s3Storage";
import { useBanner } from "../../context/BannerContext";
import { ProjectData } from "../../types";
import { useConfig } from "../../context/ConfigContext";

const UploadToS3Button: React.FC = () => {
  const { objects, dynamicImgs, currentProjectName } = useBanner();
  const { config } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [initialData, setInitialData] = useState({
    objects,
    dynamicImgs,
    config,
  });

  useEffect(() => {
    setInitialData({ objects, dynamicImgs, config });
  }, [currentProjectName]);

  const hasChanges =
    JSON.stringify(objects) !== JSON.stringify(initialData.objects) ||
    JSON.stringify(dynamicImgs) !== JSON.stringify(initialData.dynamicImgs) ||
    JSON.stringify(config) !== JSON.stringify(initialData.config);

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

    const projectData: ProjectData = { objects, dynamicImgs, config };

    setIsLoading(true);

    try {
      await uploadToS3(key, projectData);
      setSnackbarMessage(`Дані ${currentProjectName} успішно завантажені в S3`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setInitialData({ objects, dynamicImgs, config });
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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue =
          "У вас є незбережені зміни. Ви впевнені, що хочете залишити сторінку?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

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

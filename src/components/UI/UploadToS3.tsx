import { useState, useEffect } from "react";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { uploadToS3 } from "../../S3/s3Storage";
import { useBanner } from "../../context/BannerContext";

const UploadToS3Button: React.FC = () => {
  const { objects, currentProjectName } = useBanner();
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [initialObjects, setInitialObjects] = useState(objects);

  useEffect(() => {
    setInitialObjects(objects);
  }, [currentProjectName]);

  const hasChanges = JSON.stringify(objects) !== JSON.stringify(initialObjects);

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
    setIsLoading(true);

    try {
      await uploadToS3(key, objects);
      setSnackbarMessage(`Дані ${currentProjectName} успішно завантажені в S3`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setInitialObjects(objects);
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

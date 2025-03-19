import { useState, useEffect } from "react";
import { CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { uploadToS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { ProjectData } from "../../../types";
import { useConfig } from "../../../context/ConfigContext";

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
        "No project name specified! Please create or load a project first."
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
      setSnackbarMessage(
        `${currentProjectName} data successfully uploaded to the server`
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setInitialData({ objects, dynamicImgs, config });
    } catch (error) {
      console.error("Server upload error:", error);
      setSnackbarMessage("Server upload error");
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
        // color="primary"
        // variant="contained"
        disabled={isLoading || !hasChanges}
        startIcon={isLoading && <CircularProgress size={20} />}
      >
        {isLoading ? "Loading..." : "Send data to server"}
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        sx={{
          position: "relative",
          top: "0px!important",
          left: "0px!important",
          width: "320px",
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

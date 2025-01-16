import { useState } from "react";
import { CircularProgress, Button } from "@mui/material";
import { uploadToS3 } from "../../S3/s3Storage";
import { useBanner } from "../../context/BannerContext";

const UploadToS3Button: React.FC = () => {
  const { objects, currentProjectName } = useBanner();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!currentProjectName) {
      alert(
        "Назва проекту не задана! Спочатку створіть або завантажте проект."
      );
      return;
    }

    const key = `projects/${currentProjectName}.json`;
    setIsLoading(true);

    try {
      await uploadToS3(key, objects);
      alert(`Дані успішно завантажені в S3 під ключ: ${key}`);
    } catch (error) {
      console.error("Ошибка завантаження в S3:", error);
      alert("Ошибка завантаження даних в S3");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpload}
      color="primary"
      variant="contained"
      disabled={isLoading}
      startIcon={isLoading && <CircularProgress size={20} />}
    >
      {isLoading ? "Загрузка..." : "Відправити дані в S3"}
    </Button>
  );
};

export default UploadToS3Button;

import { useState } from "react";
import { Button } from "@mui/material";
import { uploadPresetToS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { CircularProgress, Typography } from "@mui/material";

const SavePresetButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const { objects, selectedObjectIds } = useBanner();

  const handleSavePreset = async () => {
    if (selectedObjectIds.length < 2) {
      console.warn("Виберіть як мінімум 2 об'єкти для створення пресета");
      return;
    }

    const presetObjects = objects.filter((obj) =>
      selectedObjectIds.includes(obj.id)
    );

    if (!presetObjects.length) {
      console.warn("Не знайдено об'єктів для збереження в пресет");
      return;
    }
    setIsLoading(true);
    const preset = {
      id: `${Date.now()}`, // Уникальный ID пресета
      name: `Preset-${new Date().toLocaleTimeString()}`,
      objects: presetObjects,
    };
    try {
      await uploadPresetToS3(preset);
      setNotification("Дані успішно завантажені в S3");
    } catch (error) {
      console.error("Помилка завантаження в S3:", error);
      setNotification("Помилка при завантажені в S3");
    } finally {
      setTimeout(() => setNotification(null), 2000);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSavePreset}
        disabled={selectedObjectIds.length < 2 || isLoading}
        startIcon={isLoading && <CircularProgress size={20} />}
      >
        {isLoading ? "Загрузка..." : "Зберігти як пресет"}
      </Button>
      {notification && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ fontWeight: "bold" }}
        >
          {notification}
        </Typography>
      )}
    </>
  );
};

export default SavePresetButton;

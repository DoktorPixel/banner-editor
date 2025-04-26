import { useState } from "react";
import { Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingButton from "@mui/lab/LoadingButton";

// import { ExportToHTML_2 } from "./ExportToHTML_2";
import { ExportToHTML_3 } from "./ExportToHTML_3";
import { useBanner } from "../../context/BannerContext";

export const ExportToHTMLButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const { objects } = useBanner();

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const html = ExportToHTML_3(objects);
      await navigator.clipboard.writeText(html);
      setNotification("HTML успешно скопирован в буфер обмена!");
    } catch (error) {
      console.error("Ошибка при экспорте:", error);
      setNotification("Ошибка при копировании HTML");
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(""), 3000); //
    }
  };

  return (
    <>
      <LoadingButton
        onClick={handleExport}
        variant="contained"
        color="primary"
        loading={isLoading}
        endIcon={<ContentCopyIcon />}
      >
        {isLoading ? "Копирование..." : "Скопировать HTML"}
      </LoadingButton>

      {notification && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ mt: 2, fontWeight: "bold" }}
        >
          {notification}
        </Typography>
      )}
    </>
  );
};

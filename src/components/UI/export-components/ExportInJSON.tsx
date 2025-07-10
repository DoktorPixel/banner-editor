import { useBanner } from "../../../context/BannerContext";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";

const ExportInJSON: React.FC = () => {
  const { objects, clearSelection, clearChildSelection } = useBanner();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading(true);

    try {
      const objectsJSON = JSON.stringify(objects, null, 2);
      await navigator.clipboard.writeText(objectsJSON);

      setNotification("Data copied to clipboard successfully!");
    } catch (clipboardError) {
      console.error("Error copying to clipboard.", clipboardError);
      setNotification("Error copying to clipboard.");
    } finally {
      setTimeout(() => setNotification(null), 2000);
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingButton
        onClick={() => {
          clearSelection();
          clearChildSelection();
          handleExport();
        }}
        variant="contained"
        color="primary"
        loading={isLoading}
      >
        {isLoading ? (
          "Отправка..."
        ) : (
          <>
            Export in JSON
            <SendIcon sx={{ marginLeft: "10px" }} />
          </>
        )}
      </LoadingButton>
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

export default ExportInJSON;

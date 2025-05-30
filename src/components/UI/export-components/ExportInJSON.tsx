import { useBanner } from "../../../context/BannerContext";
// import axios from "axios";
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
      //
      const objectsJSON = JSON.stringify(objects, null, 2);
      await navigator.clipboard.writeText(objectsJSON);
      // console.log("HTML скопійований у буфер обміну!");
      setNotification("Data copied to clipboard successfully!");
    } catch (clipboardError) {
      console.error("Error copying to clipboard.", clipboardError);
      setNotification("Error copying to clipboard.");
    } finally {
      //
      setTimeout(() => setNotification(null), 2000);
      setIsLoading(false);
    }

    // try {
    //   const exportData = {
    //     step: objects,
    //   };

    //   const response = await axios.post(
    //     "https://test-endpoint/api/export",
    //     exportData
    //   );

    //   console.log("Data sent successfully:", response.data);
    //   alert("Data sent successfully!");
    // } catch (error) {
    //   console.error("Error sending data:", error);
    //   alert("There was an error sending data.");
    // }
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

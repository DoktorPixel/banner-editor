import { useBanner } from "../../context/BannerContext";
import axios from "axios";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";

const ExportToServer: React.FC = () => {
  const { objects, clearSelection, clearChildSelection } = useBanner();
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);

    try {
      //
      const objectsJSON = JSON.stringify(objects, null, 2);
      await navigator.clipboard.writeText(objectsJSON);
      console.log("HTML скопійований у буфер обміну!");
    } catch (clipboardError) {
      console.error("Помилка при копіюванні в буфер обміну:", clipboardError);
    }

    //
    try {
      const exportData = {
        step: objects,
      };

      const response = await axios.post(
        "https://test-endpoint/api/export",
        exportData
      );

      console.log("Data sent successfully:", response.data);
      alert("Data sent successfully!");
    } catch (error) {
      console.error("Error sending data:", error);
      alert("There was an error sending data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          Надіслати JSON <SendIcon sx={{ marginLeft: "10px" }} />
        </>
      )}
    </LoadingButton>
  );
};

export default ExportToServer;

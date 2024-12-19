import { useBanner } from "../../context/BannerContext";
import axios from "axios";
import Button from "@mui/material/Button";

const ExportToServer: React.FC = () => {
  const { objects } = useBanner();

  const handleExport = async () => {
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
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="export-button"
      variant="contained"
      color="primary"
    >
      Надіслати JSON на сервер
    </Button>
  );
};

export default ExportToServer;

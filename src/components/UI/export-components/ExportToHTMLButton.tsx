import { useState } from "react";
import { Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingButton from "@mui/lab/LoadingButton";
import { useBanner } from "../../../context/BannerContext";
import { useConfig } from "../../../context/ConfigContext";
import { ExportToHTML } from "./ExportToHTML";

export const ExportToHTMLButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const { objects, dynamicImgs } = useBanner();
  const { config } = useConfig();

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const html = ExportToHTML(objects, config, dynamicImgs);
      await navigator.clipboard.writeText(html);
      setNotification("HTML successfully copied to clipboard!");
    } catch (error) {
      console.error("Error while exporting:", error);
      setNotification("Error copying HTML");
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(""), 3000);
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
        {isLoading ? "Copying..." : "Export in HTML"}
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

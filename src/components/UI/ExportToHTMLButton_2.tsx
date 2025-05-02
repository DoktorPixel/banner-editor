import { useState } from "react";
import { Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingButton from "@mui/lab/LoadingButton";

// import { ExportToHTML_2 } from "./ExportToHTML_2";
import { ExportToHTML_3 } from "./ExportToHTML_3";
// import { ExportToHTML_4 } from "./ExportToHTML_4";

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
      setNotification("HTML successfully copied to clipboard!");
    } catch (error) {
      console.error("Error while exporting:", error);
      setNotification("Error copying HTML");
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

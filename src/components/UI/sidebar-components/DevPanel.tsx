import { useState } from "react";
import { Box, Button } from "@mui/material";
import JSONDialog from "../dialogs/JSONDialog";
import { useBanner } from "../../../context/BannerContext";
import { BannerObject } from "../../../types";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExportInJSON from "../export-components/ExportInJSON";
import ExportInHTML from "../export-components/ExportInHTML";
// import { ExportToHTML_2 } from "../ExportToHTML_2";
import { ExportToHTMLButton } from "../export-components/ExportToHTMLButton_2";

const DevPanel: React.FC = () => {
  const { addJson } = useBanner();
  const [dialogState, setDialogState] = useState({
    isTextDialogOpen: false,
    isImageDialogOpen: false,
    isClearHistoryDialogOpen: false,
    isJsonDialogOpen: false,
  });

  const openDialog = (type: keyof typeof dialogState) =>
    setDialogState((prev) => ({ ...prev, [type]: true }));

  const closeDialog = (type: keyof typeof dialogState) =>
    setDialogState((prev) => ({ ...prev, [type]: false }));

  const handleLoadJson = (jsonData: BannerObject[]) => {
    addJson(jsonData);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openDialog("isJsonDialogOpen")}
      >
        Import JSON <CloudUploadIcon sx={{ marginLeft: "10px" }} />
      </Button>

      <ExportInJSON />
      <ExportInHTML />
      {/* <ExportToHTML_2 /> */}
      <ExportToHTMLButton />

      <JSONDialog
        open={dialogState.isJsonDialogOpen}
        onClose={() => closeDialog("isJsonDialogOpen")}
        onLoad={handleLoadJson}
      />
    </Box>
  );
};

export default DevPanel;

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { BannerObject } from "../../../types";
import { useTranslation } from "react-i18next";

interface JSONDialogProps {
  open: boolean;
  onClose: () => void;
  onLoad: (jsonData: BannerObject[]) => void;
}

const JSONDialog: React.FC<JSONDialogProps> = ({ open, onClose, onLoad }) => {
  const [jsonContent, setJsonContent] = useState<string>("");
  const { t } = useTranslation();
  const handleLoad = () => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      onLoad(parsedJson);
      setJsonContent("");
      onClose();
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("Invalid JSON. Check the data structure.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle> {t("devPanelButtons.importJSON")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Insert JSON"
          fullWidth
          multiline
          rows={10}
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t("cancel")}
        </Button>
        <Button onClick={handleLoad} color="primary">
          {t("download")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JSONDialog;

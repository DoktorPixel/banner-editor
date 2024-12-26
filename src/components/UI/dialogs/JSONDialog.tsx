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

interface JSONDialogProps {
  open: boolean;
  onClose: () => void;
  onLoad: (jsonData: BannerObject[]) => void;
}

const JSONDialog: React.FC<JSONDialogProps> = ({ open, onClose, onLoad }) => {
  const [jsonContent, setJsonContent] = useState<string>("");

  const handleLoad = () => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      onLoad(parsedJson);
      setJsonContent("");
      onClose();
    } catch (error) {
      console.error("Некоректний JSON:", error);
      alert("Некоректний JSON. Перевірте структуру даних.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Завантажити JSON</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Вставте JSON"
          fullWidth
          multiline
          rows={10}
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Відмінити
        </Button>
        <Button onClick={handleLoad} color="primary">
          Завантажити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JSONDialog;

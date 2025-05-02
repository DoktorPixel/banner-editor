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
      console.error("Invalid JSON:", error);
      alert("Invalid JSON. Check the data structure.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Import JSON</DialogTitle>
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
          Cancel
        </Button>
        <Button onClick={handleLoad} color="primary">
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JSONDialog;

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { DynamicImg } from "../../../types";

interface DynamicImgDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (dynamicImg: DynamicImg) => void;
}

const DynamicImgDialog: React.FC<DynamicImgDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [dynamicImgName, setDynamicImgName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const handleAdd = () => {
    if (dynamicImgName && logoUrl) {
      onAdd({ name: dynamicImgName, logoUrl });
      setDynamicImgName("");
      setLogoUrl("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Завантажити лого</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Назва бренду"
          value={dynamicImgName}
          onChange={(e) => setDynamicImgName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="URL логотипу"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Відмінити
        </Button>
        <Button
          onClick={handleAdd}
          color="primary"
          disabled={!dynamicImgName || !logoUrl}
        >
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicImgDialog;

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Brand } from "../../../types";

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (brand: Brand) => void;
}

const BrandDialog: React.FC<BrandDialogProps> = ({ open, onClose, onAdd }) => {
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const handleAdd = () => {
    if (brandName && logoUrl) {
      onAdd({ name: brandName, logoUrl });
      setBrandName("");
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
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
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
          disabled={!brandName || !logoUrl}
        >
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandDialog;

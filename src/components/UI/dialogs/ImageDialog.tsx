import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface ImageDialogProps {
  open: boolean;
  imageSrc: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onAdd: () => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  open,
  imageSrc,
  onChange,
  onClose,
  onAdd,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Додати зображення</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="URL зображення"
        fullWidth
        value={imageSrc}
        onChange={onChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Відмінити
      </Button>
      <Button onClick={onAdd} color="primary">
        Додати
      </Button>
    </DialogActions>
  </Dialog>
);

export default ImageDialog;

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface TextDialogProps {
  open: boolean;
  textContent: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onAdd: () => void;
}

const TextDialog: React.FC<TextDialogProps> = ({
  open,
  textContent,
  onChange,
  onClose,
  onAdd,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Додати текст</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Текст"
        fullWidth
        value={textContent}
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

export default TextDialog;

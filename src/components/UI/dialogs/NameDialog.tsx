import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface NameDialogProps {
  open: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
}

const NameDialog: React.FC<NameDialogProps> = ({
  open,
  name,
  onChange,
  onClose,
  onSave,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Редагувати назву</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Назва"
        fullWidth
        value={name}
        onChange={onChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Відмінити
      </Button>
      <Button onClick={onSave} color="primary">
        Зберегти
      </Button>
    </DialogActions>
  </Dialog>
);

export default NameDialog;

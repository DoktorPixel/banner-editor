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
    <DialogTitle>Edit title</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Name"
        fullWidth
        value={name}
        onChange={onChange}
        slotProps={{
          input: {
            sx: {
              height: 54,
              padding: "2px",
            },
          },
        }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
      <Button onClick={onSave} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

export default NameDialog;

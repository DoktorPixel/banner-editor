import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ClearHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
}

const ClearHistoryDialog: React.FC<ClearHistoryDialogProps> = ({
  open,
  onClose,
  onClear,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Очистити історію</DialogTitle>
    <DialogContent>
      Ви впевнені, що хочете очистити історію? Це видалить всі зміни.
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Ні
      </Button>
      <Button onClick={onClear} color="error">
        Так
      </Button>
    </DialogActions>
  </Dialog>
);

export default ClearHistoryDialog;

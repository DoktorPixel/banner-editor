import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

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
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("dialogs.nameDialog.title")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t("dialogs.nameDialog.placeholder") ?? "Name"}
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
          {t("cancel") ?? "Cancel"}
        </Button>
        <Button onClick={onSave} color="primary">
          {t("save") ?? "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NameDialog;

// react-arborist/GroupOnDropDialog.tsx
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreateAbstract: () => void;
  onCreateFlex: () => void;
};

export const GroupOnDropDialog: React.FC<Props> = ({
  open,
  onClose,
  onCreateAbstract,
  onCreateFlex,
}) => {
  const [choice, setChoice] = React.useState<"abstract" | "flex">("flex");

  React.useEffect(() => {
    if (!open) setChoice("flex");
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Создать группу?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Вы перетащили объект на другой. Хотите создать группу из них?
        </Typography>
        <RadioGroup
          value={choice}
          onChange={(e) => setChoice(e.target.value as "abstract" | "flex")}
        >
          <FormControlLabel
            value="abstract"
            control={<Radio />}
            label="Абстрактная группа (виртуальная обёртка)"
          />
          <FormControlLabel
            value="flex"
            control={<Radio />}
            label="Флекс-группа (реальный объект с display:flex)"
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        {choice === "abstract" ? (
          <Button variant="contained" onClick={onCreateAbstract}>
            Создать абстрактную
          </Button>
        ) : (
          <Button variant="contained" onClick={onCreateFlex}>
            Создать флекс
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

import { Box, TextField, Typography } from "@mui/material";
import { BannerChild } from "../../../types";

interface FigureChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const FigureChildObjectForm: React.FC<FigureChildObjectFormProps> = ({
  object,
  onChange,
}) => {
  return (
    <Box className="child-object-form">
      <Typography variant="h6">Редагування фігури</Typography>
      <TextField
        label="Ширина"
        type="number"
        name="width"
        value={object.width || ""}
        onChange={(e) => onChange("width", Number(e.target.value))}
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

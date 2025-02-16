import { Box, TextField, Typography } from "@mui/material";
import { BannerChild } from "../../../types";

interface ImageChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const ImageChildObjectForm: React.FC<ImageChildObjectFormProps> = ({
  object,
  onChange,
}) => {
  return (
    <Box className="child-object-form">
      <Typography variant="h6">Редагування зображення</Typography>
      <TextField
        label="URL зображення"
        name="src"
        value={object.src || ""}
        onChange={(e) => onChange("src", e.target.value)}
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

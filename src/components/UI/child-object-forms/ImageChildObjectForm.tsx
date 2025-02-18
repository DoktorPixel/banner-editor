import { useState } from "react";
import { BannerChild } from "../../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from "@mui/material";
import UpdateImageDialog from "../dialogs/UpdateImageDialog";

interface ImageChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const ImageChildObjectForm: React.FC<ImageChildObjectFormProps> = ({
  object,
  onChange,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUpdateUrl = (newUrl: string) => {
    onChange("src", newUrl);
  };

  const handleInputChange = (
    key: keyof BannerChild,
    value: string | number
  ) => {
    onChange(key, value);
  };
  return (
    <Box className="child-object-form">
      <Typography variant="h6" gutterBottom>
        Налаштування елементу групи
      </Typography>

      <TextField
        label="Ширина (px)"
        type="number"
        value={Math.round(object.width || 300)}
        onChange={(e) =>
          handleInputChange("width", Math.round(parseInt(e.target.value, 10)))
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Висота (px)"
        type="number"
        value={object.height || 300}
        onChange={(e) =>
          handleInputChange("height", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="URL зображення"
        name="src"
        value={object.src || ""}
        onChange={(e) => onChange("src", e.target.value)}
        fullWidth
        margin="normal"
      />

      <div className="update-image-wrapper">
        <TextField
          label="URL изображения"
          value={object.src || ""}
          onChange={(e) => handleInputChange("src", e.target.value)}
          fullWidth
          margin="normal"
          disabled
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleDialogOpen}
          fullWidth
          style={{
            padding: "2px 8px",
            fontSize: "11px",
            height: "32px",
            top: "3px",
            lineHeight: "1.2",
          }}
        >
          Оновити зображення
        </Button>
      </div>

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ top: "-7px" }}>
          Підгонка картинки (Object Fit)
        </InputLabel>
        <Select
          value={object.objectFit || "fill"}
          onChange={(e) => handleInputChange("objectFit", e.target.value)}
        >
          <MenuItem value="fill">Заповнити (fill)</MenuItem>
          <MenuItem value="contain">Вписати (contain)</MenuItem>
          <MenuItem value="cover">Накрити (cover)</MenuItem>
          <MenuItem value="none">Без змін (none)</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Поворот (градусів)"
        type="number"
        value={object.rotate || 0}
        onChange={(e) =>
          handleInputChange("rotate", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />

      <UpdateImageDialog
        open={isDialogOpen}
        initialUrl={object.src || ""}
        onClose={handleDialogClose}
        onUpdate={handleUpdateUrl}
      />
    </Box>
  );
};

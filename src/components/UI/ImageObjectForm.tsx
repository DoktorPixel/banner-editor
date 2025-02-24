import { useState } from "react";
import { BannerObject } from "../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import UpdateImageDialog from "./dialogs/UpdateImageDialog";
import { ConditionSelector } from "./ConditionSelector";

interface ImageObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number) => void;
}

export const ImageObjectForm: React.FC<ImageObjectFormProps> = ({
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
    key: keyof BannerObject,
    value: string | number
  ) => {
    onChange(key, value);
  };

  return (
    <>
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
        label="Координата X"
        type="number"
        value={object.x}
        onChange={(e) => handleInputChange("x", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Координата Y"
        type="number"
        value={object.y}
        onChange={(e) => handleInputChange("y", parseInt(e.target.value, 10))}
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
      <TextField
        label="Номер шару (z-Index)"
        type="number"
        value={object.zIndex || 0}
        onChange={(e) =>
          handleInputChange("zIndex", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />

      <ConditionSelector objectId={object.id} condition={object.condition} />

      <UpdateImageDialog
        open={isDialogOpen}
        initialUrl={object.src || ""}
        onClose={handleDialogClose}
        onUpdate={handleUpdateUrl}
      />
    </>
  );
};

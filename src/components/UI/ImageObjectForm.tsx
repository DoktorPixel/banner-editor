import { BannerObject } from "../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface ImageObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number) => void;
}

export const ImageObjectForm: React.FC<ImageObjectFormProps> = ({
  object,
  onChange,
}) => {
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
      <TextField
        label="URL изображения"
        value={object.src || ""}
        onChange={(e) => handleInputChange("src", e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Підгонка картинки (Object Fit)</InputLabel>
        <Select
          value={object.objectFit || "fill"}
          onChange={(e) => handleInputChange("objectFit", e.target.value)}
        >
          <MenuItem value="fill">Заповнити (fill)</MenuItem>
          <MenuItem value="contain">Вписати (contain)</MenuItem>
          <MenuItem value="cover">Накрити (cover)</MenuItem>
          <MenuItem value="none">Без змін (none)</MenuItem>
          <MenuItem value="scale-down">Зменшити (scale-down)</MenuItem>
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
    </>
  );
};

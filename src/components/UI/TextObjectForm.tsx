import { BannerObject } from "../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number) => void;
}

export const TextObjectForm: React.FC<TextObjectFormProps> = ({
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
        label="Текст"
        value={object.content || ""}
        onChange={(e) => handleInputChange("content", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Розмір шрифта"
        type="number"
        value={object.fontSize || 16}
        onChange={(e) =>
          handleInputChange("fontSize", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Колір"
        type="color"
        value={object.color || "#000000"}
        onChange={(e) => handleInputChange("color", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ширина (px)"
        type="number"
        value={object.width || 300}
        onChange={(e) =>
          handleInputChange("width", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Висота (px)"
        type="number"
        value={object.height || 50}
        onChange={(e) =>
          handleInputChange("height", parseInt(e.target.value, 10))
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
      <FormControl fullWidth margin="normal">
        <InputLabel>Товщина тексту</InputLabel>
        <Select
          value={object.fontWeight || "400"}
          onChange={(e) => handleInputChange("fontWeight", e.target.value)}
        >
          <MenuItem value="300">300</MenuItem>
          <MenuItem value="400">400</MenuItem>
          <MenuItem value="500">500</MenuItem>
          <MenuItem value="600">600</MenuItem>
          <MenuItem value="700">700</MenuItem>
          <MenuItem value="800">800</MenuItem>
          <MenuItem value="900">900</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Стиль тексту</InputLabel>
        <Select
          value={object.fontStyle || "normal"}
          onChange={(e) => handleInputChange("fontStyle", e.target.value)}
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="italic">Italic</MenuItem>
          <MenuItem value="oblique">Oblique</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Text Transform</InputLabel>
        <Select
          value={object.textTransform || "none"}
          onChange={(e) => handleInputChange("textTransform", e.target.value)}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="capitalize">Capitalize</MenuItem>
          <MenuItem value="uppercase">Uppercase</MenuItem>
          <MenuItem value="lowercase">Lowercase</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Text Decoration</InputLabel>
        <Select
          value={object.textDecoration || "none"}
          onChange={(e) => handleInputChange("textDecoration", e.target.value)}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="underline">Underline</MenuItem>
          <MenuItem value="overline">Overline</MenuItem>
          <MenuItem value="line-through">Line-Through</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Text Align</InputLabel>
        <Select
          value={object.textAlign || "left"}
          onChange={(e) => handleInputChange("textAlign", e.target.value)}
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="right">Right</MenuItem>
          <MenuItem value="justify">Justify</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Координата X"
        type="number"
        value={object.x || 0}
        onChange={(e) => handleInputChange("x", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Координата Y"
        type="number"
        value={object.y || 0}
        onChange={(e) => handleInputChange("y", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
    </>
  );
};

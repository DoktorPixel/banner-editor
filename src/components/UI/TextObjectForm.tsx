import { BannerObject } from "../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number | boolean) => void;
}

export const TextObjectForm: React.FC<TextObjectFormProps> = ({
  object,
  onChange,
}) => {
  const handleInputChange = (
    key: keyof BannerObject,
    value: string | number | boolean
  ) => {
    onChange(key, value);
  };

  return (
    <Box>
      <TextField
        label="Текст"
        value={object.content || ""}
        onChange={(e) => handleInputChange("content", e.target.value)}
        fullWidth
        margin="normal"
        multiline
        maxRows={5}
      />
      <TextField
        label="Розмір шрифту (px)"
        type="number"
        value={object.fontSize || 16}
        onChange={(e) =>
          handleInputChange("fontSize", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Колір тексту"
        type="color"
        value={object.color || "#000000"}
        onChange={(e) => handleInputChange("color", e.target.value)}
        fullWidth
        margin="normal"
      />
      {/* <TextField
        label="Ширина блоку (px)"
        type="number"
        value={object.width || 300}
        onChange={(e) =>
          handleInputChange("width", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      /> */}
      {!object.autoWidth && (
        <TextField
          label="Фіксована ширина (px)"
          type="number"
          value={Math.round(object.width || 300)}
          onChange={(e) =>
            handleInputChange("width", Math.round(parseInt(e.target.value, 10)))
          }
          fullWidth
          margin="normal"
        />
      )}
      <TextField
        label="Висота блоку (px)"
        type="number"
        value={object.height || 50}
        onChange={(e) =>
          handleInputChange("height", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />
      {/*  */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Ширина блоку</InputLabel>
        <Select
          value={object.autoWidth ? "auto" : "fixed"}
          onChange={(e) =>
            handleInputChange("autoWidth", e.target.value === "auto")
          }
        >
          <MenuItem value="auto">Автоматична (Auto)</MenuItem>
          <MenuItem value="fixed">Фіксована (Fixed)</MenuItem>
        </Select>
      </FormControl>

      {!object.autoWidth && (
        <TextField
          label="Максимальна кількість рядків"
          type="number"
          value={object.maxLines || ""}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            handleInputChange("maxLines", value >= 0 ? value : 0);
          }}
          fullWidth
          margin="normal"
        />
      )}

      {/*  */}
      <TextField
        label="Рівень шару (z-Index)"
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
          <MenuItem value="300">Дуже тонкий (300)</MenuItem>
          <MenuItem value="400">Нормальний (400)</MenuItem>
          <MenuItem value="500">Середній (500)</MenuItem>
          <MenuItem value="600">Товстий (600)</MenuItem>
          <MenuItem value="700">Жирний (700)</MenuItem>
          <MenuItem value="800">Дуже жирний (800)</MenuItem>
          <MenuItem value="900">Найжирніший (900)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Стиль тексту</InputLabel>
        <Select
          value={object.fontStyle || "normal"}
          onChange={(e) => handleInputChange("fontStyle", e.target.value)}
        >
          <MenuItem value="normal">Звичайний (Normal)</MenuItem>
          <MenuItem value="italic">Курсив (Italic)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Трансформація тексту</InputLabel>
        <Select
          value={object.textTransform || "none"}
          onChange={(e) => handleInputChange("textTransform", e.target.value)}
        >
          <MenuItem value="none">Без змін (None)</MenuItem>
          <MenuItem value="capitalize">Початкова велика (Capitalize)</MenuItem>
          <MenuItem value="uppercase">Великі літери (Uppercase)</MenuItem>
          <MenuItem value="lowercase">Малі літери (Lowercase)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Декорація тексту (Text Decoration)</InputLabel>
        <Select
          value={object.textDecoration || "none"}
          onChange={(e) => handleInputChange("textDecoration", e.target.value)}
        >
          <MenuItem value="none">Без декорації (None)</MenuItem>
          <MenuItem value="underline">Підкреслення (Underline)</MenuItem>
          <MenuItem value="overline">Над текстом (Overline)</MenuItem>
          <MenuItem value="line-through">Закреслення (Line-Through)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Вирівнювання тексту (Text Align)</InputLabel>
        <Select
          value={object.textAlign || "left"}
          onChange={(e) => handleInputChange("textAlign", e.target.value)}
        >
          <MenuItem value="left">По лівому краю (Left)</MenuItem>
          <MenuItem value="center">По центру (Center)</MenuItem>
          <MenuItem value="right">По правому краю (Right)</MenuItem>
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
    </Box>
  );
};

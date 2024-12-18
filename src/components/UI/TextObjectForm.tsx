import { BannerObject } from "../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import FontSelector from "./FontSelector";
import TextAlignSelector from "./button-groups/TextAlignSelector";
import TextDecorationSelector from "./button-groups/TextDecorationSelector";
import FontStyleSelector from "./button-groups/FontStyleSelector";
import { MuiColorInput } from "mui-color-input";

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
      <TextField
        label="Текст"
        value={object.content || ""}
        onChange={(e) => handleInputChange("content", e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        // maxRows={5}
      />
      <FontSelector
        value={object.fontFamily || "Poppins"}
        onChange={(font) => handleInputChange("fontFamily", font)}
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
      <MuiColorInput
        label="Колір тексту"
        format="hex"
        value={object.color || "#000000"}
        onChange={(newColor: string) => handleInputChange("color", newColor)}
        fullWidth
        sx={{ margin: "16px 0 10px 0" }}
      />

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

      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Стиль тексту</InputLabel>
        <Select
          value={object.fontStyle || "normal"}
          onChange={(e) => handleInputChange("fontStyle", e.target.value)}
        >
          <MenuItem value="normal">Звичайний (Normal)</MenuItem>
          <MenuItem value="italic">Курсив (Italic)</MenuItem>
        </Select>
      </FormControl> */}
      <FontStyleSelector
        value={object.fontStyle || "normal"}
        onChange={(value) => handleInputChange("fontStyle", value)}
      />
      {/* <FormControl fullWidth margin="normal">
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
      </FormControl> */}
      <TextDecorationSelector
        value={(object.textDecoration || "none").toString()}
        onChange={(value) => handleInputChange("textDecoration", value)}
      />

      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Вирівнювання тексту (Text Align)</InputLabel>
        <Select
          value={object.textAlign || "left"}
          onChange={(e) => handleInputChange("textAlign", e.target.value)}
        >
          <MenuItem value="left">По лівому краю (Left)</MenuItem>
          <MenuItem value="center">По центру (Center)</MenuItem>
          <MenuItem value="right">По правому краю (Right)</MenuItem>
        </Select>
      </FormControl> */}
      <TextAlignSelector
        value={object.textAlign || "left"}
        onChange={(value) => handleInputChange("textAlign", value)}
      />
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
        label="Рівень шару (z-Index)"
        type="number"
        value={object.zIndex || 0}
        onChange={(e) =>
          handleInputChange("zIndex", parseInt(e.target.value, 10))
        }
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

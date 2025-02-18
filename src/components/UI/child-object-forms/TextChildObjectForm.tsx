import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { BannerChild } from "../../../types";
import ChildFontSelector from "../ChildFontSelector";
import TextDecorationSelector from "../button-groups/TextDecorationSelector";
import FontStyleSelector from "../button-groups/FontStyleSelector";

interface TextChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const TextChildObjectForm: React.FC<TextChildObjectFormProps> = ({
  object,
  onChange,
}) => {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const parsedValue = isNaN(Number(value)) ? value : Number(value);
    onChange(name as keyof BannerChild, parsedValue);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name) {
      onChange(name as keyof BannerChild, value);
    }
  };

  return (
    <Box className="child-object-form">
      <Typography variant="h6" gutterBottom>
        Налаштування елементу групи
      </Typography>

      <TextField
        label="Текст"
        name="content"
        value={object.content || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        multiline
        maxRows={5}
      />
      <ChildFontSelector
        value={object.fontFamily || "Poppins"}
        onChange={(font) => onChange("fontFamily", font)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ top: "-7px" }}>Товщина тексту</InputLabel>
        <Select
          name="fontWeight"
          value={String(object.fontWeight || "400")}
          onChange={handleSelectChange}
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
        name="fontSize"
        value={object.fontSize || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <MuiColorInput
        label="Колір тексту"
        format="hex"
        value={object.color || "#000000"}
        onChange={(newColor: string) => onChange("color", newColor)}
        fullWidth
        sx={{ margin: "16px 0 10px 0" }}
      />

      <FontStyleSelector
        value={object.fontStyle || "normal"}
        onChange={(value) => onChange("fontStyle", value)}
      />

      <TextDecorationSelector
        value={String(object.textDecoration || "none")}
        onChange={(value) => onChange("textDecoration", value)}
      />

      <TextField
        label="Поворот (градусів)"
        type="number"
        name="rotate"
        value={object.rotate || 0}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

export default TextChildObjectForm;

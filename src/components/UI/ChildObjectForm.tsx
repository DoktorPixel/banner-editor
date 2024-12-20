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
import { BannerChild } from "../../types";
import ChildFontSelector from "./ChildFontSelector";
import TextDecorationSelector from "./button-groups/TextDecorationSelector";
import FontStyleSelector from "./button-groups/FontStyleSelector";

interface ChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const ChildObjectForm: React.FC<ChildObjectFormProps> = ({
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
        Редагування елементу групи
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
        <InputLabel>Товщина тексту</InputLabel>
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
      {/* 
      <FormControl fullWidth margin="normal">
        <InputLabel>Трансформація тексту</InputLabel>
        <Select
          name="textTransform"
          value={String(object.textTransform || "none")}
          onChange={handleSelectChange}
        >
          <MenuItem value="none">Без змін (None)</MenuItem>
          <MenuItem value="capitalize">Початкова велика (Capitalize)</MenuItem>
          <MenuItem value="uppercase">Великі літери (Uppercase)</MenuItem>
          <MenuItem value="lowercase">Малі літери (Lowercase)</MenuItem>
        </Select>
      </FormControl> */}
      {/* <TextField
        label="Ширина блоку (px)"
        name="width"
        type="number"
        value={Math.round(object.width || 300)}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Висота блоку (px)"
        name="height"
        type="number"
        value={object.height || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      /> */}
      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Вирівнювання тексту (Text Align)</InputLabel>
        <Select
          value={object.textAlign || "left"}
          onChange={handleSelectChange}
        >
          <MenuItem value="left">По лівому краю (Left)</MenuItem>
          <MenuItem value="center">По центру (Center)</MenuItem>
          <MenuItem value="right">По правому краю (Right)</MenuItem>
        </Select>
      </FormControl> */}
    </Box>
  );
};

export default ChildObjectForm;

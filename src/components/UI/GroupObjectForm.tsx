import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { BannerObject } from "../../types";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number) => void;
}

export const GroupObjectForm: React.FC<TextObjectFormProps> = ({
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
    <Box>
      <Typography variant="h6">Налаштування групи</Typography>
      <TextField
        label="Ширина блоку (px)"
        type="number"
        value={Math.round(object.width || 300)}
        onChange={(e) =>
          handleInputChange("width", Math.round(parseInt(e.target.value, 10)))
        }
        fullWidth
        margin="normal"
      />
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
      <FormControl fullWidth margin="normal">
        <InputLabel>Тип відображення (Display)</InputLabel>
        <Select
          value={object.display || "flex"}
          onChange={(e) => handleInputChange("display", e.target.value)}
        >
          <MenuItem value="flex">Гнучкий (flex)</MenuItem>
          <MenuItem value="block">Блоковий (block)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Напрямок елементів (flexDirection)</InputLabel>
        <Select
          value={object.flexDirection || "row"}
          onChange={(e) => handleInputChange("flexDirection", e.target.value)}
        >
          <MenuItem value="row">По рядках (row)</MenuItem>
          <MenuItem value="column">По колонках (column)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Вирівнювання по горизонталі (justifyContent)</InputLabel>
        <Select
          value={object.justifyContent || "center"}
          onChange={(e) => handleInputChange("justifyContent", e.target.value)}
        >
          <MenuItem value="start">З початку (start)</MenuItem>
          <MenuItem value="center">По центру (center)</MenuItem>
          <MenuItem value="end">В кінці (end)</MenuItem>
          <MenuItem value="space-between">
            Між елементами (space-between)
          </MenuItem>
          <MenuItem value="space-around">
            Рівномірно навколо (space-around)
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Вирівнювання по вертикалі (alignItems)</InputLabel>
        <Select
          value={object.alignItems || "center"}
          onChange={(e) => handleInputChange("alignItems", e.target.value)}
        >
          <MenuItem value="flex-start">Спочатку (flex-start)</MenuItem>
          <MenuItem value="center">По центру (center)</MenuItem>
          <MenuItem value="flex-end">Вкінці (flex-end)</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Відступ між елементами (gap, px)"
        type="number"
        value={object.gap || 10}
        onChange={(e) => handleInputChange("gap", parseInt(e.target.value))}
        fullWidth
        margin="normal"
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
        label="Номер шару (z-Index)"
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

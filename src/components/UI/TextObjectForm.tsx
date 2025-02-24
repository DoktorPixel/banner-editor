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
// import { useObjectCondition } from "../../utils/hooks";
import { ConditionSelector } from "./ConditionSelector";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number | boolean) => void;
}

export const TextObjectForm: React.FC<TextObjectFormProps> = ({
  object,
  onChange,
}) => {
  // const { updateCondition } = useObjectCondition();

  // const handleConditionChange = (
  //   newType?: "showIf" | "hideIf",
  //   newProps?: string[]
  // ) => {
  //   const updatedCondition = {
  //     type: newType ?? object.condition?.type ?? "hideIf",
  //     props: newProps?.length ? newProps : object.condition?.props ?? [""],
  //   };
  //   updateCondition(object.id, updatedCondition);
  // };

  return (
    <Box>
      {!object.autoWidth && (
        <TextField
          label="Фіксована ширина (px)"
          type="number"
          value={Math.round(object.width || 300)}
          onChange={(e) =>
            onChange("width", Math.round(parseInt(e.target.value, 10)))
          }
          fullWidth
          margin="normal"
        />
      )}
      <TextField
        label="Висота блоку (px)"
        type="number"
        value={object.height || 50}
        onChange={(e) => onChange("height", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Координата X"
        type="number"
        value={object.x || 0}
        onChange={(e) => onChange("x", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Координата Y"
        type="number"
        value={object.y || 0}
        onChange={(e) => onChange("y", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Текст"
        value={object.content || ""}
        onChange={(e) => onChange("content", e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        // maxRows={5}
      />
      <FontSelector
        value={object.fontFamily || "Poppins"}
        onChange={(font) => onChange("fontFamily", font)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ top: "-7px" }}>Товщина тексту</InputLabel>
        <Select
          value={object.fontWeight || "400"}
          onChange={(e) => onChange("fontWeight", e.target.value)}
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
        onChange={(e) => onChange("fontSize", parseInt(e.target.value, 10))}
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

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ top: "-7px" }}>Ширина блоку</InputLabel>
        <Select
          value={object.autoWidth ? "auto" : "fixed"}
          onChange={(e) => onChange("autoWidth", e.target.value === "auto")}
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
            onChange("maxLines", value >= 0 ? value : 0);
          }}
          fullWidth
          margin="normal"
        />
      )}

      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Стиль тексту</InputLabel>
        <Select
          value={object.fontStyle || "normal"}
          onChange={(e) => onChange("fontStyle", e.target.value)}
        >
          <MenuItem value="normal">Звичайний (Normal)</MenuItem>
          <MenuItem value="italic">Курсив (Italic)</MenuItem>
        </Select>
      </FormControl> */}
      <FontStyleSelector
        value={object.fontStyle || "normal"}
        onChange={(value) => onChange("fontStyle", value)}
      />
      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Декорація тексту (Text Decoration)</InputLabel>
        <Select
          value={object.textDecoration || "none"}
          onChange={(e) => onChange("textDecoration", e.target.value)}
        >
          <MenuItem value="none">Без декорації (None)</MenuItem>
          <MenuItem value="underline">Підкреслення (Underline)</MenuItem>
          <MenuItem value="overline">Над текстом (Overline)</MenuItem>
          <MenuItem value="line-through">Закреслення (Line-Through)</MenuItem>
        </Select>
      </FormControl> */}
      <TextDecorationSelector
        value={(object.textDecoration || "none").toString()}
        onChange={(value) => onChange("textDecoration", value)}
      />

      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Вирівнювання тексту (Text Align)</InputLabel>
        <Select
          value={object.textAlign || "left"}
          onChange={(e) => onChange("textAlign", e.target.value)}
        >
          <MenuItem value="left">По лівому краю (Left)</MenuItem>
          <MenuItem value="center">По центру (Center)</MenuItem>
          <MenuItem value="right">По правому краю (Right)</MenuItem>
        </Select>
      </FormControl> */}
      <TextAlignSelector
        value={object.textAlign || "left"}
        onChange={(value) => onChange("textAlign", value)}
      />
      <TextField
        label="Поворот (градусів)"
        type="number"
        value={object.rotate || 0}
        onChange={(e) => onChange("rotate", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Рівень шару (z-Index)"
        type="number"
        value={object.zIndex || 0}
        onChange={(e) => onChange("zIndex", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />

      {/* <Box>
        <FormControl fullWidth margin="normal">
          <InputLabel>Умова відображення</InputLabel>
          <Select
            value={object.condition?.type || "hideIf"}
            onChange={(e) =>
              handleConditionChange(e.target.value as "showIf" | "hideIf")
            }
          >
            <MenuItem value="showIf">Показати якщо є</MenuItem>
            <MenuItem value="hideIf">Приховати якщо є</MenuItem>0
          </Select>
        </FormControl>

        <TextField
          label="Параметри умови (props через кому)"
          value={object.condition?.props?.join(", ") || ""}
          onChange={(e) => {
            const newProps = e.target.value.split(",").map((p) => p.trim());
            handleConditionChange(undefined, newProps);
          }}
          fullWidth
          margin="normal"
        />
      </Box> */}
      <ConditionSelector objectId={object.id} condition={object.condition} />
    </Box>
  );
};

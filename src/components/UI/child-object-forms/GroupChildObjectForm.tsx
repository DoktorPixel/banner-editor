import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  ButtonGroup,
} from "@mui/material";
import { BannerChild } from "../../../types";
import { MuiColorInput } from "mui-color-input";
import { ChildConditionSelector } from "../ChildConditionSelector";
import { AutoSizeInput } from "../AutoSizeInput";
import { FlexDirectionSelector } from "../FlexDirectionSelector";
import { AutoGapInputChild } from "../AutoGapInputChild";
import {
  BorderBottom,
  BorderLeft,
  BorderRight,
  BorderTop,
} from "../../../assets/icons";

interface GroupChildObjectFormProps {
  object: BannerChild;
  onChange: (
    key: keyof BannerChild,
    value: string | number | undefined
  ) => void;
  onChangeMultiple: (updates: Partial<BannerChild>) => void;
}

export const GroupChildObjectForm: React.FC<GroupChildObjectFormProps> = ({
  object,
  onChange,
  onChangeMultiple,
}) => {
  const [isBorderEditing, setIsBorderEditing] = useState<boolean>(false);
  const [borderSides, setBorderSides] = useState({
    top: true,
    bottom: true,
    left: true,
    right: true,
  });

  const toggleBorderSide = (side: "top" | "bottom" | "left" | "right") => {
    const isActive = borderSides[side];

    setBorderSides((prev) => ({
      ...prev,
      [side]: !isActive,
    }));

    if (isActive) {
      onChangeMultiple({
        [`border${capitalize(side)}Style`]: undefined,
        [`border${capitalize(side)}Color`]: undefined,
        [`border${capitalize(side)}Width`]: undefined,
      });
    } else {
      onChangeMultiple({
        [`border${capitalize(side)}Style`]: "solid",
        [`border${capitalize(side)}Color`]: "#000000",
        [`border${capitalize(side)}Width`]: 1,
      });
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleBorderToggle = (isEditing: boolean) => {
    setIsBorderEditing(isEditing);
    if (!isEditing) {
      onChangeMultiple({
        borderTopStyle: undefined,
        borderTopColor: undefined,
        borderTopWidth: undefined,
        borderBottomStyle: undefined,
        borderBottomColor: undefined,
        borderBottomWidth: undefined,
        borderLeftStyle: undefined,
        borderLeftColor: undefined,
        borderLeftWidth: undefined,
        borderRightStyle: undefined,
        borderRightColor: undefined,
        borderRightWidth: undefined,
      });
    }
  };

  const handleAddBorder = () => {
    handleBorderToggle(true);
    onChangeMultiple({
      borderTopStyle: "solid",
      borderTopColor: "#000000",
      borderTopWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: "#000000",
      borderBottomWidth: 1,
      borderLeftStyle: "solid",
      borderLeftColor: "#000000",
      borderLeftWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: "#000000",
      borderRightWidth: 1,
    });
  };

  const handleBorderChange = (
    property: string,
    value: string | number | undefined
  ) => {
    onChangeMultiple({
      [`borderTop${property}`]: value,
      [`borderBottom${property}`]: value,
      [`borderLeft${property}`]: value,
      [`borderRight${property}`]: value,
    });
  };

  useEffect(() => {
    const hasBorder =
      object.borderTopStyle ||
      object.borderTopColor ||
      object.borderTopWidth ||
      object.borderBottomStyle ||
      object.borderBottomColor ||
      object.borderBottomWidth ||
      object.borderLeftStyle ||
      object.borderLeftColor ||
      object.borderLeftWidth ||
      object.borderRightStyle ||
      object.borderRightColor ||
      object.borderRightWidth;

    setIsBorderEditing(!!hasBorder);
  }, [object]);

  useEffect(() => {
    setBorderSides({
      top: !!object.borderTopStyle,
      bottom: !!object.borderBottomStyle,
      left: !!object.borderLeftStyle,
      right: !!object.borderRightStyle,
    });
  }, [object]);

  return (
    <Box className="child-object-form">
      <Typography variant="h6" gutterBottom>
        Налаштування елементу групи
      </Typography>

      <AutoSizeInput
        label="Ширина блоку (px)"
        value={object.width || 300}
        onChange={(value) => onChange("width", value)}
      />

      <AutoSizeInput
        label="Висота блоку (px)"
        value={object.height || 50}
        onChange={(value) => onChange("height", value)}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ top: "-7px" }}>Тип відображення (Display)</InputLabel>
        <Select
          value={object.display || "flex"}
          onChange={(e) => onChange("display", e.target.value)}
        >
          <MenuItem value="flex">Гнучкий (flex)</MenuItem>
          <MenuItem value="block">Блоковий (block)</MenuItem>
        </Select>
      </FormControl>

      {object.display !== "block" && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ top: "-7px" }}>
              Напрямок елементів (flexDirection)
            </InputLabel>
            <Select
              value={object.flexDirection || "row"}
              onChange={(e) => onChange("flexDirection", e.target.value)}
            >
              <MenuItem value="row">По рядках (row)</MenuItem>
              <MenuItem value="column">По колонках (column)</MenuItem>
              <MenuItem value="row-reverse">
                По рядках зворотом (row-reverse)
              </MenuItem>
              <MenuItem value="column-reverse">
                По колонках зворотом (column-reverse)
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ top: "-7px" }}>
              Вирівнювання по горизонталі (justifyContent)
            </InputLabel>
            <Select
              value={object.justifyContent || "center"}
              onChange={(e) => onChange("justifyContent", e.target.value)}
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
            <InputLabel sx={{ top: "-7px" }}>
              Вирівнювання по вертикалі (alignItems)
            </InputLabel>
            <Select
              value={object.alignItems || "center"}
              onChange={(e) => onChange("alignItems", e.target.value)}
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
            onChange={(e) => onChange("gap", parseInt(e.target.value))}
            fullWidth
            margin="normal"
          />
        </>
      )}

      {/* фігура */}
      <MuiColorInput
        label="Колір фону"
        format="hex"
        value={object.backgroundColor || "none"}
        onChange={(newColor: string) => onChange("backgroundColor", newColor)}
        fullWidth
        sx={{ margin: "16px 0 10px 0" }}
      />
      <TextField
        label="Прозорість (opacity, від 0 до 1)"
        type="number"
        inputProps={{
          step: 0.1,
          min: 0,
          max: 1,
        }}
        value={object.opacity || 1}
        onChange={(e) => onChange("opacity", parseFloat(e.target.value))}
        fullWidth
        margin="normal"
      />

      <TextField
        label="заокруглення (border-radius)"
        type="number"
        value={object.borderRadius || 0}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          onChange("borderRadius", value >= 0 ? value : 0);
        }}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Поворот (градусів)"
        type="number"
        value={object.rotate || 0}
        onChange={(e) => onChange("rotate", parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />

      {!isBorderEditing ? (
        <Button variant="outlined" onClick={handleAddBorder}>
          + Додати бордер
        </Button>
      ) : (
        <Box className="border-editor">
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleBorderToggle(false)}
            style={{ marginBottom: "10px" }}
          >
            Видалити бордер
          </Button>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="body2">
                Стиль рамки (border-style)
              </Typography>
              <Select
                value={object.borderTopStyle || "solid"}
                onChange={(e) => handleBorderChange("Style", e.target.value)}
                fullWidth
              >
                <MenuItem value="solid">Суцільна (Solid)</MenuItem>
                <MenuItem value="dotted">Крапками (Dotted)</MenuItem>
                <MenuItem value="dashed">Штрихова (Dashed)</MenuItem>
                <MenuItem value="double">Подвійна (Double)</MenuItem>
              </Select>
            </Box>

            <MuiColorInput
              label="Колір рамки (border-color)"
              format="hex"
              value={object.borderTopColor || "#000000"}
              onChange={(newColor: string) =>
                handleBorderChange("Color", newColor)
              }
              fullWidth
              sx={{ margin: "16px 0 10px 0" }}
            />

            <Box>
              <TextField
                label="Ширина рамки (border-width, px)"
                type="number"
                value={object.borderTopWidth || 1}
                onChange={(e) =>
                  handleBorderChange(
                    "Width",
                    parseInt(e.target.value, 10) || undefined
                  )
                }
                fullWidth
              />
            </Box>

            <div className="border-selectors">
              <ButtonGroup>
                <Button
                  variant={borderSides.top ? "contained" : "outlined"}
                  onClick={() => toggleBorderSide("top")}
                  sx={{ padding: "4px 10px" }}
                >
                  <BorderTop width="24px" height="24px" />
                </Button>
                <Button
                  variant={borderSides.bottom ? "contained" : "outlined"}
                  onClick={() => toggleBorderSide("bottom")}
                  sx={{ padding: "4px 10px" }}
                >
                  <BorderBottom width="24px" height="24px" />
                </Button>
              </ButtonGroup>

              <ButtonGroup>
                <Button
                  variant={borderSides.left ? "contained" : "outlined"}
                  onClick={() => toggleBorderSide("left")}
                  sx={{ padding: "4px 10px" }}
                >
                  <BorderLeft width="24px" height="24px" />
                </Button>
                <Button
                  variant={borderSides.right ? "contained" : "outlined"}
                  onClick={() => toggleBorderSide("right")}
                  sx={{ padding: "4px 10px" }}
                >
                  <BorderRight width="24px" height="24px" />
                </Button>
              </ButtonGroup>
            </div>
          </Box>
        </Box>
      )}
      <ChildConditionSelector
        childId={object.id}
        condition={object.condition}
      />

      <div>
        <InputLabel sx={{ marginTop: "10px", marginBottom: "10px" }}>
          Відступи (padding):
        </InputLabel>
        <div style={{ display: "flex", gap: "7px" }}>
          <TextField
            label="Left"
            type="number"
            value={object.paddingLeft}
            onChange={(e) =>
              onChange("paddingLeft", Math.max(0, parseFloat(e.target.value)))
            }
            fullWidth
          />
          <TextField
            label="Right"
            type="number"
            value={object.paddingRight}
            onChange={(e) =>
              onChange("paddingRight", Math.max(0, parseFloat(e.target.value)))
            }
            fullWidth
          />
          <TextField
            label="Top"
            type="number"
            value={object.paddingTop}
            onChange={(e) =>
              onChange("paddingTop", Math.max(0, parseFloat(e.target.value)))
            }
            fullWidth
          />
          <TextField
            label="Bottom"
            type="number"
            value={object.paddingBottom}
            onChange={(e) =>
              onChange("paddingBottom", Math.max(0, parseFloat(e.target.value)))
            }
            fullWidth
          />
        </div>
      </div>

      <Typography sx={{ mb: -1, mt: 1, fontSize: "14px" }}>
        Direction + Gap
      </Typography>
      <div
        className="auto-size flex-direction-wrapper"
        style={{ marginBottom: "10px" }}
      >
        <FlexDirectionSelector
          value={
            (object.flexDirection as
              | "row"
              | "column"
              | "row-reverse"
              | "column-reverse") || "row"
          }
          onChange={(value) => onChange("flexDirection", value)}
        />
        <AutoGapInputChild
          value={object.gap}
          onChangeMultiple={onChangeMultiple}
        />
      </div>
    </Box>
  );
};

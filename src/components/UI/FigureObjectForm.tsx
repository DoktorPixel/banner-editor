import { BannerObject } from "../../types";
import {
  TextField,
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  ButtonGroup,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useObjectProperties } from "../../utils/hooks";
import {
  BorderBottom,
  BorderLeft,
  BorderRight,
  BorderTop,
} from "../../assets/icons";

interface FigureObjectFormProps {
  object: BannerObject;
  onChange: (
    key: keyof BannerObject,
    value: string | number | undefined
  ) => void;
}

export const FigureObjectForm: React.FC<FigureObjectFormProps> = ({
  object,
  onChange,
}) => {
  const [isBorderEditing, setIsBorderEditing] = useState<boolean>(false);
  const { updateObjectMultipleProperties } = useObjectProperties();

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
      updateObjectMultipleProperties(object.id, {
        [`border${capitalize(side)}Style`]: undefined,
        [`border${capitalize(side)}Color`]: undefined,
        [`border${capitalize(side)}Width`]: undefined,
      });
    } else {
      updateObjectMultipleProperties(object.id, {
        [`border${capitalize(side)}Style`]: "solid",
        [`border${capitalize(side)}Color`]: "#000000",
        [`border${capitalize(side)}Width`]: 1,
      });
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleInputChange = (
    key: keyof BannerObject,
    value: string | number | undefined
  ) => {
    onChange(key, value);
  };

  const handleBorderToggle = (isEditing: boolean) => {
    setIsBorderEditing(isEditing);
    if (!isEditing) {
      updateObjectMultipleProperties(object.id, {
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
    updateObjectMultipleProperties(object.id, {
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
    updateObjectMultipleProperties(object.id, {
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
    <Box>
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
      <TextField
        label="Колір фону"
        type="color"
        value={object.backgroundColor || "#FFFFFF"}
        onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
        fullWidth
        margin="normal"
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
        onChange={(e) =>
          handleInputChange("opacity", parseFloat(e.target.value))
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
        label="заокруглення (border-radius)"
        type="number"
        value={object.borderRadius || 0}
        onChange={(e) =>
          handleInputChange("borderRadius", parseInt(e.target.value, 10))
        }
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
                <MenuItem value="solid">Solid</MenuItem>
                <MenuItem value="dotted">Dotted</MenuItem>
                <MenuItem value="dashed">Dashed</MenuItem>
                <MenuItem value="double">Double</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </Box>
            <Box>
              <Typography variant="body2">
                Колір рамки (border-color)
              </Typography>
              <TextField
                type="color"
                value={object.borderTopColor || "#000000"}
                onChange={(e) => handleBorderChange("Color", e.target.value)}
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="body2">
                Ширина рамки (border-width, px)
              </Typography>
              <TextField
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

      <TextField
        label="Рівень шару (z-Index)"
        type="number"
        value={object.zIndex || 0}
        onChange={(e) =>
          handleInputChange("zIndex", parseInt(e.target.value, 10))
        }
        fullWidth
        style={{ marginTop: "20px" }}
      />
    </Box>
  );
};

import { BannerObject } from "../../types";
import {
  TextField,
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useObjectProperties } from "../../utils/hooks";

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

  useEffect(() => {
    const hasBorder =
      object.borderStyle || object.borderColor || object.borderWidth;
    setIsBorderEditing(!!hasBorder);
  }, [object]);

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
        borderStyle: undefined,
        borderColor: undefined,
        borderWidth: undefined,
      });
    }
  };

  const handleAddBorder = () => {
    handleBorderToggle(true);
    updateObjectMultipleProperties(object.id, {
      borderStyle: "solid",
      borderColor: "#000000",
      borderWidth: 1,
    });
  };

  const handleRemoveBorder = () => {
    handleBorderToggle(false);
    updateObjectMultipleProperties(object.id, {
      borderStyle: undefined,
      borderColor: undefined,
      borderWidth: undefined,
    });
  };

  return (
    <Box>
      <TextField
        label="Ширина блоку (px)"
        type="number"
        value={object.width || 300}
        onChange={(e) =>
          handleInputChange("width", parseInt(e.target.value, 10))
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
        label="Рівень шару (z-Index)"
        type="number"
        value={object.zIndex || 0}
        onChange={(e) =>
          handleInputChange("zIndex", parseInt(e.target.value, 10))
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
        <Box>
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveBorder}
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
                value={object.borderStyle || "solid"}
                onChange={(e) =>
                  handleInputChange("borderStyle", e.target.value)
                }
                fullWidth
              >
                <MenuItem value="solid">Solid</MenuItem>
                <MenuItem value="dotted">Dotted</MenuItem>
                <MenuItem value="dashed">Dashed</MenuItem>
                <MenuItem value="double">Double</MenuItem>
              </Select>
            </Box>
            <Box>
              <Typography variant="body2">
                Колір рамки (border-color)
              </Typography>
              <TextField
                type="color"
                value={object.borderColor || "#000000"}
                onChange={(e) =>
                  handleInputChange("borderColor", e.target.value)
                }
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="body2">
                Ширина рамки (border-width, px)
              </Typography>
              <TextField
                type="number"
                value={object.borderWidth || 0}
                onChange={(e) =>
                  handleInputChange(
                    "borderWidth",
                    parseInt(e.target.value, 10) || undefined
                  )
                }
                fullWidth
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

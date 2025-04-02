import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  ButtonGroup,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { PlusIcon, MinusIcon } from "../../../assets/icons";
import { BannerObject } from "../../../types";
import { MuiColorInput } from "mui-color-input";
import { useObjectProperties } from "../../../utils/hooks";
import { ConditionSelector } from "../ConditionSelector";
// import { FlexDirectionSelector } from "../FlexDirectionSelector";
// import { AutoGapInput } from "../AutoGapInput";
import {
  BorderBottom,
  BorderLeft,
  BorderRight,
  BorderTop,
  ArrowRight1,
  ArrowDown1,
  PaddingLeft,
  PaddingRight,
  PaddingTop,
  PaddingBottom,
} from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import { ActionToggleMultiple } from "../button-groups/ActionToggleMultiple";
import { AutoLayoutForm } from "../button-groups/AutoLayoutForm";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (
    key: keyof BannerObject,
    value: string | number | undefined | "auto" | boolean
  ) => void;
}

export const GroupObjectForm: React.FC<TextObjectFormProps> = ({
  object,
  onChange,
}) => {
  const [isBorderEditing, setIsBorderEditing] = useState<boolean>(false);
  const { updateObjectMultipleProperties, selectedObject } =
    useObjectProperties();

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
      <Typography
        variant="subtitle1"
        className="padding-wrapper"
        sx={{ mb: 2 }}
      >
        Layout
      </Typography>
      <div className="grey-line"></div>

      <ConditionSelector objectId={object.id} condition={object.condition} />
      <div className="grey-line"></div>

      <div className="padding-wrapper">
        <Typography variant="subtitle2">General</Typography>
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          Position
        </InputLabel>
        <div className="auto-size">
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">X</InputAdornment>
                ),
              },
            }}
            type="number"
            value={object.y || 0}
            onChange={(e) => onChange("y", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />

          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Y</InputAdornment>
                ),
              },
            }}
            type="number"
            value={object.y || 0}
            onChange={(e) => onChange("y", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />
        </div>
      </div>

      <div className="grey-line"></div>

      <div className="padding-wrapper">
        <Typography variant="subtitle2">Layout</Typography>
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>Size</InputLabel>
        <div className="auto-size">
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">W</InputAdornment>
                ),
              },
            }}
            type="number"
            value={Math.round(object.width || 300)}
            onChange={(e) =>
              onChange("width", Math.round(parseInt(e.target.value, 10)))
            }
            fullWidth
            disabled={object.autoWidth}
            margin="normal"
          />

          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">H</InputAdornment>
                ),
              },
            }}
            type="number"
            value={Math.round(object.height || 50)}
            onChange={(e) => onChange("height", parseInt(e.target.value, 10))}
            fullWidth
            disabled={object.autoHeight}
            margin="normal"
          />
        </div>

        <div style={{ maxWidth: "196px" }}>
          <ActionToggle
            label="Resizing"
            options={[
              { value: "auto", label: "Dynamic W" },
              { value: "fixed", label: "Fixed W" },
            ]}
            selected={object.autoWidth ? "auto" : "fixed"}
            onChange={(value) => onChange("autoWidth", value === "auto")}
          />
        </div>

        <div style={{ maxWidth: "196px" }}>
          <ActionToggle
            options={[
              { value: "auto", label: "Dynamic H" },
              { value: "fixed", label: "Fixed H" },
            ]}
            selected={object.autoHeight ? "auto" : "fixed"}
            onChange={(value) => onChange("autoHeight", value === "auto")}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div style={{ maxWidth: "90px" }}>
            <ActionToggle
              label="Direction"
              options={[
                { value: "row", label: <ArrowRight1 /> },
                { value: "column", label: <ArrowDown1 /> },
              ]}
              selected={object.flexDirection as "row" | "column"}
              onChange={(value) => onChange("flexDirection", value)}
            />
          </div>
          <div>
            <div style={{ maxWidth: "196px" }}>
              <ActionToggleMultiple
                objectId={object.id}
                value={object.gap}
                updateObjectMultipleProperties={updateObjectMultipleProperties}
              />
            </div>
          </div>
        </div>
        <InputLabel sx={{ mt: 1, mb: "2px", fontSize: "12px" }}>
          Alignment
        </InputLabel>

        <AutoLayoutForm
          flexDirection={
            (selectedObject?.flexDirection as "row" | "column") || "row"
          }
          justifyContent={
            (selectedObject?.justifyContent as
              | "start"
              | "center"
              | "end"
              | "space-between") || "center"
          }
          alignItems={
            (selectedObject?.alignItems as
              | "flex-start"
              | "center"
              | "flex-end") || "center"
          }
          onChange={(changes) =>
            selectedObject &&
            updateObjectMultipleProperties(selectedObject.id, changes)
          }
        />

        <div>
          <InputLabel sx={{ mt: 1, mb: "2px", fontSize: "12px" }}>
            Padding
          </InputLabel>

          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "7px",
                maxWidth: "250px",
              }}
            >
              <TextField
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaddingLeft />
                      </InputAdornment>
                    ),
                  },
                }}
                type="number"
                value={object.paddingLeft || 0}
                onChange={(e) =>
                  onChange(
                    "paddingLeft",
                    Math.max(0, parseFloat(e.target.value))
                  )
                }
                fullWidth
              />
              <TextField
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaddingRight />
                      </InputAdornment>
                    ),
                  },
                }}
                type="number"
                value={object.paddingRight || 0}
                onChange={(e) =>
                  onChange(
                    "paddingRight",
                    Math.max(0, parseFloat(e.target.value))
                  )
                }
                fullWidth
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "7px",
                maxWidth: "250px",
              }}
            >
              <TextField
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {" "}
                        <PaddingTop />
                      </InputAdornment>
                    ),
                  },
                }}
                type="number"
                value={object.paddingTop || 0}
                onChange={(e) =>
                  onChange(
                    "paddingTop",
                    Math.max(0, parseFloat(e.target.value))
                  )
                }
                fullWidth
              />
              <TextField
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {" "}
                        <PaddingBottom />
                      </InputAdornment>
                    ),
                  },
                }}
                type="number"
                value={object.paddingBottom || 0}
                onChange={(e) =>
                  onChange(
                    "paddingBottom",
                    Math.max(0, parseFloat(e.target.value))
                  )
                }
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grey-line"></div>

      {/* <div className="padding-wrapper">
        <MuiColorInput
          label="Color"
          format="hex"
          value={object.backgroundColor || "none"}
          onChange={(newColor: string) => onChange("backgroundColor", newColor)}
          fullWidth
          sx={{ margin: "16px 0 10px 0" }}
        />

        <div className="auto-size">
          <TextField
            label="Opacity"
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
            label="Border radius"
            type="number"
            value={object.borderRadius || 0}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              onChange("borderRadius", value >= 0 ? value : 0);
            }}
            fullWidth
            margin="normal"
          />
        </div>
      </div> */}

      <div className="padding-wrapper">
        <Box>
          {object.backgroundColor && object.backgroundColor !== "none" ? (
            // Если фон установлен, показываем настройки + кнопку удаления
            <div>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="subtitle2">Background </Typography>
                <IconButton
                  onClick={() => {
                    onChange("backgroundColor", "none");
                  }}
                >
                  <MinusIcon />
                </IconButton>
              </Box>

              <MuiColorInput
                label="Color"
                format="hex"
                // value={object.backgroundColor || "none"}
                value={
                  object.backgroundColor === "none"
                    ? ""
                    : object.backgroundColor
                }
                onChange={(newColor: string) =>
                  onChange("backgroundColor", newColor)
                }
                fullWidth
                sx={{ margin: "16px 0 10px 0" }}
              />
            </div>
          ) : (
            //
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2">Background</Typography>
              <IconButton
                onClick={() => onChange("backgroundColor", "#F1F1F1")}
              >
                <PlusIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </div>

      <div className="grey-line"></div>

      <div className="padding-wrapper">
        <Typography variant="subtitle2" sx={{ mb: "10px" }}>
          Appearance
        </Typography>

        <div className="auto-size">
          <TextField
            label="Opacity"
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
            label="Border radius"
            type="number"
            value={object.borderRadius || 0}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              onChange("borderRadius", value >= 0 ? value : 0);
            }}
            fullWidth
            margin="normal"
          />
        </div>
      </div>

      <div className="grey-line"></div>

      <div className="padding-wrapper">
        {!isBorderEditing ? (
          <Button
            variant="outlined"
            onClick={handleAddBorder}
            sx={{ textAlign: "left" }}
          >
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
      </div>
      <div className="grey-line"></div>
      <div className="padding-wrapper" style={{ marginTop: "10px" }}>
        <div className="auto-size">
          <TextField
            label="Rotate"
            type="number"
            value={object.rotate || 0}
            onChange={(e) => onChange("rotate", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="z-Index"
            type="number"
            value={object.zIndex || 0}
            onChange={(e) => onChange("zIndex", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />
        </div>
      </div>
    </Box>
  );
};

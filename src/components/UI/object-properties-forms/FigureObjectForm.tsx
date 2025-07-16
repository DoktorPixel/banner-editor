import { BannerObject } from "../../../types";
import {
  TextField,
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  ButtonGroup,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { MinusIcon, PlusIcon } from "../../../assets/icons";
import { MuiColorInput } from "mui-color-input";
import { useState, useEffect } from "react";
import { useObjectProperties } from "../../../utils/hooks";
import { ConditionSelector } from "../selectors/ConditionSelector";
import {
  BorderBottom,
  BorderLeft,
  BorderRight,
  BorderTop,
} from "../../../assets/icons";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        sx={{ mb: 1 }}
      >
        {t("sidebar.figure")}
      </Typography>

      <div className="grey-line"></div>
      <ConditionSelector objectId={object.id} condition={object.condition} />
      <div className="grey-line"></div>
      <div className="padding-wrapper">
        <Typography variant="subtitle2">{t("sidebar.general")}</Typography>
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          {t("selectors.position")}
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
            value={object.x || 0}
            onChange={(e) => onChange("x", parseInt(e.target.value, 10))}
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
        <Typography variant="subtitle2"> {t("sidebar.layouts")}</Typography>
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          {t("sidebar.size")}
        </InputLabel>
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
      </div>
      <div className="grey-line"></div>

      <div className="padding-wrapper">
        <Typography variant="subtitle2" sx={{ mb: "10px" }}>
          {t("sidebar.appearance")}
        </Typography>

        <div className="auto-size">
          <TextField
            label={t("sidebar.opacity")}
            type="number"
            slotProps={{
              input: {
                inputProps: {
                  step: 1,
                  min: 1,
                  max: 100,
                },
              },
            }}
            value={Math.round((Number(object.opacity) || 1) * 100)}
            onChange={(e) => {
              let newValue = parseInt(e.target.value, 10);
              if (isNaN(newValue)) newValue = 100;
              newValue = Math.min(100, Math.max(1, newValue));
              onChange("opacity", newValue / 100);
            }}
            fullWidth
            margin="normal"
          />

          <TextField
            label={t("sidebar.borderRadius")}
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
        <div className="auto-size" style={{ width: "calc(50% - 5px)" }}>
          <TextField
            label={t("sidebar.rotate")}
            type="number"
            value={object.rotate || 0}
            onChange={(e) => onChange("rotate", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />
        </div>
      </div>

      <div className="padding-wrapper">
        <Box>
          {object.backgroundColor && object.backgroundColor !== "none" ? (
            <div>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="subtitle2">
                  {t("sidebar.backgroundColor")}{" "}
                </Typography>
                <IconButton
                  onClick={() => {
                    onChange("backgroundColor", "none");
                  }}
                >
                  <MinusIcon />
                </IconButton>
              </Box>

              <MuiColorInput
                label={t("sidebar.color")}
                format="hex"
                value={
                  object.backgroundColor === "none"
                    ? ""
                    : object.backgroundColor
                }
                onChange={(newColor: string) =>
                  onChange("backgroundColor", newColor)
                }
                isAlphaHidden={true}
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
              <Typography variant="subtitle2">
                {t("sidebar.backgroundColor")}
              </Typography>
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
        {!isBorderEditing ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle2">{t("sidebar.stroke")}</Typography>
            <IconButton onClick={handleAddBorder}>
              <PlusIcon />
            </IconButton>
          </Box>
        ) : (
          <Box className="border-editor">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2">{t("sidebar.stroke")}</Typography>
              <IconButton onClick={() => handleBorderToggle(false)}>
                <MinusIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <MuiColorInput
                label={t("sidebar.color")}
                format="hex"
                value={object.borderTopColor || "#000000"}
                onChange={(newColor: string) =>
                  handleBorderChange("Color", newColor)
                }
                isAlphaHidden={true}
                fullWidth
                sx={{ marginTop: "20px" }}
              />

              <div className="auto-size" style={{ marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <InputLabel sx={{ mb: "2px", fontSize: "12px" }}>
                    {t("sidebar.style")}
                  </InputLabel>
                  <Select
                    value={object.borderTopStyle || "solid"}
                    onChange={(e) =>
                      handleBorderChange("Style", e.target.value)
                    }
                    fullWidth
                  >
                    <MenuItem value="solid">
                      {t("sidebar.borderStyles.solid")}
                    </MenuItem>
                    <MenuItem value="dotted">
                      {t("sidebar.borderStyles.dotted")}
                    </MenuItem>
                    <MenuItem value="dashed">
                      {t("sidebar.borderStyles.dashed")}
                    </MenuItem>
                    <MenuItem value="double">
                      {t("sidebar.borderStyles.double")}
                    </MenuItem>
                  </Select>
                </div>

                <div style={{ flex: 1 }}>
                  <InputLabel sx={{ mb: "2px", fontSize: "12px" }}>
                    {t("sidebar.weight")}
                  </InputLabel>
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
                </div>
              </div>

              <div className="border-selectors" style={{ display: "none" }}>
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
    </Box>
  );
};

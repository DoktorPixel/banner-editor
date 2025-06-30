import { BannerObject } from "../../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import FontSelector from "../selectors/FontSelector";
import TextAlignSelector from "../button-groups/TextAlignSelector";
import TextDecorationSelector from "../button-groups/TextDecorationSelector";
import FontStyleSelector from "../button-groups/FontStyleSelector";
import { MuiColorInput } from "mui-color-input";
import { ConditionSelector } from "../selectors/ConditionSelector";
import ActionToggle from "../button-groups/ActionToggle";
import { SvgHelp } from "../../../assets/icons";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number | boolean) => void;
}

export const TextObjectForm: React.FC<TextObjectFormProps> = ({
  object,
  onChange,
}) => {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        className="padding-wrapper"
        sx={{ mb: 1 }}
      >
        Text
      </Typography>

      <div className="padding-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "-18px",
          }}
        >
          <label
            htmlFor="custom-textfield"
            style={{
              fontSize: "12px",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            Text
          </label>
          <Tooltip
            arrow
            title={
              <Typography sx={{ whiteSpace: "pre-line", fontSize: "14px" }}>
                {
                  "Use dynamic tags like {{price}} or functions:\n{{format(price)}},\n{{discount(price, sale_price)}},\n{{min(val1, val2)}}"
                }
              </Typography>
            }
          >
            <span
              style={{
                cursor: "pointer",
                display: "inline-block",
                zIndex: 100,
              }}
            >
              <SvgHelp width="20px" height="20px" />
            </span>
          </Tooltip>
        </div>

        <TextField
          className="text-field-input"
          value={object.content || ""}
          onChange={(e) => onChange("content", e.target.value)}
          fullWidth
          margin="normal"
          multiline
          maxRows={5}
        />
      </div>

      {/* <div className="padding-wrapper">
        <TextField
          className="text-field-input"
          label="Text"
          value={object.content || ""}
          onChange={(e) => onChange("content", e.target.value)}
          fullWidth
          margin="normal"
          multiline
          maxRows={5}
        />
      </div> */}

      <div className="auto-size padding-wrapper">
        {!object.autoWidth && (
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
              Max lines
            </InputLabel>
            <TextField
              // label="Max lines"
              type="number"
              value={object.maxLines || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                onChange("maxLines", value >= 0 ? value : 0);
              }}
              fullWidth
              margin="normal"
            />
          </div>
        )}
      </div>

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
            value={object.height || 50}
            onChange={(e) => onChange("height", parseInt(e.target.value, 10))}
            fullWidth
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
      </div>

      <div className="grey-line"></div>

      <div className="padding-wrapper">
        <Typography variant="subtitle2">Typography</Typography>
        <FontSelector
          value={object.fontFamily || "Poppins"}
          onChange={(font) => onChange("fontFamily", font)}
        />

        <div className="auto-size">
          <FormControl fullWidth>
            <Select
              value={object.fontWeight || "400"}
              onChange={(e) => onChange("fontWeight", e.target.value)}
              slotProps={{
                root: {
                  style: {
                    border: "1px solid #E4E4E4",
                    backgroundColor: "white",
                  },
                },
              }}
            >
              <MenuItem value="300">Light (300)</MenuItem>
              <MenuItem value="400">Regular (400)</MenuItem>
              <MenuItem value="500">Medium (500)</MenuItem>
              <MenuItem value="600">SemiBold (600)</MenuItem>
              <MenuItem value="700">Bold (700)</MenuItem>
              <MenuItem value="800">ExtraBold (800)</MenuItem>
              <MenuItem value="900">Black (900)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="number"
            value={object.fontSize || 16}
            onChange={(e) => onChange("fontSize", parseInt(e.target.value, 10))}
            fullWidth
            slotProps={{
              input: {
                style: {
                  border: "1px solid #E4E4E4",
                  backgroundColor: "white",
                },
              },
            }}
          />
        </div>

        <MuiColorInput
          label="Color"
          format="hex"
          value={object.color || "#000000"}
          onChange={(newColor: string) => onChange("color", newColor)}
          fullWidth
          sx={{ margin: "32px 0 10px 0" }}
        />
      </div>

      <div className="grey-line"></div>
      <div className="padding-wrapper">
        <TextAlignSelector
          value={object.textAlign || "left"}
          onChange={(value) => onChange("textAlign", value)}
        />
        <FontStyleSelector
          value={object.fontStyle || "normal"}
          onChange={(value) => onChange("fontStyle", value)}
        />

        <TextDecorationSelector
          value={(object.textDecoration || "none").toString()}
          onChange={(value) => onChange("textDecoration", value)}
        />
      </div>

      <div className="grey-line"></div>
      <div className="padding-wrapper" style={{ marginTop: "20px" }}>
        <Typography variant="subtitle2" sx={{ mb: "10px" }}>
          Appearance
        </Typography>

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
        </div>
      </div>
    </Box>
  );
};

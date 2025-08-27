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
import { useBanner } from "../../../context/BannerContext";
import FontSelector from "../selectors/FontSelector";
import { CustomFontSelector } from "../selectors/CustomFontSelector";
import TextAlignSelector from "../button-groups/TextAlignSelector";
import TextDecorationSelector from "../button-groups/TextDecorationSelector";
import FontStyleSelector from "../button-groups/FontStyleSelector";
import { TextTransformSelector } from "../button-groups/TextTransformSelector";
import { MuiColorInput } from "mui-color-input";
import { ConditionSelector } from "../selectors/ConditionSelector";
import ActionToggle from "../button-groups/ActionToggle";
import { LineHeightInput } from "../inputs/LineHeightInput";
import { SvgHelp } from "../../../assets/icons";
import { useTranslation } from "react-i18next";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number | boolean) => void;
}

export const TextObjectForm: React.FC<TextObjectFormProps> = ({
  object,
  onChange,
}) => {
  const { currentProjectId } = useBanner();
  const { t } = useTranslation();
  return (
    <Box>
      <Typography
        variant="subtitle1"
        className="padding-wrapper"
        sx={{ mb: 1 }}
      >
        {t("sidebar.text")}
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
            {t("sidebar.text")}
          </label>
          <Tooltip
            arrow
            title={
              <Typography sx={{ whiteSpace: "pre-line", fontSize: "14px" }}>
                {t("sidebar.dynamicTagsHelp")}
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

      {/* <div>zIndex:{object.zIndex} </div> */}

      <div className="auto-size padding-wrapper">
        {!object.autoWidth && (
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
              {t("sidebar.maxLines")}
            </InputLabel>
            <TextField
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
        <Typography variant="subtitle2">{t("sidebar.general")}</Typography>
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          {t("selectors.position")}
        </InputLabel>
        <div className="auto-size">
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {t("selectors.left")}
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    {t("selectors.top")}
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    {t("selectors.width")}
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    {t("selectors.height")}
                  </InputAdornment>
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
            label={t("sidebar.width")}
            options={[
              { value: "auto", label: t("sidebar.auto") },
              { value: "fixed", label: t("sidebar.fixed") },
            ]}
            selected={object.autoWidth ? "auto" : "fixed"}
            onChange={(value) => onChange("autoWidth", value === "auto")}
          />
        </div>
      </div>

      <div className="grey-line"></div>

      <div className="padding-wrapper">
        <Typography variant="subtitle2">{t("sidebar.typography")}</Typography>
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
              <MenuItem value="300">{t("sidebar.fontWeights.light")}</MenuItem>
              <MenuItem value="400">
                {t("sidebar.fontWeights.regular")}
              </MenuItem>
              <MenuItem value="500">{t("sidebar.fontWeights.medium")}</MenuItem>
              <MenuItem value="600">
                {t("sidebar.fontWeights.semiBold")}
              </MenuItem>
              <MenuItem value="700">{t("sidebar.fontWeights.bold")}</MenuItem>
              <MenuItem value="800">
                {t("sidebar.fontWeights.extraBold")}
              </MenuItem>
              <MenuItem value="900">{t("sidebar.fontWeights.black")}</MenuItem>
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
          label={t("sidebar.color")}
          format="hex"
          value={object.color || "#000000"}
          onChange={(newColor: string) => onChange("color", newColor)}
          isAlphaHidden={true}
          fullWidth
          sx={{ margin: "32px 0 10px 0" }}
        />

        <div className="auto-size">
          <LineHeightInput
            value={object.lineHeight || "120%"}
            onChange={(value) => onChange("lineHeight", value)}
          />
          <TextField
            label={t("sidebar.letterSpacing")}
            type="number"
            value={object.letterSpacing || 0}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              onChange("letterSpacing", isNaN(value) ? 0 : value);
            }}
            fullWidth
            margin="normal"
            inputProps={{
              step: 0.1,
              min: -2,
              max: 5,
            }}
          />
        </div>
      </div>
      <div className="grey-line"></div>
      <CustomFontSelector templateId={currentProjectId || ""} />
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

        <TextTransformSelector
          value={object.textTransform || "none"}
          onChange={(value) => onChange("textTransform", value || "none")}
        />
      </div>

      <div className="grey-line"></div>
      <div className="padding-wrapper" style={{ marginTop: "20px" }}>
        <Typography variant="subtitle2" sx={{ mb: "10px" }}>
          {t("sidebar.appearance")}
        </Typography>

        <div className="auto-size">
          <TextField
            label={t("sidebar.rotate")}
            type="number"
            value={object.rotate || 0}
            onChange={(e) => onChange("rotate", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />
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
        </div>
      </div>
    </Box>
  );
};

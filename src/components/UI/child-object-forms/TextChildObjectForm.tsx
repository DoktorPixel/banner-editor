import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { BannerChild } from "../../../types";
import ChildFontSelector from "../selectors/ChildFontSelector";
import TextDecorationSelector from "../button-groups/TextDecorationSelector";
import FontStyleSelector from "../button-groups/FontStyleSelector";
import { ChildConditionSelector } from "../selectors/ChildConditionSelector";
import ChildOrderControls from "../button-groups/ChildOrderControls";
import { SvgHelp } from "../../../assets/icons";
import { useTranslation } from "react-i18next";

interface TextChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const TextChildObjectForm: React.FC<TextChildObjectFormProps> = ({
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
  const { t } = useTranslation();
  return (
    <Box className="child-object-form">
      <Typography
        variant="subtitle1"
        className="padding-wrapper"
        sx={{ mb: 2 }}
      >
        {t("sidebar.nestedText")}
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
          name="content"
          value={object.content || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          maxRows={5}
        />
      </div>

      <div className="grey-line"></div>

      <ChildConditionSelector
        childId={object.id}
        condition={object.condition}
      />
      <div className="grey-line"></div>

      <div className="padding-wrapper">
        <Typography variant="subtitle2">{t("sidebar.typography")}</Typography>
        <ChildFontSelector
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
      </div>

      <div className="grey-line"></div>

      <div className="padding-wrapper">
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

      <div className="padding-wrapper" style={{ marginTop: "10px" }}>
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
      <div className="grey-line"></div>
      <div className="padding-wrapper">
        <ChildOrderControls object={object} />
      </div>
    </Box>
  );
};

export default TextChildObjectForm;

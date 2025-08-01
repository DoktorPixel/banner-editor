import { useState } from "react";
import { BannerChild } from "../../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import UpdateImageDialog from "../dialogs/UpdateImageDialog";
import { ChildConditionSelector } from "../selectors/ChildConditionSelector";
import ChildOrderControls from "../button-groups/ChildOrderControls";
import { useTranslation } from "react-i18next";

interface ImageChildObjectFormProps {
  object: BannerChild;
  onChange: (key: keyof BannerChild, value: string | number) => void;
}

export const ImageChildObjectForm: React.FC<ImageChildObjectFormProps> = ({
  object,
  onChange,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const { t } = useTranslation();
  const handleUpdateUrl = (newUrl: string) => {
    onChange("src", newUrl);
  };

  return (
    <Box className="child-object-form">
      <Typography
        variant="subtitle1"
        className="padding-wrapper"
        sx={{ mb: 1 }}
      >
        {t("sidebar.nestedImage")}
      </Typography>

      <div className="grey-line"></div>
      <ChildConditionSelector
        childId={object.id}
        condition={object.condition}
      />
      {/* <div className="grey-line"></div>
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
      </div> */}
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
            value={Math.round(object.height || 50)}
            onChange={(e) => onChange("height", parseInt(e.target.value, 10))}
            fullWidth
            disabled={object.autoHeight}
            margin="normal"
          />
        </div>
      </div>

      {object.dynamics && (
        <div className="padding-wrapper">
          <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>URL</InputLabel>
          <TextField
            type="text"
            value={object.src}
            onChange={(e) => onChange("src", e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
      )}

      <div className="padding-wrapper">
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          {t("sidebar.objectFit.label")}
        </InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            value={object.objectFit || "fill"}
            onChange={(e) => onChange("objectFit", e.target.value)}
          >
            <MenuItem value="fill">{t("sidebar.objectFit.fill")}</MenuItem>
            <MenuItem value="contain">
              {t("sidebar.objectFit.contain")}
            </MenuItem>
            <MenuItem value="cover">{t("sidebar.objectFit.cover")}</MenuItem>
            <MenuItem value="none">{t("sidebar.objectFit.none")}</MenuItem>
          </Select>
        </FormControl>
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

      <UpdateImageDialog
        open={isDialogOpen}
        initialUrl={object.src || ""}
        onClose={handleDialogClose}
        onUpdate={handleUpdateUrl}
      />
    </Box>
  );
};

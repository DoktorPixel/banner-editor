import { useState } from "react";
import { BannerObject } from "../../../types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Button,
  Typography,
  InputAdornment,
  Box,
  // IconButton,
} from "@mui/material";
import UpdateImageDialog from "../dialogs/UpdateImageDialog";
import { ConditionSelector } from "../ConditionSelector";

interface ImageObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number) => void;
}

export const ImageObjectForm: React.FC<ImageObjectFormProps> = ({
  object,
  onChange,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  // const handleDialogOpen = () => {
  //   setDialogOpen(true);
  // };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUpdateUrl = (newUrl: string) => {
    onChange("src", newUrl);
  };

  const handleInputChange = (
    key: keyof BannerObject,
    value: string | number
  ) => {
    onChange(key, value);
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        className="padding-wrapper"
        sx={{ mb: 1 }}
      >
        Image
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
      </div>
      {/* <div className="grey-line"></div> */}
      {/* <div className="padding-wrapper">
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>URL</InputLabel>
        <div className="update-image-wrapper">
          <TextField
            value={object.src || ""}
            onChange={(e) => handleInputChange("src", e.target.value)}
            fullWidth
            margin="normal"
            disabled
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
            fullWidth
            style={{
              padding: "2px 8px",
              fontSize: "11px",
              height: "32px",
              top: "3px",
              lineHeight: "1.2",
            }}
          >
            Update image
          </Button>
        </div>
      </div> */}

      <div className="padding-wrapper">
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          Object Fit
        </InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            value={object.objectFit || "fill"}
            onChange={(e) => handleInputChange("objectFit", e.target.value)}
          >
            <MenuItem value="fill">Fill</MenuItem>
            <MenuItem value="contain">Contain</MenuItem>
            <MenuItem value="cover">Cover</MenuItem>
            <MenuItem value="none">None</MenuItem>
          </Select>
        </FormControl>
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
          {/* <TextField
            label="z-Index"
            type="number"
            value={object.zIndex || 0}
            onChange={(e) => onChange("zIndex", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          /> */}
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

      <UpdateImageDialog
        open={isDialogOpen}
        initialUrl={object.src || ""}
        onClose={handleDialogClose}
        onUpdate={handleUpdateUrl}
      />
    </Box>
  );
};

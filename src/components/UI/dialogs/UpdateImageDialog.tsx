import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Slider,
  InputLabel,
} from "@mui/material";
import ImageCompression from "browser-image-compression";
import ClearIcon from "@mui/icons-material/Clear";
import DragAndDropFileInput from "../inputs/DragAndDropFileInput";

interface UpdateImageDialogProps {
  open: boolean;
  initialUrl: string;
  onClose: () => void;
  onUpdate: (newUrl: string) => void;
}

const UpdateImageDialog: React.FC<UpdateImageDialogProps> = ({
  open,
  initialUrl,
  onClose,
  onUpdate,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number>(600);

  useEffect(() => {
    if (!open) {
      resetFields();
    } else {
      setPreview(initialUrl || "");
    }
  }, [open, initialUrl]);

  const resetFields = () => {
    setFile(null);
    setPreview("");
    setMaxWidthOrHeight(600);
  };

  const handleFileChange = async (newFile: File | null) => {
    if (newFile) {
      setFile(newFile);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight,
        useWebWorker: true,
      };
      try {
        const compressedFile = await ImageCompression(newFile, options);
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    } else {
      setFile(null);
      setPreview("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setFile(null);
    setPreview(newUrl);
  };

  const handleClearUrl = () => {
    setPreview("");
  };

  const handleClearFile = () => {
    setFile(null);
    setPreview("");
  };

  const handleUpdate = () => {
    if (preview) {
      onUpdate(preview);
    }
    onClose();
  };

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setMaxWidthOrHeight(value as number);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update image</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Upload image via URL or select file:
        </Typography>
        <InputLabel sx={{ mt: 1, mb: -1, fontSize: "12px" }}>URL</InputLabel>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            margin="dense"
            fullWidth
            value={preview}
            onChange={handleUrlChange}
            disabled={Boolean(file)}
          />
          {preview && (
            <IconButton onClick={handleClearUrl}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
        <Box
          mt={2}
          sx={{
            width: "98%",
            opacity: file || preview ? 0.5 : 1,
            pointerEvents: file || preview ? "none" : "auto",
          }}
        >
          <Typography gutterBottom>
            Maximum width (pixels): {maxWidthOrHeight}
          </Typography>
          <Slider
            value={maxWidthOrHeight}
            onChange={handleSliderChange}
            min={20}
            max={600}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box mt={2} display="flex" alignItems="center">
          <DragAndDropFileInput
            value={file}
            onChange={handleFileChange}
            accept="image/*"
            disabled={Boolean(preview)}
          />
          {file && (
            <IconButton onClick={handleClearFile}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "367px",
              maxHeight: "100%",
              border: "1px solid #ccc",
              marginTop: "1rem",
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary" disabled={!preview}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateImageDialog;

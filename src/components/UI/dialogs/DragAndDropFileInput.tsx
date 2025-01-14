import { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface DragAndDropFileInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  disabled?: boolean;
}

const DragAndDropFileInput: React.FC<DragAndDropFileInputProps> = ({
  value,
  onChange,
  accept = "image/*",
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (accept && !file.type.match(accept)) {
        console.error("Невірний тип файлу");
        return;
      }
      onChange(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange(file);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      sx={{
        border: isDragging ? "2px dashed #3f51b5" : "1px solid #ccc",
        borderRadius: "4px",
        padding: "16px",
        textAlign: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: isDragging ? "#f0f8ff" : "transparent",
        position: "relative",
        width: "100%",
      }}
    >
      <CloudUploadIcon
        fontSize="large"
        color={isDragging ? "primary" : "inherit"}
      />
      <Box mt={2}>
        {value ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body2" sx={{ mr: 1 }}>
              {value.name}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Перетягніть або виберіть зображення
          </Typography>
        )}
      </Box>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        disabled={disabled}
      />
    </Box>
  );
};

export default DragAndDropFileInput;

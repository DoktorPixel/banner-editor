import { FC, useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { PlusIcon, MinusIcon, DeleteFile } from "../../../assets/icons";
import {
  useFonts,
  useUploadFont,
  useDeleteFont,
} from "../../../utils/useFonts";
import { useConfig } from "../../../context/ConfigContext";

interface Props {
  templateId: string;
}

export const CustomFontSelector: FC<Props> = ({ templateId }) => {
  const [open, setOpen] = useState(false);
  const [fontName, setFontName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { setCustomFonts } = useConfig();

  const {
    data: fonts,
    isLoading: isLoadingFonts,
    refetch,
  } = useFonts(templateId);
  // console.log("Fonts data:", fonts);
  const uploadFont = useUploadFont(templateId);
  const deleteFont = useDeleteFont(templateId);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleUpload = async () => {
    if (!selectedFile || !fontName.trim()) return;
    const cleanFontFamily = fontName.replace(/\s+/g, "");

    uploadFont.mutate(
      {
        file: selectedFile,
        font_name: fontName.trim(),
        font_family: cleanFontFamily,
      },
      {
        onSuccess: async () => {
          setFontName("");
          setSelectedFile(null);
          setSuccessMessage(t("customFont.uploadSuccess"));
          const updated = await refetch();
          setCustomFonts(updated.data || []);
        },
        onError: (error: unknown) => {
          if (error instanceof Error) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage(t("customFont.unexpectedError"));
          }
        },
      }
    );

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (fontId: string) => {
    deleteFont.mutate(fontId, {
      onSuccess: async () => {
        setSuccessMessage(t("customFont.deleteSuccess"));
        const updated = await refetch();
        setCustomFonts(updated.data || []);
      },
      onError: (error: unknown) => {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(t("customFont.unexpectedError"));
        }
      },
    });
  };

  const handleReset = () => {
    setFontName("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCloseSnackbar = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const isActionPending =
    uploadFont.isPending || deleteFont.isPending || isLoadingFonts;

  return (
    <Box px="10px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">
          {open ? t("customFont.manage") : t("customFont.title")}
        </Typography>
        <IconButton onClick={handleToggle}>
          {open ? <MinusIcon /> : <PlusIcon />}
        </IconButton>
      </Box>

      {open && (
        <>
          <Box sx={{ maxWidth: "170px", mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label={t("customFont.fontName")}
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              slotProps={{
                input: { style: { height: "40px" } },
              }}
            />
          </Box>

          <Box
            onClick={handleClickUploadArea}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            sx={{
              mt: 2,
              border: "1px dashed gray",
              borderRadius: 2,
              padding: 2,
              textAlign: "center",
              backgroundColor: isDragging ? "#f0f0f0" : "transparent",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            <Typography>
              {selectedFile
                ? `${t("customFont.selectedFile")}: ${selectedFile.name}`
                : t("customFont.uploadPrompt")}
            </Typography>
            <input
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              disabled={
                !fontName.trim() || !selectedFile || uploadFont.isPending
              }
              onClick={handleUpload}
            >
              {uploadFont.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                t("customFont.upload")
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleReset}
            >
              {t("customFont.reset")}
            </Button>
          </Box>

          <Box mt={2}>
            {isActionPending ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List dense>
                {fonts?.map((font) => (
                  <ListItem
                    key={font.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      borderRadius: 2,
                    }}
                    secondaryAction={
                      deleteFont.isPending ? (
                        <CircularProgress size={20} />
                      ) : (
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(font.id)}
                        >
                          <DeleteFile />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={font.font_name}
                      secondary={`${t("customFont.format")}: ${
                        font.font_format
                      }`}
                    />
                  </ListItem>
                ))}
                {fonts?.length === 0 && (
                  <Typography variant="caption" color="textSecondary" ml={1}>
                    {t("customFont.empty")}
                  </Typography>
                )}
              </List>
            )}
          </Box>

          <Snackbar
            open={!!errorMessage || !!successMessage}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={errorMessage ? "error" : "success"}
              variant="filled"
            >
              {errorMessage || successMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

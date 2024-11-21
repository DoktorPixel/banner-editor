import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const Sidebar: React.FC = () => {
  const { addObject, undo, redo, canUndo, canRedo } = useBanner();

  const [isTextDialogOpen, setTextDialogOpen] = useState(false);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  // Handlers for adding text
  const openTextDialog = () => setTextDialogOpen(true);
  const closeTextDialog = () => {
    setTextDialogOpen(false);
    setTextContent("");
  };

  const handleAddText = () => {
    addObject({
      id: Date.now(),
      type: "text",
      x: 50,
      y: 50,
      content: textContent || "Текст",
      fontSize: 16,
      color: "#000000",
    });
    closeTextDialog();
  };

  // Handlers for adding image
  const openImageDialog = () => setImageDialogOpen(true);
  const closeImageDialog = () => {
    setImageDialogOpen(false);
    setImageSrc("");
  };

  const handleAddImage = () => {
    addObject({
      id: Date.now(),
      type: "image",
      x: 50,
      y: 50,
      src: imageSrc || "https://via.placeholder.com/300",
    });
    closeImageDialog();
  };

  return (
    <Stack spacing={2} className="sidebar">
      {/* Buttons */}
      <Button variant="contained" color="primary" onClick={openTextDialog}>
        Добавить текст
      </Button>
      <Button variant="contained" color="secondary" onClick={openImageDialog}>
        Добавить изображение
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={undo}
        disabled={!canUndo}
      >
        Назад
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={redo}
        disabled={!canRedo}
      >
        Вперед
      </Button>

      {/* Dialog for adding text */}
      <Dialog open={isTextDialogOpen} onClose={closeTextDialog}>
        <DialogTitle>Добавить текст</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Текст"
            fullWidth
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTextDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleAddText} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding image */}
      <Dialog open={isImageDialogOpen} onClose={closeImageDialog}>
        <DialogTitle>Добавить изображение</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL изображения"
            fullWidth
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImageDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleAddImage} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Sidebar;

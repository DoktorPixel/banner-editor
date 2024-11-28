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
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const Sidebar: React.FC = () => {
  const { addObject, undo, redo, canUndo, canRedo } = useBanner();

  const [isTextDialogOpen, setTextDialogOpen] = useState(false);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const { objects, selectedObjectId, selectObject } = useBanner();

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
      <Button variant="contained" color="primary" onClick={openTextDialog}>
        Додати текст
      </Button>
      <Button variant="contained" color="secondary" onClick={openImageDialog}>
        Додати зображення
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

      <Dialog open={isTextDialogOpen} onClose={closeTextDialog}>
        <DialogTitle>Додати текст</DialogTitle>
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
            Відмінити
          </Button>
          <Button onClick={handleAddText} color="primary">
            Додати
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isImageDialogOpen} onClose={closeImageDialog}>
        <DialogTitle>Додати зображення</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL зображення"
            fullWidth
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImageDialog} color="secondary">
            Відмінити
          </Button>
          <Button onClick={handleAddImage} color="primary">
            Додати
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" sx={{ marginTop: "20px" }}>
        Список об'єктів
      </Typography>

      <List>
        {objects.map((obj) => (
          <ListItem
            key={obj.id}
            component="li"
            onClick={() => selectObject(obj.id)}
            sx={{
              cursor: "pointer",
              backgroundColor:
                obj.id === selectedObjectId ? "lightgray" : "white",
              "&:hover": { backgroundColor: "lightblue" },
            }}
          >
            <ListItemText
              primary={
                obj.type === "text" ? obj.content || "Текст" : "Зображення"
              }
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default Sidebar;

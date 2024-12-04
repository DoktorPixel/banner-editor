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
  const {
    addObject,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    objects,
    selectedObjectIds,
    selectObject,
    groupSelectedObjects,
    ungroupSelectedObject,
  } = useBanner();

  const [isTextDialogOpen, setTextDialogOpen] = useState(false);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [isClearHistoryDialogOpen, setClearHistoryDialogOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [imageSrc, setImageSrc] = useState("");

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
      width: 200,
      height: 50,
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

  const openClearHistoryDialog = () => setClearHistoryDialogOpen(true);
  const closeClearHistoryDialog = () => setClearHistoryDialogOpen(false);

  const handleClearHistory = () => {
    clearHistory();
    closeClearHistoryDialog();
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
      <Button
        variant="contained"
        color="error"
        onClick={openClearHistoryDialog}
      >
        Очистити історію
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

      <Dialog open={isClearHistoryDialogOpen} onClose={closeClearHistoryDialog}>
        <DialogTitle>Очистити історію</DialogTitle>
        <DialogContent>
          Ви впевнені, що хочете очистити історію? Це видалить всі зміни.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeClearHistoryDialog} color="secondary">
            Ні
          </Button>
          <Button onClick={handleClearHistory} color="error">
            Так
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
            onClick={(e) => selectObject(obj.id, e.ctrlKey || e.metaKey)}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedObjectIds.includes(obj.id)
                ? "lightgray"
                : "white",
              "&:hover": { backgroundColor: "lightblue" },
            }}
          >
            <ListItemText
              primary={(() => {
                const text =
                  obj.type === "text"
                    ? obj.content || "Текст"
                    : obj.type === "group"
                    ? "Група"
                    : "Зображення";

                return text.length > 50 ? `${text.slice(0, 30)}...` : text;
              })()}
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => groupSelectedObjects()}
        disabled={
          selectedObjectIds.length < 2 ||
          !selectedObjectIds.every(
            (id) => objects.find((obj) => obj.id === id)?.type === "text"
          )
        }
      >
        Групувати
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => ungroupSelectedObject()}
        disabled={
          selectedObjectIds.length !== 1 ||
          objects.find((obj) => obj.id === selectedObjectIds[0])?.type !==
            "group"
        }
      >
        Розгрупувати
      </Button>
    </Stack>
  );
};

export default Sidebar;

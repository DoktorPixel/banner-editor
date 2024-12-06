import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import {
  Button,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import TextDialog from "./UI/dialogs/TextDialog";
import ImageDialog from "./UI/dialogs/ImageDialog";
import ClearHistoryDialog from "./UI/dialogs/ClearHistoryDialog";

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

  const [dialogState, setDialogState] = useState({
    isTextDialogOpen: false,
    isImageDialogOpen: false,
    isClearHistoryDialogOpen: false,
  });

  const [textContent, setTextContent] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const openDialog = (type: keyof typeof dialogState) =>
    setDialogState((prev) => ({ ...prev, [type]: true }));

  const closeDialog = (type: keyof typeof dialogState) =>
    setDialogState((prev) => ({ ...prev, [type]: false }));

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
    setTextContent("");
    closeDialog("isTextDialogOpen");
  };

  const handleAddImage = () => {
    addObject({
      id: Date.now(),
      type: "image",
      x: 50,
      y: 50,
      src: imageSrc || "https://via.placeholder.com/300",
    });
    setImageSrc("");
    closeDialog("isImageDialogOpen");
  };

  const handleAddFigure = () => {
    addObject({
      id: Date.now(),
      type: "figure",
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      backgroundColor: "#f0f0f0",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    closeDialog("isClearHistoryDialogOpen");
  };

  return (
    <Stack spacing={2} className="sidebar">
      <Button
        variant="contained"
        color="primary"
        onClick={() => openDialog("isTextDialogOpen")}
      >
        Додати текст
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openDialog("isImageDialogOpen")}
      >
        Додати зображення
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddFigure()}
      >
        Додати фігуру
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
        onClick={() => openDialog("isClearHistoryDialogOpen")}
      >
        Очистити історію
      </Button>

      <TextDialog
        open={dialogState.isTextDialogOpen}
        textContent={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        onClose={() => closeDialog("isTextDialogOpen")}
        onAdd={handleAddText}
      />

      <ImageDialog
        open={dialogState.isImageDialogOpen}
        imageSrc={imageSrc}
        onChange={(e) => setImageSrc(e.target.value)}
        onClose={() => closeDialog("isImageDialogOpen")}
        onAdd={handleAddImage}
      />

      <ClearHistoryDialog
        open={dialogState.isClearHistoryDialogOpen}
        onClose={() => closeDialog("isClearHistoryDialogOpen")}
        onClear={handleClearHistory}
      />

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
              primary={
                obj.type === "text"
                  ? obj.content?.slice(0, 30) || "Текст"
                  : obj.type === "group"
                  ? "Група"
                  : obj.type === "figure"
                  ? "Фігура"
                  : "Зображення"
              }
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={groupSelectedObjects}
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
        onClick={ungroupSelectedObject}
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

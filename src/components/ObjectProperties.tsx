import { useBanner } from "../context/BannerContext";
import { BannerObject } from "../types";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const ObjectProperties: React.FC = () => {
  const {
    objects,
    updateObject,
    deleteObject,
    selectedObjectId,
    selectObject,
    clearSelection,
  } = useBanner();
  const selectedObject = objects.find((obj) => obj.id === selectedObjectId);

  const handleChange = (key: keyof BannerObject, value: string | number) => {
    if (selectedObjectId !== null) {
      updateObject(selectedObjectId, { [key]: value });
    }
  };

  const handleDelete = () => {
    if (selectedObjectId !== null) {
      deleteObject(selectedObjectId);
      clearSelection();
    }
  };

  return (
    <Box className="object-properties">
      <Typography variant="h5">Властивості об'єкту</Typography>
      {selectedObject ? (
        <Box className="properties-list">
          {selectedObject.type === "text" && (
            <>
              <TextField
                label="Текст"
                value={selectedObject.content}
                onChange={(e) => handleChange("content", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Розмір шрифта"
                type="number"
                value={selectedObject.fontSize || 16}
                onChange={(e) =>
                  handleChange("fontSize", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Колір"
                type="color"
                value={selectedObject.color || "#000000"}
                onChange={(e) => handleChange("color", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ширина (px)"
                type="number"
                value={selectedObject.width}
                onChange={(e) =>
                  handleChange("width", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Висота (px)"
                type="number"
                value={selectedObject.height}
                onChange={(e) =>
                  handleChange("height", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Номер шару (z-Index)"
                type="number"
                value={selectedObject.zIndex || 0}
                onChange={(e) =>
                  handleChange("zIndex", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Товщина тексту</InputLabel>
                <Select
                  value={selectedObject.fontWeight || "normal"}
                  onChange={(e) => handleChange("fontWeight", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="bold">Bold</MenuItem>
                  <MenuItem value="lighter">Lighter</MenuItem>
                  <MenuItem value="bolder">Bolder</MenuItem>
                  <MenuItem value="400">400</MenuItem>
                  <MenuItem value="700">700</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Стиль тексту</InputLabel>
                <Select
                  value={selectedObject.fontStyle || "normal"}
                  onChange={(e) => handleChange("fontStyle", e.target.value)}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="italic">Italic</MenuItem>
                  <MenuItem value="oblique">Oblique</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Text Transform</InputLabel>
                <Select
                  value={selectedObject.textTransform || "none"}
                  onChange={(e) =>
                    handleChange("textTransform", e.target.value)
                  }
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="capitalize">Capitalize</MenuItem>
                  <MenuItem value="uppercase">Uppercase</MenuItem>
                  <MenuItem value="lowercase">Lowercase</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Text Decoration</InputLabel>
                <Select
                  value={selectedObject.textDecoration || "none"}
                  onChange={(e) =>
                    handleChange("textDecoration", e.target.value)
                  }
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="underline">Underline</MenuItem>
                  <MenuItem value="overline">Overline</MenuItem>
                  <MenuItem value="line-through">Line-Through</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Text Align</InputLabel>
                <Select
                  value={selectedObject.textAlign || "left"}
                  onChange={(e) => handleChange("textAlign", e.target.value)}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                  <MenuItem value="justify">Justify</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          {selectedObject.type === "image" && (
            <>
              <TextField
                label="URL изображения"
                value={selectedObject.src || ""}
                onChange={(e) => handleChange("src", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ширина (px)"
                type="number"
                value={selectedObject.width}
                onChange={(e) =>
                  handleChange("width", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Висота (px)"
                type="number"
                value={selectedObject.height}
                onChange={(e) =>
                  handleChange("height", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Номер шару (z-Index)"
                type="number"
                value={selectedObject.zIndex || 0}
                onChange={(e) =>
                  handleChange("zIndex", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
            </>
          )}

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ marginTop: "20px" }}
          >
            Видалити об'єкт
          </Button>
        </Box>
      ) : (
        <Typography>Виберіть об'єкт для редагування</Typography>
      )}
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
    </Box>
  );
};

export default ObjectProperties;

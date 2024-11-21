import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import { BannerObject } from "../types";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ObjectProperties: React.FC = () => {
  const { objects, updateObject } = useBanner();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedObject = objects.find((obj) => obj.id === selectedId);

  const handleChange = (key: keyof BannerObject, value: string | number) => {
    if (selectedId !== null) {
      updateObject(selectedId, { [key]: value });
    }
  };

  return (
    <Box className="object-properties">
      <Typography variant="h5">Властивости объекта</Typography>
      {selectedObject ? (
        <Box>
          {selectedObject.type === "text" && (
            <>
              <TextField
                label="Текст"
                value={selectedObject.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Размер шрифта"
                type="number"
                value={selectedObject.fontSize || 16}
                onChange={(e) =>
                  handleChange("fontSize", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Цвет"
                type="color"
                value={selectedObject.color || "#000000"}
                onChange={(e) => handleChange("color", e.target.value)}
                fullWidth
                margin="normal"
              />
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
                value={selectedObject.width || 300}
                onChange={(e) =>
                  handleChange("width", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Высота (px)"
                type="number"
                value={selectedObject.height || 300}
                onChange={(e) =>
                  handleChange("height", parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
            </>
          )}
        </Box>
      ) : (
        <Typography>Выберите объект для редактирования</Typography>
      )}
      <Typography variant="h6" sx={{ marginTop: "20px" }}>
        Список объектов
      </Typography>
      <List>
        {objects.map((obj) => (
          <ListItem
            key={obj.id}
            component="li"
            onClick={() => setSelectedId(obj.id)}
            sx={{
              cursor: "pointer",
              backgroundColor: obj.id === selectedId ? "lightgray" : "white",
              "&:hover": { backgroundColor: "lightblue" },
            }}
          >
            <ListItemText
              primary={
                obj.type === "text" ? obj.content || "Текст" : "Изображение"
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ObjectProperties;

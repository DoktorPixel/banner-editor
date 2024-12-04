import { Box, Typography, Button } from "@mui/material";
import { useObjectProperties } from "../utils/hooks";
import { TextObjectForm } from "./UI/TextObjectForm";
import { ImageObjectForm } from "./UI/ImageObjectForm";
import { GroupObjectForm } from "./UI/GroupObjectForm";
import { AutoLayoutForm } from "./UI/AutoLayoutForm";
import { SelectedObjectsList } from "./UI/SelectedObjectsList";

const ObjectProperties: React.FC = () => {
  const {
    selectedObject,
    selectedObjects,
    selectedObjectIds,
    handleDelete,
    handleDeleteAll,
    updateObjectProperty,
    updateObjectMultipleProperties,
  } = useObjectProperties();

  return (
    <Box className="object-properties">
      <Typography variant="h5">Властивості об'єкту</Typography>

      {selectedObjectIds.length === 0 ? (
        <Typography>Виберіть об'єкт для редагування</Typography>
      ) : selectedObjectIds.length === 1 ? (
        selectedObject?.type === "text" ? (
          <TextObjectForm
            object={selectedObject}
            onChange={(key, value) =>
              updateObjectProperty(selectedObject.id, key, value)
            }
          />
        ) : selectedObject?.type === "image" ? (
          <ImageObjectForm
            object={selectedObject}
            onChange={(key, value) =>
              updateObjectProperty(selectedObject.id, key, value)
            }
          />
        ) : selectedObject?.type === "group" ? (
          <>
            <GroupObjectForm
              object={selectedObject}
              onChange={(key, value) =>
                updateObjectProperty(selectedObject.id, key, value)
              }
            />
            <AutoLayoutForm
              flexDirection={
                (selectedObject.flexDirection as "row" | "column") || "row"
              }
              justifyContent={selectedObject.justifyContent || "center"}
              alignItems={selectedObject.alignItems || "center"}
              onChange={(changes) =>
                updateObjectMultipleProperties(selectedObject.id, changes)
              }
            />
          </>
        ) : null
      ) : (
        <SelectedObjectsList objects={selectedObjects} />
      )}

      {selectedObjectIds.length === 1 && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ marginTop: "20px" }}
          >
            Видалити об'єкт
          </Button>
        </>
      )}
      {selectedObjectIds.length > 1 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAll}
          sx={{ marginTop: "20px" }}
        >
          Видалити вибрані об'єкти
        </Button>
      )}
    </Box>
  );
};

export default ObjectProperties;

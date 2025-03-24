import { Box, Typography, Button } from "@mui/material";
import { useObjectProperties, useChildProperties } from "../utils/hooks";
import { TextObjectForm } from "./UI/object-properties-forms/TextObjectForm";
import { ImageObjectForm } from "./UI/object-properties-forms/ImageObjectForm";
import { GroupObjectForm } from "./UI/object-properties-forms/GroupObjectForm";
import { FigureObjectForm } from "./UI/object-properties-forms/FigureObjectForm";
import { AutoLayoutForm } from "./UI/button-groups/AutoLayoutForm";
// import { ChildObjectForm } from "./UI/ChildObjectForm";
import { SelectedObjectsList } from "./UI/SelectedObjectsList";
//
import { TextChildObjectForm } from "./UI/child-object-forms/TextChildObjectForm";
import { ImageChildObjectForm } from "./UI/child-object-forms/ImageChildObjectForm";
import { FigureChildObjectForm } from "./UI/child-object-forms/FigureChildObjectForm";
import { GroupChildObjectForm } from "./UI/child-object-forms/GroupChildObjectForm";

const ObjectProperties: React.FC = () => {
  const {
    selectedObject,
    selectedObjects,
    selectedObjectIds,
    handleDelete,
    handleDeleteAll,
    updateObjectProperty,
    updateObjectMultipleProperties,
    //
  } = useObjectProperties();

  const {
    selectedChild,
    handleChangeChild,
    handleDeleteChild,
    handleChangeMultipleChildProperties,
  } = useChildProperties();

  return (
    <Box className="object-properties">
      <Typography variant="h5" className="padding-wrapper">
        Object properties
      </Typography>
      <div className="grey-line"></div>

      {selectedChild ? (
        <>
          {selectedChild.type === "text" && (
            <TextChildObjectForm
              object={selectedChild}
              onChange={handleChangeChild}
            />
          )}
          {selectedChild.type === "image" && (
            <ImageChildObjectForm
              object={selectedChild}
              onChange={handleChangeChild}
            />
          )}
          {selectedChild.type === "figure" && (
            <FigureChildObjectForm
              object={selectedChild}
              onChange={handleChangeChild}
              onChangeMultiple={handleChangeMultipleChildProperties}
            />
          )}
          {selectedChild?.type === "group" && (
            <>
              <GroupChildObjectForm
                object={selectedChild}
                onChange={handleChangeChild}
                onChangeMultiple={handleChangeMultipleChildProperties}
              />

              <AutoLayoutForm
                flexDirection={
                  (selectedChild.flexDirection as "row" | "column") || "row"
                }
                justifyContent={
                  (selectedChild.justifyContent as
                    | "start"
                    | "center"
                    | "end"
                    | "space-between") || "center"
                }
                alignItems={
                  (selectedChild.alignItems as
                    | "flex-start"
                    | "center"
                    | "flex-end") || "center"
                }
                onChange={(changes) =>
                  handleChangeMultipleChildProperties(changes)
                }
              />
            </>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteChild}
            sx={{ marginTop: "20px" }}
          >
            Видалити елемент з групи
          </Button>
        </>
      ) : selectedObjectIds.length === 0 ? (
        <Typography>Select an object to edit</Typography>
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
        ) : selectedObject?.type === "figure" ? (
          <FigureObjectForm
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
              justifyContent={
                (selectedObject.justifyContent as
                  | "start"
                  | "center"
                  | "end"
                  | "space-between") || "center"
              }
              alignItems={
                (selectedObject.alignItems as
                  | "flex-start"
                  | "center"
                  | "flex-end") || "center"
              }
              onChange={(changes) =>
                updateObjectMultipleProperties(selectedObject.id, changes)
              }
            />
          </>
        ) : null
      ) : (
        <SelectedObjectsList objects={selectedObjects} />
      )}

      {selectedObjectIds.length === 1 && !selectedChild && (
        <div className="padding-wrapper">
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ marginTop: "20px" }}
          >
            Delete object
          </Button>
        </div>
      )}
      {selectedObjectIds.length > 1 && (
        <div className="padding-wrapper">
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAll}
            sx={{ marginTop: "20px" }}
          >
            Delete selected objects
          </Button>
        </div>
      )}
    </Box>
  );
};

export default ObjectProperties;

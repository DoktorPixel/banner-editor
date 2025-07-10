import { Box, Typography } from "@mui/material";
import { useObjectProperties, useChildProperties } from "../utils/hooks";
import { TextObjectForm } from "./UI/object-properties-forms/TextObjectForm";
import { ImageObjectForm } from "./UI/object-properties-forms/ImageObjectForm";
import { GroupObjectForm } from "./UI/object-properties-forms/GroupObjectForm";
import { FigureObjectForm } from "./UI/object-properties-forms/FigureObjectForm";
import { SelectedObjectsList } from "./UI/SelectedObjectsList";
import { TextChildObjectForm } from "./UI/child-object-forms/TextChildObjectForm";
import { ImageChildObjectForm } from "./UI/child-object-forms/ImageChildObjectForm";
import { FigureChildObjectForm } from "./UI/child-object-forms/FigureChildObjectForm";
import { GroupChildObjectForm } from "./UI/child-object-forms/GroupChildObjectForm";

const ObjectProperties: React.FC = () => {
  const {
    selectedObject,
    selectedObjects,
    selectedObjectIds,
    updateObjectProperty,
  } = useObjectProperties();

  const {
    selectedChild,
    handleChangeChild,
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
            <GroupChildObjectForm
              object={selectedChild}
              onChange={handleChangeChild}
              onChangeMultiple={handleChangeMultipleChildProperties}
            />
          )}
        </>
      ) : selectedObjectIds.length === 0 ? (
        <div className="padding-wrapper">
          <Typography>Select an object to edit</Typography>
        </div>
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
          <GroupObjectForm
            object={selectedObject}
            onChange={(key, value) =>
              updateObjectProperty(selectedObject.id, key, value)
            }
          />
        ) : null
      ) : (
        <SelectedObjectsList objects={selectedObjects} />
      )}
    </Box>
  );
};

export default ObjectProperties;

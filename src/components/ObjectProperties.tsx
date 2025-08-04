import { Box, Typography } from "@mui/material";
import {
  useObjectProperties,
  useChildProperties,
  useNestedChildProperties,
} from "../utils/hooks";
import { TextObjectForm } from "./UI/object-properties-forms/TextObjectForm";
import { ImageObjectForm } from "./UI/object-properties-forms/ImageObjectForm";
import { GroupObjectForm } from "./UI/object-properties-forms/GroupObjectForm";
import { FigureObjectForm } from "./UI/object-properties-forms/FigureObjectForm";
import { SelectedObjectsList } from "./UI/SelectedObjectsList";
import { TextChildObjectForm } from "./UI/child-object-forms/TextChildObjectForm";
import { ImageChildObjectForm } from "./UI/child-object-forms/ImageChildObjectForm";
import { FigureChildObjectForm } from "./UI/child-object-forms/FigureChildObjectForm";
import { GroupChildObjectForm } from "./UI/child-object-forms/GroupChildObjectForm";
import { DeployTemplateButton } from "./UI/updates-components/TemplateButtons";
import LanguageSwitcher from "./UI/selectors/LanguageSwitcher";
import { useTranslation } from "react-i18next";
// import { useBanner } from "../context/BannerContext";
import { useZoom } from "../utils/banner-hooks";
import { ZoomControl } from "./UI/ZoomControl";

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

  const {
    selectedNestedChild,
    handleChangeNestedChild,
    handleChangeMultipleNestedChildProperties,
  } = useNestedChildProperties();

  const { t } = useTranslation();
  const { scale, setScale } = useZoom();
  // const { scale, setScale } = useBanner();
  return (
    <Box className="object-properties">
      <Box className="object-properties-header">
        <ZoomControl scale={scale} setScale={setScale} />
        <LanguageSwitcher />

        <DeployTemplateButton />
      </Box>

      <div className="grey-line"></div>
      <Typography variant="h5" className="padding-wrapper">
        {t("sidebar.objectProperties")}
      </Typography>
      <div className="grey-line"></div>

      {selectedNestedChild ? (
        <>
          {selectedNestedChild.type === "text" && (
            <TextChildObjectForm
              object={selectedNestedChild}
              onChange={handleChangeNestedChild}
            />
          )}
          {selectedNestedChild.type === "image" && (
            <ImageChildObjectForm
              object={selectedNestedChild}
              onChange={handleChangeNestedChild}
            />
          )}
          {selectedNestedChild.type === "figure" && (
            <FigureChildObjectForm
              object={selectedNestedChild}
              onChange={handleChangeNestedChild}
              onChangeMultiple={handleChangeMultipleNestedChildProperties}
            />
          )}
          {selectedNestedChild?.type === "group" && (
            <GroupChildObjectForm
              object={selectedNestedChild}
              onChange={handleChangeNestedChild}
              onChangeMultiple={handleChangeMultipleNestedChildProperties}
            />
          )}
        </>
      ) : selectedChild ? (
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
          <Typography> {t("sidebar.selectObject")} </Typography>
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

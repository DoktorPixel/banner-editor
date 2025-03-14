import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import { Button, Stack } from "@mui/material";
import TextDialog from "./UI/dialogs/TextDialog";
import ImageDialog from "./UI/dialogs/ImageDialog";
import ClearHistoryDialog from "./UI/dialogs/ClearHistoryDialog";
import NameDialog from "./UI/dialogs/NameDialog";
import JSONDialog from "./UI/dialogs/JSONDialog";
import { BannerObject } from "../types";
import { useObjectProperties } from "../utils/hooks";

import ExportToServer from "./UI/ExportToServer";
import ExportBanner from "./UI/ExportBanner";
import SidebarObjectList from "./UI/SidebarObjectList";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DynamicProps from "./UI/DynamicProps";
import TabPanelComponent from "./UI/TabPanelComponent";
import ManageDynamicImgsModal from "./UI/dialogs/ManageDynamicImgsModal";
import SavePresetButton from "./UI/s3-components/SavePresetButton";
import ApplyPresetButton from "./UI/s3-components/ApplyPresetButton";

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
    selectAllObjects,
    groupSelectedObjects,
    ungroupSelectedObject,
    addJson,
    currentProjectName,
    updateMultipleObjects,
  } = useBanner();
  const { updateObjectProperty } = useObjectProperties();

  const [isDynamicImgsModalOpen, setIsDynamicImgsModalOpen] = useState(false);

  const [dialogState, setDialogState] = useState({
    isTextDialogOpen: false,
    isImageDialogOpen: false,
    isClearHistoryDialogOpen: false,
    isJsonDialogOpen: false,
  });

  const [textContent, setTextContent] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [nameDialogState, setNameDialogState] = useState({
    isNameDialogOpen: false,
    currentName: "",
    objectId: null as number | null,
  });

  const openDialog = (type: keyof typeof dialogState) =>
    setDialogState((prev) => ({ ...prev, [type]: true }));

  const closeDialog = (type: keyof typeof dialogState) =>
    setDialogState((prev) => ({ ...prev, [type]: false }));

  const openNameDialog = (object: BannerObject) => {
    setNameDialogState({
      isNameDialogOpen: true,
      currentName: object.name || "",
      objectId: object.id,
    });
  };

  const closeNameDialog = () => {
    setNameDialogState({
      isNameDialogOpen: false,
      currentName: "",
      objectId: null,
    });
  };
  //
  const saveName = () => {
    if (nameDialogState.objectId !== null) {
      updateObjectProperty(
        nameDialogState.objectId,
        "name",
        nameDialogState.currentName
      );
    }
    closeNameDialog();
  };

  const handleLoadJson = (jsonData: BannerObject[]) => {
    addJson(jsonData);
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
      name: "",
    });
    setTextContent("");
    closeDialog("isTextDialogOpen");
  };

  const handleAddImage = (src: string) => {
    addObject({
      id: Date.now(),
      type: "image",
      width: 250,
      height: 250,
      x: 50,
      y: 50,
      src,
      name: "",
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
      name: "",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    closeDialog("isClearHistoryDialogOpen");
  };

  const groupSelectedObjectsAbstract = () => {
    if (selectedObjectIds.length < 2) return;

    const newAbstractGroupId = Date.now();

    const updates = selectedObjectIds.reduce((acc, id) => {
      acc[id] = { abstractGroupId: newAbstractGroupId };
      return acc;
    }, {} as Record<number, Partial<BannerObject>>);

    updateMultipleObjects(updates);
  };

  const ungroupSelectedObjectsAbstract = () => {
    if (selectedObjectIds.length === 0) return;

    const updates = selectedObjectIds.reduce((acc, id) => {
      acc[id] = { abstractGroupId: null };
      return acc;
    }, {} as Record<number, Partial<BannerObject>>);

    updateMultipleObjects(updates);
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
        variant="contained"
        color="primary"
        onClick={() => setIsDynamicImgsModalOpen(true)}
      >
        Завантажити динамічні лого
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
        onAdd={(src) => handleAddImage(src)}
      />

      <ClearHistoryDialog
        open={dialogState.isClearHistoryDialogOpen}
        onClose={() => closeDialog("isClearHistoryDialogOpen")}
        onClear={handleClearHistory}
      />
      <JSONDialog
        open={dialogState.isJsonDialogOpen}
        onClose={() => closeDialog("isJsonDialogOpen")}
        onLoad={handleLoadJson}
      />
      <TabPanelComponent
        tabs={[
          {
            label: "Список об'єктів",
            content: (
              <SidebarObjectList
                objects={objects}
                selectedObjectIds={selectedObjectIds}
                selectObject={selectObject}
                selectAllObjects={selectAllObjects}
                openNameDialog={openNameDialog}
              />
            ),
          },
          {
            label: "Змінні",
            content: <DynamicProps />,
          },
        ]}
      />

      {/*  */}

      <NameDialog
        open={nameDialogState.isNameDialogOpen}
        name={nameDialogState.currentName}
        onChange={(e) =>
          setNameDialogState((prev) => ({
            ...prev,
            currentName: e.target.value,
          }))
        }
        onClose={closeNameDialog}
        onSave={saveName}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={groupSelectedObjects}
        disabled={selectedObjectIds.length < 2}
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

      <Button
        variant="contained"
        color="secondary"
        onClick={groupSelectedObjectsAbstract}
        disabled={
          selectedObjectIds.length < 2 ||
          !objects.some(
            (obj) =>
              selectedObjectIds.includes(obj.id) &&
              (obj.abstractGroupId === null ||
                obj.abstractGroupId === undefined)
          )
        }
      >
        Групувати (абстрактні)
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={ungroupSelectedObjectsAbstract}
        disabled={
          selectedObjectIds.length < 2 ||
          !objects.some(
            (obj) =>
              selectedObjectIds.includes(obj.id) && obj.abstractGroupId != null
          )
        }
      >
        Розгрупувати (абстрактні)
      </Button>

      <SavePresetButton />
      <ApplyPresetButton />

      <ExportToServer />
      <ExportBanner />
      <ManageDynamicImgsModal
        open={isDynamicImgsModalOpen}
        onClose={() => setIsDynamicImgsModalOpen(false)}
        projectId={currentProjectName}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => openDialog("isJsonDialogOpen")}
      >
        Завантажити JSON <CloudUploadIcon sx={{ marginLeft: "10px" }} />
      </Button>
    </Stack>
  );
};

export default Sidebar;

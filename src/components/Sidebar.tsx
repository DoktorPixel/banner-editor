import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import {
  Button,
  Stack,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import ClearHistoryDialog from "./UI/dialogs/ClearHistoryDialog";
import { BannerObject } from "../types";
import SavePresetButton from "./UI/s3-components/SavePresetButton";
import ApplyPresetButton from "./UI/s3-components/ApplyPresetButton";
import UploadToS3Button from "./UI/s3-components/UploadToS3";
import SidebarTabs from "./UI/sidebar-components/SidebarTabs";
import { BigArrowRight, BigArrowLeft } from "../assets/icons";

const Sidebar: React.FC = () => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    // clearHistory,
    objects,
    selectedObjectIds,
    groupSelectedObjects,
    ungroupSelectedObject,
    currentProjectName,
    updateMultipleObjects,
    clearProject,
  } = useBanner();

  const [open, setOpen] = useState(false);

  // const [dialogState, setDialogState] = useState({
  //   isTextDialogOpen: false,
  //   isImageDialogOpen: false,
  //   isClearHistoryDialogOpen: false,
  //   isJsonDialogOpen: false,
  // });

  const handleToggle = () => setOpen(!open);

  const handleUpload = async () => {
    clearProject();
  };

  // const openDialog = (type: keyof typeof dialogState) =>
  //   setDialogState((prev) => ({ ...prev, [type]: true }));

  // const closeDialog = (type: keyof typeof dialogState) =>
  //   setDialogState((prev) => ({ ...prev, [type]: false }));

  // const handleClearHistory = () => {
  //   clearHistory();
  //   closeDialog("isClearHistoryDialogOpen");
  // };

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
      <div className="sidebar-wrapper">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography sx={{ lineHeight: "1" }}>FeedMaker</Typography>
            <IconButton size="small" edge="start" onClick={handleToggle}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </div>

          <div>
            <IconButton
              size="small"
              // edge="start"
              onClick={undo}
              disabled={!canUndo}
            >
              <BigArrowLeft />
            </IconButton>
            <IconButton
              size="small"
              // edge="start"
              onClick={redo}
              disabled={!canRedo}
            >
              <BigArrowRight />
            </IconButton>
          </div>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <UploadToS3Button />
          <Button onClick={handleUpload}>Close project</Button>
        </Collapse>
        <Typography variant="h6" className="project-name">
          {currentProjectName || "Без назви"}
        </Typography>
      </div>
      <div className="grey-line"></div>

      <SidebarTabs />

      {/* <ClearHistoryDialog
        open={dialogState.isClearHistoryDialogOpen}
        onClose={() => closeDialog("isClearHistoryDialogOpen")}
        onClear={handleClearHistory}
      /> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          margin: "16px 10px 6px 6px",
        }}
      >
        {/* <Button
          variant="contained"
          color="error"
          onClick={() => openDialog("isClearHistoryDialogOpen")}
        >
          Очистити історію
        </Button> */}

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
                selectedObjectIds.includes(obj.id) &&
                obj.abstractGroupId != null
            )
          }
        >
          Розгрупувати (абстрактні)
        </Button>

        <SavePresetButton />
        <ApplyPresetButton />
      </div>
    </Stack>
  );
};

export default Sidebar;

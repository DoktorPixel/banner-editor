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
import SidebarTabs from "./UI/sidebar-components/SidebarTabs";
import { BigArrowRight, BigArrowLeft } from "../assets/icons";
import AutoSaver from "./UI/updates-components/AutoSaver";
// import { DownloadPreviewButton } from "./UI/button-groups/DownloadPreviewButton";
// import {
//   GetTemplateButton,
//   UpdateTemplateButton,
//   DeployTemplateButton,
// } from "./UI/updates-components/TemplateButtons";

const Sidebar: React.FC = () => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    currentProjectName,
    clearProject,
    // currentProjectId,
  } = useBanner();

  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  const handleUpload = async () => {
    clearProject();
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              position: "relative",
            }}
          >
            <Typography sx={{ lineHeight: "1" }}>FeedMaker</Typography>
            <IconButton size="small" edge="start" onClick={handleToggle}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <AutoSaver />
          </div>

          <div>
            <IconButton size="small" onClick={undo} disabled={!canUndo}>
              <BigArrowLeft />
            </IconButton>
            <IconButton size="small" onClick={redo} disabled={!canRedo}>
              <BigArrowRight />
            </IconButton>
          </div>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {/* <GetTemplateButton
            templateId={currentProjectId || ""}
            onSuccess={(data) => console.log("Loaded template:", data)}
          /> */}

          {/* <UpdateTemplateButton
            templateId={currentProjectId || ""}
            data={projectData}
            config={config}
            objects={objects}
            dynamicImgs={dynamicImgs}
          /> */}

          {/* <DeployTemplateButton
            templateId={currentProjectId || ""}
            onSuccess={() => console.log("Template deployed!")}
          /> */}
          <Button onClick={handleUpload}>Close project</Button>
          {/* <DownloadPreviewButton /> */}
        </Collapse>
        <Typography variant="h6" className="project-name">
          {currentProjectName || "Без назви"}
        </Typography>
      </div>
      <div className="grey-line"></div>

      <SidebarTabs />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          margin: "16px 10px 6px 6px",
        }}
      ></div>
    </Stack>
  );
};

export default Sidebar;

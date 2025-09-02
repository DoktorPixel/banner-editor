import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import Sidebar from "./Sidebar";
import BannerArea from "./BannerArea";
import ObjectProperties from "./ObjectProperties";
import { useConfig } from "../context/ConfigContext";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useProject } from "../utils/useSupabaseProject";
import { ProjectData } from "../types";

interface LayoutProps {
  isAuthReady: boolean;
}

const defaultConfig = {
  hiddenObjectIds: [],
  keyValuePairs: [
    { key: "title", value: "Назва продукту" },
    { key: "img", value: "https://placehold.co/300" },
    { key: "price", value: "1000 UAH" },
    { key: "sale_price", value: "800 UAH" },
  ],
  canvasSize: {
    width: 1080,
    height: 1080,
  },
};

const Layout: React.FC<LayoutProps> = ({ isAuthReady }) => {
  const {
    currentProjectId,
    setCurrentProjectId,
    addJson,
    setDynamicImgs,
    setCurrentProjectName,
  } = useBanner();
  const { setConfig, updateCanvasSize } = useConfig();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const { data: template, isLoading, error } = useProject(projectId ?? "");

  useEffect(() => {
    if (!isAuthReady) return;

    if (template && !currentProjectId) {
      let parsed: ProjectData | null = null;
      try {
        if (template.config_dev?.trim()) {
          parsed = JSON.parse(template.config_dev);
        }
        // console.log("Parsed project configuration:", parsed);
      } catch {
        console.error("Error parsing project configuration JSON");
      }

      const objects = parsed?.objects ?? [];
      const dynamicImgs = parsed?.dynamicImgs ?? [];

      if (parsed?.config?.canvasSize) {
        setConfig(parsed.config);
      } else if (parsed?.dimensions) {
        const { width, height } = parsed.dimensions;
        const newConfig = {
          ...defaultConfig,
          canvasSize: { width, height },
        };
        setConfig(newConfig);
        updateCanvasSize(width, height);
      } else {
        setConfig(defaultConfig);
      }

      addJson(objects);
      setDynamicImgs?.(dynamicImgs);
      setCurrentProjectId(projectId!);
      setCurrentProjectName(template.name || "Untitled Project");

      if (location.pathname !== `/${projectId}`) {
        navigate(`/${projectId}`, { replace: true });
      }
    }
  }, [
    template,
    currentProjectId,
    setCurrentProjectId,
    addJson,
    setDynamicImgs,
    setCurrentProjectName,
    setConfig,
    updateCanvasSize,
    navigate,
    projectId,
    isAuthReady,
  ]);

  if (!isAuthReady || isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (
    error
    // || !template
  ) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        gap={2}
      >
        <Typography variant="h6" color="error" textAlign="center">
          {error instanceof Error
            ? error.message
            : "Unknown error loading project"}
        </Typography>
        <Typography variant="h6" color="info" textAlign="center">
          Check your project ID in the URL
        </Typography>
      </Box>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <BannerArea />
      <ObjectProperties />
    </div>
  );
};

export default Layout;

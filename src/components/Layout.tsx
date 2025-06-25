// Layout.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import { useMode } from "../context/ModeContext";
import Sidebar from "./Sidebar";
import BannerArea from "./BannerArea";
import ObjectProperties from "./ObjectProperties";
import { useConfig } from "../context/ConfigContext";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useSupabaseProject } from "../utils/useSupabaseProject";
import { ProjectData } from "../types";

interface LayoutProps {
  isAuthReady: boolean;
}

const defaultConfig = {
  hiddenObjectIds: [],
  keyValuePairs: [
    { key: "title", value: "Назва продукту" },
    { key: "img", value: "https://placehold.co/300" },
    { key: "price", value: "1000" },
  ],
  canvasSize: {
    width: 1080,
    height: 1080,
  },
};

const Layout: React.FC<LayoutProps> = ({ isAuthReady }) => {
  const { mode } = useMode();
  const {
    currentProjectId,
    setCurrentProjectId,
    addJson,
    setDynamicImgs,
    setCurrentProjectName,
  } = useBanner();
  const { setConfig } = useConfig();
  const { getProject } = useSupabaseProject();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const [isCheckingProject, setIsCheckingProject] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;

    const tryLoadProject = async () => {
      if (!projectId) {
        setError("Project ID missing from URL");
        setIsCheckingProject(false);
        return;
      }

      // try {
      //   const key = `${projectId}.json`;
      //   const data = await downloadFromS3(key);

      //   if (data && typeof data === "object" && Array.isArray(data.objects)) {
      //     addJson(data.objects);
      //     setCurrentProjectId(projectId);
      //     setConfig(
      //       data.config || {
      //         hiddenObjectIds: [],
      //         keyValuePairs: [
      //           { key: "title", value: "Назва продукту" },
      //           { key: "img", value: "https://placehold.co/300" },
      //           { key: "price", value: "1000" },
      //         ],
      //       }
      //     );
      //     setDynamicImgs?.(data.dynamicImgs || []);
      //     navigate(`/${projectId}`, { replace: true });

      //     // await sync(projectId, data);
      //     // await syncProjectWithSupabase(projectId, data, config);
      //   } else {
      //     throw new Error("Invalid project data");
      //   }

      //

      try {
        const template = await getProject(projectId);
        if (!template) {
          throw new Error("Project not found");
        }

        let parsed: ProjectData | null = null;
        try {
          if (template.config_dev?.trim()) {
            parsed = JSON.parse(template.config_dev);
          }
        } catch {
          throw new Error("Error parsing project configuration JSON");
        }

        const objects = parsed?.objects ?? [];
        const dynamicImgs = parsed?.dynamicImgs ?? [];
        const config = parsed?.config ?? defaultConfig;

        addJson(objects);
        setDynamicImgs?.(dynamicImgs);
        setConfig(config);
        setCurrentProjectId(projectId);
        setCurrentProjectName(template.name || "Untitled Project");

        if (location.pathname !== `/${projectId}`) {
          navigate(`/${projectId}`, { replace: true });
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown error loading project";
        console.error("Error loading project:", err);
        setError(message);
      } finally {
        setIsCheckingProject(false);
      }
    };

    if (!projectId || location.pathname === "/") {
      setIsCheckingProject(false);
      return;
    }

    if (!currentProjectId) {
      tryLoadProject();
    }
  }, [projectId, currentProjectId, navigate, setCurrentProjectId, isAuthReady]);

  if (isCheckingProject) {
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

  if (error) {
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
          {error}
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
      <BannerArea key={mode} />
      <ObjectProperties />
    </div>
  );
};

export default Layout;

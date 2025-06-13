import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import { useMode } from "../context/ModeContext";
import Sidebar from "./Sidebar";
import BannerArea from "./BannerArea";
import ObjectProperties from "./ObjectProperties";
// import Instructions from "./Instructions";
// import InsertingProps from "./InsertingProps";
import ProjectDialog from "./UI/dialogs/ProjectDialog";
// import { downloadFromS3 } from "../S3/s3Storage";
import { useConfig } from "../context/ConfigContext";
import { CircularProgress, Box } from "@mui/material";
// import { useSyncProjectWithFeededify } from "../utils/useSyncProjectWithFeededify";
// import { useSyncProjectWithSupabase } from "../utils/useSyncProjectWithSupabase";
// import { syncProjectWithSupabase } from "../utils/syncProjectWithSupabase";
import { useSupabaseProject } from "../utils/useSupabaseProject";

const Layout: React.FC = () => {
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
  const [showDialog, setShowDialog] = useState(false);
  // const { sync } = useSyncProjectWithFeededify();
  // const { sync } = useSyncProjectWithSupabase();

  useEffect(() => {
    const tryLoadProject = async () => {
      if (!projectId) {
        setIsCheckingProject(false);
        setShowDialog(true);
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

        if (template?.config_dev) {
          const parsed = JSON.parse(template.config_dev);
          addJson(parsed.objects);
          setDynamicImgs?.(parsed.dynamicImgs || []);
          setConfig(parsed.config || {});
          setCurrentProjectId(projectId);
          setCurrentProjectName(template.name || "Untitled Project");
          navigate(`/${projectId}`, { replace: true });
        } else {
          throw new Error("Invalid config_dev format");
        }
      } catch (err) {
        console.error("Project not found or error occurred:", err);
        setShowDialog(true);
      } finally {
        setIsCheckingProject(false);
      }
    };

    if (!projectId) {
      setIsCheckingProject(false);
      setShowDialog(true);
      return;
    }

    if (currentProjectId === null && location.pathname === "/") {
      return;
    }

    if (!currentProjectId) {
      tryLoadProject();
    }
  }, [projectId, currentProjectId, navigate, setCurrentProjectId]);

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

  return (
    <>
      {!currentProjectId && showDialog && (
        <ProjectDialog onClose={() => setShowDialog(false)} />
      )}

      <div className="app">
        <Sidebar />
        <BannerArea key={mode} />
        <ObjectProperties />
      </div>
    </>
  );
};

export default Layout;

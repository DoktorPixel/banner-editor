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
import { downloadFromS3 } from "../S3/s3Storage";
import { useConfig } from "../context/ConfigContext";
import { CircularProgress, Box } from "@mui/material";
// import { useSyncProjectWithFeededify } from "../utils/useSyncProjectWithFeededify";
import { useSyncProjectWithSupabase } from "../utils/useSyncProjectWithSupabase";

const Layout: React.FC = () => {
  const { mode } = useMode();
  const { currentProjectName, setCurrentProjectName, addJson, setDynamicImgs } =
    useBanner();
  const { setConfig } = useConfig();
  const navigate = useNavigate();
  const { projectName } = useParams<{ projectName: string }>();
  const [isCheckingProject, setIsCheckingProject] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  // const { sync } = useSyncProjectWithFeededify();
  const { sync } = useSyncProjectWithSupabase();

  useEffect(() => {
    const tryLoadProject = async () => {
      if (!projectName) {
        setIsCheckingProject(false);
        setShowDialog(true);
        return;
      }

      try {
        const key = `projects/${projectName}.json`;
        const data = await downloadFromS3(key);

        if (data && typeof data === "object" && Array.isArray(data.objects)) {
          addJson(data.objects);
          setCurrentProjectName(projectName);
          setConfig(
            data.config || {
              hiddenObjectIds: [],
              keyValuePairs: [
                { key: "title", value: "Назва продукту" },
                { key: "img", value: "https://placehold.co/300" },
                { key: "price", value: "1000" },
              ],
            }
          );
          setDynamicImgs?.(data.dynamicImgs || []);
          navigate(`/project/${projectName}`, { replace: true });
          // Feededify
          await sync(projectName, data);
        } else {
          throw new Error("Invalid project data");
        }
      } catch (err) {
        console.error("Project not found or error occurred:", err);
        setShowDialog(true);
      } finally {
        setIsCheckingProject(false);
      }
    };

    if (!projectName) {
      setIsCheckingProject(false);
      setShowDialog(true);
      return;
    }

    if (currentProjectName === null && location.pathname === "/") {
      return;
    }

    if (!currentProjectName) {
      tryLoadProject();
    }
  }, [projectName, currentProjectName, navigate, setCurrentProjectName]);

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
      {!currentProjectName && showDialog && (
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

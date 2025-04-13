import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import { useMode } from "../context/ModeContext";
import Sidebar from "./Sidebar";
import BannerArea from "./BannerArea";
import ObjectProperties from "./ObjectProperties";
import Instructions from "./Instructions";
import InsertingProps from "./InsertingProps";
import ProjectDialog from "./UI/dialogs/ProjectDialog";
import { downloadFromS3 } from "../S3/s3Storage";
import { useConfig } from "../context/ConfigContext";
import { CircularProgress, Box } from "@mui/material";

const Layout: React.FC = () => {
  const { mode } = useMode();
  const { currentProjectName, setCurrentProjectName, addJson } = useBanner();
  const { setConfig } = useConfig();
  const navigate = useNavigate();
  const { projectName } = useParams<{ projectName: string }>();
  const [isCheckingProject, setIsCheckingProject] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

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
            data.config || [
              {
                function: "price",
                key: "price",
                value1: "sale_price",
                value2: "discount",
              },
            ]
          );
          navigate(`/project/${projectName}`, { replace: true });
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
        {mode === "dev" ? <Sidebar /> : <Instructions />}
        <BannerArea key={mode} />
        {mode === "dev" ? <ObjectProperties /> : <InsertingProps />}
      </div>
    </>
  );
};

export default Layout;

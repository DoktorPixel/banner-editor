import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import { useMode } from "../context/ModeContext";
import Sidebar from "./Sidebar";
import BannerArea from "./BannerArea";
import ObjectProperties from "./ObjectProperties";
import Instructions from "./Instructions";
import InsertingProps from "./InsertingProps";
import ProjectDialog from "./UI/dialogs/ProjectDialog";

const Layout: React.FC = () => {
  const { mode } = useMode();
  const { currentProjectName } = useBanner();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentProjectName) {
      const newPath = `/project/${currentProjectName}`;
      if (window.location.pathname !== newPath) {
        navigate(newPath, { replace: true });
      }
    }
  }, [currentProjectName, navigate]);

  return (
    <>
      {!currentProjectName && <ProjectDialog onClose={() => {}} />}

      <div className="app">
        {mode === "dev" ? <Sidebar /> : <Instructions />}
        <BannerArea key={mode} />
        {mode === "dev" ? <ObjectProperties /> : <InsertingProps />}
      </div>
    </>
  );
};

export default Layout;

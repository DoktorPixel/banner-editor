import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import UploadToS3Button from "./UI/s3-components/UploadToS3";
import Switch from "@mui/material/Switch";
import { useMode } from "../context/ModeContext";

import { CircularProgress, Button } from "@mui/material";

const Header: React.FC = () => {
  const { currentProjectName, clearProject } = useBanner();
  const { mode, toggleMode } = useMode();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    setIsLoading(true);
    clearProject();
    setIsLoading(false);
  };

  return (
    <div className="header">
      <div className="project-name">
        <h1>Шаблон: "{currentProjectName || "Без назви"}"</h1>
      </div>
      <UploadToS3Button />
      <Button
        onClick={handleUpload}
        disabled={isLoading}
        startIcon={isLoading && <CircularProgress size={20} />}
      >
        закрити проект
      </Button>
      <div className="mode-switch-wrapper">
        <Switch
          className="mode-switch"
          checked={mode === "test"}
          onChange={toggleMode}
          inputProps={{ "aria-label": "Mode switch" }}
        />
      </div>
    </div>
  );
};

export default Header;

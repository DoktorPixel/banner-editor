import { useBanner } from "../context/BannerContext";
import UploadToS3Button from "./UI/UploadToS3";
import Switch from "@mui/material/Switch";
import { useMode } from "../context/ModeContext";

const Header: React.FC = () => {
  const { currentProjectName } = useBanner();
  const { mode, toggleMode } = useMode();

  return (
    <div className="header">
      <div className="project-name">
        <h1>Шаблон: "{currentProjectName || "Без назви"}"</h1>
      </div>
      <UploadToS3Button />
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

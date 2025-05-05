import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { uploadToS3, downloadFromS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { ProjectData } from "../../../types";
import { useConfig } from "../../../context/ConfigContext";
import { useNavigate } from "react-router-dom";
import { useSyncProjectWithFeededify } from "../../../utils/useSyncProjectWithFeededify";

const ProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const { setConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { sync } = useSyncProjectWithFeededify();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const { addJson, setCurrentProjectName, clearHistory } = useBanner();

  const validateProjectName = (name: string): boolean => {
    if (name.length < 6) {
      setError("The project name must contain at least 6 characters.");
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setError(
        "The project name must contain only Latin letters, numbers, hyphens or underscores."
      );
      return false;
    }
    if (name.length > 36) {
      setError("The project name cannot exceed 36 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleCreateNewProject = async () => {
    if (!validateProjectName(projectName)) return;

    setLoading(true);
    try {
      const key = `projects/${projectName}.json`;

      const existingProject = await downloadFromS3(key);
      if (existingProject) {
        setSnackbar({
          open: true,
          message: "A project with that name already exists!",
        });
        return;
      }

      const initialData: ProjectData = { objects: [] };
      await uploadToS3(key, initialData);
      // Feededify
      await sync(projectName, initialData);
      setCurrentProjectName(projectName);
      navigate(`/project/${projectName}`, { replace: true });

      clearHistory();
      setSnackbar({
        open: true,
        message: "The new project has been created successfully!",
      });
      onClose();
    } catch (error) {
      console.error("Project creation error:", error);
      setSnackbar({
        open: true,
        message: "Failed to create a new project.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExistingProject = async () => {
    if (!validateProjectName(projectName)) return;

    setLoading(true);
    try {
      const key = `projects/${projectName}.json`;
      const data = await downloadFromS3(key);

      if (data && typeof data === "object" && Array.isArray(data.objects)) {
        addJson(data.objects);
        setCurrentProjectName(projectName);
        navigate(`/project/${projectName}`, { replace: true });
        // Feededify
        await sync(projectName, data);
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
        setSnackbar({
          open: true,
          message: "Project uploaded successfully!",
        });
        onClose();
      } else {
        setSnackbar({
          open: true,
          message: "Error: Project not found, check the name.",
        });
      }
    } catch (error) {
      console.error("Project upload error:", error);
      setSnackbar({
        open: true,
        message: "The project could not be loaded.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateProjectName(projectName);
  }, [projectName]);

  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle sx={{ minWidth: "380px" }}>Choose an action</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => validateProjectName(projectName)}
            disabled={loading}
            margin="normal"
            error={!!error}
            helperText={error}
            className="project-dialog-input"
          />
        </DialogContent>

        <DialogActions
          style={{
            position: "relative",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            message={snackbar.message}
            sx={{
              position: "relative",
              top: "-15px!important",
              width: "100%",
              textAlign: "center",
            }}
          />
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <Button
              onClick={handleCreateNewProject}
              color="primary"
              disabled={loading || !!error || projectName.length < 6}
              fullWidth
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                "Create a new project"
              )}
            </Button>
            <Button
              onClick={handleLoadExistingProject}
              color="secondary"
              disabled={loading || !!error || projectName.length < 6}
              fullWidth
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              {loading ? <CircularProgress size={20} /> : "Upload existing"}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectDialog;

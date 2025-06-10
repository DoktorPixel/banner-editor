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
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { uploadToS3, downloadFromS3 } from "../../../S3/s3Storage";
import { useBanner } from "../../../context/BannerContext";
import { ProjectData } from "../../../types";
import { useConfig } from "../../../context/ConfigContext";
import { useNavigate } from "react-router-dom";
import { useSyncProjectWithSupabase } from "../../../utils/useSyncProjectWithSupabase";

const ProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [sizePreset, setSizePreset] = useState<
    "square" | "portrait" | "custom"
  >("square");
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const { setConfig, updateCanvasSize } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { sync } = useSyncProjectWithSupabase();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const { addJson, setCurrentProjectName, clearHistory } = useBanner();
  // refactoring

  const width =
    sizePreset === "square"
      ? 1080
      : sizePreset === "portrait"
      ? 1080
      : customWidth;
  const height =
    sizePreset === "square"
      ? 1080
      : sizePreset === "portrait"
      ? 1920
      : customHeight;

  const validateProjectName = (name: string): boolean => {
    if (name.length < 4) {
      setError("The project name must contain at least 4 characters.");
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

      const initialData: ProjectData = {
        objects: [],
        config: {
          hiddenObjectIds: [],
          keyValuePairs: [
            { key: "title", value: "Назва продукту" },
            { key: "img", value: "https://placehold.co/300" },
            { key: "price", value: "1000" },
          ],
          canvasSize: {
            width,
            height,
          },
        },
      };

      setConfig(initialData.config);
      updateCanvasSize(width, height);
      await uploadToS3(key, initialData);
      // Supabase
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
        setConfig({
          hiddenObjectIds: data.config?.hiddenObjectIds ?? [],
          keyValuePairs: data.config?.keyValuePairs ?? [
            { key: "title", value: "Назва продукту" },
            { key: "img", value: "https://placehold.co/300" },
            { key: "price", value: "1000" },
          ],
          canvasSize: data.config?.canvasSize ?? {
            width: 1080,
            height: 1080,
          },
        });
        updateCanvasSize(
          data.config?.canvasSize?.width ?? 1080,
          data.config?.canvasSize?.height ?? 1080
        );
        // Feededify
        setSnackbar({
          open: true,
          message: "Project uploaded successfully!",
        });
        await sync(projectName, data);
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

          {/*  */}

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Select banner size
          </Typography>
          <RadioGroup
            value={sizePreset}
            onChange={(e) => setSizePreset(e.target.value as typeof sizePreset)}
          >
            <FormControlLabel
              value="square"
              control={<Radio />}
              label="1080x1080 (1:1)"
            />
            <FormControlLabel
              value="portrait"
              control={<Radio />}
              label="1080x1920 (9:16)"
            />
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label="Custom"
            />
          </RadioGroup>

          {sizePreset === "custom" && (
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                gap: "16px",
                marginTop: "8px",
                maxWidth: "220px",
              }}
            >
              <TextField
                type="number"
                label="Width"
                value={customWidth}
                onChange={(e) => setCustomWidth(parseInt(e.target.value))}
              />
              <TextField
                type="number"
                label="Height"
                value={customHeight}
                onChange={(e) => setCustomHeight(parseInt(e.target.value))}
              />
            </div>
          )}
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
              disabled={loading || !!error || projectName.length < 4}
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
              disabled={loading || !!error || projectName.length < 4}
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

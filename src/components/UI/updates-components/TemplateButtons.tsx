import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSupabaseProject } from "../../../utils/useSupabaseProject";
import { useBanner } from "../../../context/BannerContext";

export const DeployTemplateButton: React.FC = () => {
  const { currentProjectId } = useBanner();
  const { deployTemplate, loading } = useSupabaseProject();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDeploy = async () => {
    try {
      await deployTemplate(currentProjectId || "");
      setSnackbar({
        open: true,
        message: "✅ Template successfully published!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "❌ Failed to publish template.",
        severity: "error",
      });
      console.error("❌ Failed to load project:", error);
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        variant="contained"
        color="primary"
        sx={{ textTransform: "none", padding: "4px 6px 2px 6px" }}
      >
        {loading ? "Deploying..." : "Publish Template"}
      </Button>

      {/* Диалог подтверждения */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ margin: "0 auto" }}>Confirm publication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to publish the project? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ margin: "0 auto", paddingBottom: "22px" }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={loading}
            color="primary"
            variant="contained"
          >
            {loading ? "Deploying..." : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

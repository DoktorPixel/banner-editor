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
import { useConfig } from "../../../context/ConfigContext";
import { useTranslation } from "react-i18next";
import { collectParamsFromObjects } from "../../../utils/collectParams";

export const DeployTemplateButton: React.FC = () => {
  const { currentProjectId, objects } = useBanner();
  const { setAttributListenerProps } = useConfig();
  const { deployTemplate } = useSupabaseProject();
  const { t } = useTranslation();
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
    if (!currentProjectId) return;

    try {
      const params = collectParamsFromObjects(objects);
      setAttributListenerProps(params);

      await deployTemplate.mutateAsync({
        templateId: currentProjectId,
        params,
      });

      setSnackbar({
        open: true,
        message: `✅ ${t("deployTemplate.successMessage")} `,
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Failed to publish template:", error);
      setSnackbar({
        open: true,
        message: `❌ ${t("deployTemplate.errorMessage")} `,
        severity: "error",
      });
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setConfirmOpen(true)}
        disabled={deployTemplate.isPending}
        variant="contained"
        color="primary"
        sx={{
          textTransform: "none",
          padding: "4px 6px 2px 6px",
          minWidth: "128px",
        }}
      >
        {deployTemplate.isPending
          ? t("deployTemplate.deploying")
          : t("deployTemplate.publishTemplate")}
      </Button>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ margin: "0 auto" }}>
          {" "}
          {t("deployTemplate.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t("deployTemplate.subTitle")}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ margin: "0 auto", paddingBottom: "22px" }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={deployTemplate.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={deployTemplate.isPending}
            color="primary"
            variant="contained"
          >
            {deployTemplate.isPending
              ? t("deployTemplate.deploying")
              : t("publish")}
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

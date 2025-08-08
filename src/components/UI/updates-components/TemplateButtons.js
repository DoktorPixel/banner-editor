import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, } from "@mui/material";
import { useSupabaseProject } from "../../../utils/useSupabaseProject";
import { useBanner } from "../../../context/BannerContext";
import { useTranslation } from "react-i18next";
export const DeployTemplateButton = () => {
    const { currentProjectId } = useBanner();
    const { deployTemplate } = useSupabaseProject();
    const { t } = useTranslation();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const handleDeploy = async () => {
        if (!currentProjectId)
            return;
        try {
            await deployTemplate.mutateAsync(currentProjectId);
            setSnackbar({
                open: true,
                message: `✅ ${t("deployTemplate.successMessage")} `,
                severity: "success",
            });
        }
        catch (error) {
            console.error("❌ Failed to publish template:", error);
            setSnackbar({
                open: true,
                message: `❌ ${t("deployTemplate.errorMessage")} `,
                severity: "error",
            });
        }
        finally {
            setConfirmOpen(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setConfirmOpen(true), disabled: deployTemplate.isPending, variant: "contained", color: "primary", sx: {
                    textTransform: "none",
                    padding: "4px 6px 2px 6px",
                    minWidth: "128px",
                }, children: deployTemplate.isPending
                    ? t("deployTemplate.deploying")
                    : t("deployTemplate.publishTemplate") }), _jsxs(Dialog, { open: confirmOpen, onClose: () => setConfirmOpen(false), children: [_jsxs(DialogTitle, { sx: { margin: "0 auto" }, children: [" ", t("deployTemplate.title")] }), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: t("deployTemplate.subTitle") }) }), _jsxs(DialogActions, { sx: { margin: "0 auto", paddingBottom: "22px" }, children: [_jsx(Button, { onClick: () => setConfirmOpen(false), disabled: deployTemplate.isPending, children: t("cancel") }), _jsx(Button, { onClick: handleDeploy, disabled: deployTemplate.isPending, color: "primary", variant: "contained", children: deployTemplate.isPending
                                    ? t("deployTemplate.deploying")
                                    : t("publish") })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 4000, onClose: () => setSnackbar((prev) => ({ ...prev, open: false })), anchorOrigin: { vertical: "bottom", horizontal: "center" }, children: _jsx(Alert, { onClose: () => setSnackbar((prev) => ({ ...prev, open: false })), severity: snackbar.severity, sx: { width: "100%" }, children: snackbar.message }) })] }));
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import JSONDialog from "../dialogs/JSONDialog";
import { useBanner } from "../../../context/BannerContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExportInJSON from "../export-components/ExportInJSON";
import { ExportToHTMLButton } from "../export-components/ExportToHTMLButton";
import { useTranslation } from "react-i18next";
const DevPanel = () => {
    const { addJson } = useBanner();
    const [dialogState, setDialogState] = useState({
        isImageDialogOpen: false,
        isJsonDialogOpen: false,
    });
    const { t } = useTranslation();
    const openDialog = (type) => setDialogState((prev) => ({ ...prev, [type]: true }));
    const closeDialog = (type) => setDialogState((prev) => ({ ...prev, [type]: false }));
    const handleLoadJson = (jsonData) => {
        addJson(jsonData);
    };
    return (_jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: "10px" }, children: [_jsxs(Button, { variant: "contained", color: "primary", onClick: () => openDialog("isJsonDialogOpen"), children: [t("devPanelButtons.importJSON"), _jsx(CloudUploadIcon, { sx: { marginLeft: "10px" } })] }), _jsx(ExportInJSON, {}), _jsx(ExportToHTMLButton, {}), _jsx(JSONDialog, { open: dialogState.isJsonDialogOpen, onClose: () => closeDialog("isJsonDialogOpen"), onLoad: handleLoadJson })] }));
};
export default DevPanel;

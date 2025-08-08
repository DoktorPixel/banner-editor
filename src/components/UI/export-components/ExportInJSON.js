import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useBanner } from "../../../context/BannerContext";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
const ExportInJSON = () => {
    const { objects, clearSelection, clearChildSelection } = useBanner();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const { t } = useTranslation();
    const handleExport = async () => {
        setIsLoading(true);
        try {
            const objectsJSON = JSON.stringify(objects, null, 2);
            await navigator.clipboard.writeText(objectsJSON);
            setNotification("Data copied to clipboard successfully!");
        }
        catch (clipboardError) {
            console.error("Error copying to clipboard.", clipboardError);
            setNotification("Error copying to clipboard.");
        }
        finally {
            setTimeout(() => setNotification(null), 2000);
            setIsLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(LoadingButton, { onClick: () => {
                    clearSelection();
                    clearChildSelection();
                    handleExport();
                }, variant: "contained", color: "primary", loading: isLoading, children: isLoading ? (t("sending")) : (_jsxs(_Fragment, { children: [t("devPanelButtons.exportInJSON"), _jsx(SendIcon, { sx: { marginLeft: "10px" } })] })) }), notification && (_jsx(Typography, { variant: "body2", color: "success.main", sx: { fontWeight: "bold" }, children: notification }))] }));
};
export default ExportInJSON;

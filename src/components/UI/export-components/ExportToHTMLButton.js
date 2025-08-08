import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingButton from "@mui/lab/LoadingButton";
import { useBanner } from "../../../context/BannerContext";
import { useConfig } from "../../../context/ConfigContext";
import { ExportToHTML } from "./ExportToHTML";
import { useTranslation } from "react-i18next";
export const ExportToHTMLButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState("");
    const { objects, dynamicImgs } = useBanner();
    const { config } = useConfig();
    const { t } = useTranslation();
    const handleExport = async () => {
        try {
            setIsLoading(true);
            const html = ExportToHTML(objects, config, dynamicImgs);
            await navigator.clipboard.writeText(html);
            setNotification("HTML successfully copied to clipboard!");
        }
        catch (error) {
            console.error("Error while exporting:", error);
            setNotification("Error copying HTML");
        }
        finally {
            setIsLoading(false);
            setTimeout(() => setNotification(""), 3000);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(LoadingButton, { onClick: handleExport, variant: "contained", color: "primary", loading: isLoading, endIcon: _jsx(ContentCopyIcon, {}), children: isLoading ? t("coping") : t("devPanelButtons.exportInHTML") }), notification && (_jsx(Typography, { variant: "body2", color: "success.main", sx: { mt: 2, fontWeight: "bold" }, children: notification }))] }));
};

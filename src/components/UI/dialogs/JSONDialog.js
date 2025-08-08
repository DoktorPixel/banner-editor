import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const JSONDialog = ({ open, onClose, onLoad }) => {
    const [jsonContent, setJsonContent] = useState("");
    const { t } = useTranslation();
    const handleLoad = () => {
        try {
            const parsedJson = JSON.parse(jsonContent);
            onLoad(parsedJson);
            setJsonContent("");
            onClose();
        }
        catch (error) {
            console.error("Invalid JSON:", error);
            alert("Invalid JSON. Check the data structure.");
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, fullWidth: true, children: [_jsxs(DialogTitle, { children: [" ", t("devPanelButtons.importJSON")] }), _jsx(DialogContent, { children: _jsx(TextField, { autoFocus: true, margin: "dense", label: "Insert JSON", fullWidth: true, multiline: true, rows: 10, value: jsonContent, onChange: (e) => setJsonContent(e.target.value) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, color: "secondary", children: t("cancel") }), _jsx(Button, { onClick: handleLoad, color: "primary", children: t("download") })] })] }));
};
export default JSONDialog;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, } from "@mui/material";
import { useTranslation } from "react-i18next";
const NameDialog = ({ open, name, onChange, onClose, onSave, }) => {
    const { t } = useTranslation();
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsx(DialogTitle, { children: t("dialogs.nameDialog.title") }), _jsx(DialogContent, { children: _jsx(TextField, { autoFocus: true, margin: "dense", label: t("dialogs.nameDialog.placeholder") ?? "Name", fullWidth: true, value: name, onChange: onChange, slotProps: {
                        input: {
                            sx: {
                                height: 54,
                                padding: "2px",
                            },
                        },
                    } }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, color: "secondary", children: t("cancel") ?? "Cancel" }), _jsx(Button, { onClick: onSave, color: "primary", children: t("save") ?? "Save" })] })] }));
};
export default NameDialog;

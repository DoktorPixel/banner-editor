import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, } from "@mui/material";
const Sidebar = () => {
    const { addObject, undo, redo, canUndo, canRedo } = useBanner();
    const [isTextDialogOpen, setTextDialogOpen] = useState(false);
    const [isImageDialogOpen, setImageDialogOpen] = useState(false);
    const [textContent, setTextContent] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const openTextDialog = () => setTextDialogOpen(true);
    const closeTextDialog = () => {
        setTextDialogOpen(false);
        setTextContent("");
    };
    const handleAddText = () => {
        addObject({
            id: Date.now(),
            type: "text",
            x: 50,
            y: 50,
            content: textContent || "Текст",
            fontSize: 16,
            color: "#000000",
        });
        closeTextDialog();
    };
    const openImageDialog = () => setImageDialogOpen(true);
    const closeImageDialog = () => {
        setImageDialogOpen(false);
        setImageSrc("");
    };
    const handleAddImage = () => {
        addObject({
            id: Date.now(),
            type: "image",
            x: 50,
            y: 50,
            src: imageSrc || "https://via.placeholder.com/300",
        });
        closeImageDialog();
    };
    return (_jsxs(Stack, { spacing: 2, className: "sidebar", children: [_jsx(Button, { variant: "contained", color: "primary", onClick: openTextDialog, children: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0442\u0435\u043A\u0441\u0442" }), _jsx(Button, { variant: "contained", color: "secondary", onClick: openImageDialog, children: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F" }), _jsx(Button, { variant: "outlined", color: "primary", onClick: undo, disabled: !canUndo, children: "\u041D\u0430\u0437\u0430\u0434" }), _jsx(Button, { variant: "outlined", color: "secondary", onClick: redo, disabled: !canRedo, children: "\u0412\u043F\u0435\u0440\u0435\u0434" }), _jsxs(Dialog, { open: isTextDialogOpen, onClose: closeTextDialog, children: [_jsx(DialogTitle, { children: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0442\u0435\u043A\u0441\u0442" }), _jsx(DialogContent, { children: _jsx(TextField, { autoFocus: true, margin: "dense", label: "\u0422\u0435\u043A\u0441\u0442", fullWidth: true, value: textContent, onChange: (e) => setTextContent(e.target.value) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: closeTextDialog, color: "secondary", children: "\u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438" }), _jsx(Button, { onClick: handleAddText, color: "primary", children: "\u0414\u043E\u0434\u0430\u0442\u0438" })] })] }), _jsxs(Dialog, { open: isImageDialogOpen, onClose: closeImageDialog, children: [_jsx(DialogTitle, { children: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F" }), _jsx(DialogContent, { children: _jsx(TextField, { autoFocus: true, margin: "dense", label: "URL \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F", fullWidth: true, value: imageSrc, onChange: (e) => setImageSrc(e.target.value) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: closeImageDialog, color: "secondary", children: "\u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438" }), _jsx(Button, { onClick: handleAddImage, color: "primary", children: "\u0414\u043E\u0434\u0430\u0442\u0438" })] })] })] }));
};
export default Sidebar;

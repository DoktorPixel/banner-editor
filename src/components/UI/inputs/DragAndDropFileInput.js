import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const DragAndDropFileInput = ({ value, onChange, accept = "image/*", disabled = false, }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);
    const handleDragOver = (e) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (accept && !file.type.match(accept)) {
                console.error("Invalid file type");
                return;
            }
            onChange(file);
        }
    };
    const handleFileInputChange = (e) => {
        if (!disabled && e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            onChange(file);
        }
    };
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    return (_jsxs(Box, { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onClick: handleClick, sx: {
            border: isDragging ? "2px dashed #3f51b5" : "1px solid #ccc",
            borderRadius: "4px",
            padding: "16px",
            textAlign: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            backgroundColor: isDragging ? "#f0f8ff" : "transparent",
            position: "relative",
            width: "100%",
        }, children: [_jsx(CloudUploadIcon, { fontSize: "large", color: isDragging ? "primary" : "inherit" }), _jsx(Box, { mt: 2, children: value ? (_jsx(Box, { display: "flex", alignItems: "center", justifyContent: "center", children: _jsx(Typography, { variant: "body2", sx: { mr: 1 }, children: value.name }) })) : (_jsx(Typography, { variant: "body2", color: "textSecondary", children: "Drag or select an image" })) }), _jsx("input", { ref: inputRef, type: "file", accept: accept, style: { display: "none" }, onChange: handleFileInputChange, disabled: disabled })] }));
};
export default DragAndDropFileInput;

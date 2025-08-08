import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Popover } from "@mui/material";
export const HoverZoomImage = ({ src, alt = "", previewSize = 250, }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMouseLeave = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (_jsxs(_Fragment, { children: [_jsx("img", { src: src, alt: alt, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, style: {
                    width: 64,
                    height: 64,
                    objectFit: "contain",
                    borderRadius: 8,
                    cursor: "zoom-in",
                } }), _jsx(Popover, { open: open, anchorEl: anchorEl, onClose: handleMouseLeave, anchorOrigin: {
                    vertical: "top",
                    horizontal: "left",
                }, transformOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                }, PaperProps: {
                    onMouseLeave: handleMouseLeave,
                    style: {
                        background: "transparent",
                        boxShadow: "none",
                    },
                }, disableAutoFocus: true, disableEnforceFocus: true, disableRestoreFocus: true, children: _jsx("img", { src: src, alt: alt, style: {
                        width: previewSize,
                        height: previewSize,
                        objectFit: "contain",
                        borderRadius: 8,
                        border: "2px solid #ddd",
                    } }) })] }));
};

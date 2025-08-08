import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, IconButton, Typography } from "@mui/material";
import { Add, Remove, Search } from "@mui/icons-material";
import { useCallback } from "react";
export const ZoomControl = ({ scale, setScale, min = 0.4, max = 2, step = 0.1, }) => {
    const percent = Math.round(scale * 100);
    const handleZoom = useCallback((direction) => {
        const delta = direction === "in" ? step : -step;
        const newScale = Math.max(min, Math.min(max, scale + delta));
        setScale(parseFloat(newScale.toFixed(3)));
    }, [scale, setScale, step, min, max]);
    return (_jsxs(Box, { display: "flex", alignItems: "center", sx: {
            userSelect: "none",
            marginLeft: "-5px",
        }, children: [_jsx(IconButton, { size: "small", onClick: () => handleZoom("out"), disabled: scale <= min, children: _jsx(Remove, { fontSize: "small" }) }), _jsxs(Box, { display: "flex", alignItems: "center", sx: {
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    padding: "4px 8px 4px 3px",
                    // width: "65px",
                }, children: [" ", _jsx(Search, { fontSize: "small", sx: { opacity: 0.7 } }), _jsxs(Typography, { variant: "body2", fontWeight: 400, children: [percent, "%"] })] }), _jsx(IconButton, { size: "small", onClick: () => handleZoom("in"), disabled: scale >= max, children: _jsx(Add, { fontSize: "small" }) })] }));
};

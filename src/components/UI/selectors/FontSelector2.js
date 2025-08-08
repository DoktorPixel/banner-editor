import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TextField, List, ListItem, ListItemText, InputAdornment, } from "@mui/material";
import * as WebFont from "webfontloader";
import { useState, useCallback } from "react";
import { fonts } from "../../../constants/fonts";
import SearchIcon from "@mui/icons-material/Search";
const FontSelector2 = ({ value, onChange, previewText, }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loadedFonts, setLoadedFonts] = useState({});
    const loadFont = useCallback((font) => {
        if (loadedFonts[font])
            return;
        WebFont.load({
            google: { families: [font] },
            active: () => {
                setLoadedFonts((prev) => ({ ...prev, [font]: true }));
            },
        });
    }, [loadedFonts]);
    const filteredFonts = fonts.filter((font) => font.label.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: "8px" }, children: [_jsx("div", { className: "grey-line" }), _jsx(TextField, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Type to find a font", variant: "outlined", size: "small", sx: { backgroundColor: "#F1F1F1" }, InputProps: {
                    endAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, { fontSize: "small" }) })),
                } }), _jsx(List, { sx: {
                    maxHeight: "calc(100vh - 380px)",
                    overflowY: "scroll",
                    borderRadius: 1,
                }, children: filteredFonts.map((font) => {
                    loadFont(font.value);
                    return (_jsx(ListItem, { component: "div", onClick: () => onChange(font.value), disableGutters: true, sx: {
                            padding: "0 0 0 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            backgroundColor: font.value === value ? "#ddd" : "transparent",
                        }, children: _jsx(ListItemText, { primary: previewText.trim().substring(0, 14) || font.label, disableTypography: true, sx: {
                                fontSize: "22px",
                                fontFamily: loadedFonts[font.value] ? font.value : "inherit",
                            } }) }, font.value));
                }) })] }));
};
export default FontSelector2;

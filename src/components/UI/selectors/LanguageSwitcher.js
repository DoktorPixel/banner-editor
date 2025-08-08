import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useTranslation } from "react-i18next";
const LanguageSwitcher = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [language, setLanguage] = useState("en");
    const { i18n } = useTranslation();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelect = (lang) => {
        setLanguage(lang);
        handleClose();
        i18n.changeLanguage(lang);
    };
    return (_jsxs("div", { className: "language-switcher", children: [_jsx(LanguageOutlinedIcon, { color: "primary", sx: { fontSize: 32 } }), _jsx(Button, { onClick: handleClick, variant: "contained", sx: {
                    textTransform: "none",
                    padding: "4px 8px 2px 8px",
                    minWidth: "auto",
                }, children: language }), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleClose, children: [_jsx(MenuItem, { onClick: () => handleSelect("en"), children: "(en) English" }), _jsx(MenuItem, { onClick: () => handleSelect("ua"), children: "(ua) \u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430" })] })] }));
};
export default LanguageSwitcher;

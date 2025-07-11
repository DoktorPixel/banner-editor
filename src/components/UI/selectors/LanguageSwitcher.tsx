import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

const LanguageSwitcher: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState<"EN" | "UA">("EN");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (lang: "EN" | "UA") => {
    setLanguage(lang);
    handleClose();
    // logic to handle language
  };

  return (
    <div className="language-switcher">
      <LanguageOutlinedIcon color="primary" sx={{ fontSize: 30 }} />
      <Button
        onClick={handleClick}
        variant="contained"
        sx={{ textTransform: "none", padding: "2px 8px", minWidth: "auto" }}
      >
        {language}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect("EN")}>(EN) English</MenuItem>
        <MenuItem onClick={() => handleSelect("UA")}>(UA) Ukrainian</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;

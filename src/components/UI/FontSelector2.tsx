import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import * as WebFont from "webfontloader";
import { useState, useCallback } from "react";
import { fonts } from "../../constants/fonts";
import SearchIcon from "@mui/icons-material/Search";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const FontSelector2: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadedFonts, setLoadedFonts] = useState<Record<string, boolean>>({});

  const loadFont = useCallback(
    (font: string) => {
      if (loadedFonts[font]) return;

      WebFont.load({
        google: { families: [font] },
        active: () => {
          setLoadedFonts((prev) => ({ ...prev, [font]: true }));
        },
      });
    },
    [loadedFonts]
  );

  const filteredFonts = fonts.filter((font) =>
    font.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div className="grey-line"></div>
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Type to find a font"
        variant="outlined"
        size="small"
        sx={{ backgroundColor: "#F1F1F1" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <List
        sx={{
          maxHeight: 210,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        {filteredFonts.map((font) => {
          loadFont(font.value);

          return (
            <ListItem
              key={font.value}
              component="div"
              onClick={() => onChange(font.value)}
              disableGutters
              sx={{
                padding: "0 0 0 10px",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: font.value === value ? "#ddd" : "transparent",
              }}
            >
              <ListItemText
                primary={font.label}
                disableTypography
                sx={{
                  fontSize: "24px",
                  fontFamily: loadedFonts[font.value] ? font.value : "inherit",
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default FontSelector2;

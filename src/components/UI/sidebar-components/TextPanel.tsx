import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  // Typography,
  // List,
  // ListItem,
  // ListItemText,
} from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import FontSelector2 from "../FontSelector2";

// const fonts = ["Roboto", "Open Sans", "Rubik", "Montserrat", "Lato"];

const TextPanel: React.FC = () => {
  const [textContent, setTextContent] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  const [selectedFont, setSelectedFont] = useState("Roboto");

  const { addObject } = useBanner();

  const handleAddText = () => {
    if (!textContent.trim()) return;

    addObject({
      id: Date.now(),
      type: "text",
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      content: textContent,
      fontSize: 16,
      fontFamily: selectedFont,
      color: "#000000",
      name: "",
    });

    setTextContent(""); // Очистка поля
  };

  // const filteredFonts = fonts.filter((font) =>
  //   font.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
      }}
    >
      <TextField
        label="Type text here"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        fullWidth
        // rows={4}
        maxRows={5}
        multiline
        sx={{ backgroundColor: "#F1F1F1" }}
      />

      <Button
        variant="contained"
        onClick={handleAddText}
        disabled={!textContent.trim()}
      >
        Add Text
      </Button>

      <FontSelector2 value={selectedFont} onChange={setSelectedFont} />

      {/* <TextField
        label="Type to find a font"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />

      <List
        sx={{
          maxHeight: 150,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        {filteredFonts.map((font) => (
          <ListItem
            key={font}
            button
            selected={font === selectedFont}
            onClick={() => setSelectedFont(font)}
          >
            <ListItemText
              primary="Hello World"
              primaryTypographyProps={{ style: { fontFamily: font } }}
            />
          </ListItem>
        ))}
      </List> */}
    </Box>
  );
};

export default TextPanel;

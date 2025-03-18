import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useBanner } from "../../../context/BannerContext";
import FontSelector2 from "../FontSelector2";

const TextPanel: React.FC = () => {
  const [textContent, setTextContent] = useState("");

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

    setTextContent("");
  };

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
        // rows={2}
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

      <FontSelector2
        value={selectedFont}
        onChange={setSelectedFont}
        previewText={textContent}
      />
    </Box>
  );
};

export default TextPanel;

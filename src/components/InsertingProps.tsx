import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const InsertingProps: React.FC = () => {
  const { objects, updateObject } = useBanner();

  const [keyValuePairs, setKeyValuePairs] = useState([
    { key: "title", value: "Назва продукту" },
    { key: "img", value: "https://via.placeholder.com/300" },
    { key: "price", value: "1000" },
  ]);

  const handleKeyChange = (index: number, newKey: string) => {
    const updatedPairs = keyValuePairs.map((pair, i) =>
      i === index ? { ...pair, key: newKey } : pair
    );
    setKeyValuePairs(updatedPairs);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updatedPairs = keyValuePairs.map((pair, i) =>
      i === index ? { ...pair, value: newValue } : pair
    );
    setKeyValuePairs(updatedPairs);
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };
  const removeKeyValuePair = (index: number) => {
    const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(updatedPairs);
  };

  const replaceDynamicValues = () => {
    keyValuePairs.forEach(({ key, value }) => {
      if (!key.trim() || !value.trim()) {
        // alert("Please enter both key and value.");
        return;
      }

      const dynamicKey = `{{${key}}}`;

      objects.forEach((obj) => {
        let isUpdated = false;
        const updates: Partial<typeof obj> = {};

        if (obj.content && obj.content.includes(dynamicKey)) {
          updates.content = obj.content.replaceAll(dynamicKey, value);
          isUpdated = true;
        }

        if (obj.src && obj.src.includes(dynamicKey)) {
          updates.src = obj.src.replaceAll(dynamicKey, value);
          isUpdated = true;
        }

        if (isUpdated) {
          updateObject(obj.id, updates);
        }
      });
    });
  };

  return (
    <Box className="inserting-props">
      <Typography variant="h5" gutterBottom>
        Замінити динамічні значення:
      </Typography>
      <div className="key-value-wrapper">
        {keyValuePairs.map((pair, index) => (
          <div className="key-value-pair" key={index}>
            <TextField
              fullWidth
              label="Key"
              value={pair.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              placeholder="введіть ключ (наприклад, title)"
              margin="dense"
            />
            <TextField
              fullWidth
              label="Value"
              value={pair.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              placeholder="введіть значення (наприклад, Назва продукту)"
              margin="dense"
            />
            <IconButton
              size="small"
              style={{ position: "absolute", top: -8, right: -7 }}
              onClick={() => removeKeyValuePair(index)}
            >
              <CloseIcon />
            </IconButton>
          </div>
        ))}
      </div>

      <Button variant="contained" color="primary" onClick={addKeyValuePair}>
        Додати пару ключ-значення
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={replaceDynamicValues}
      >
        Замінити
      </Button>
    </Box>
  );
};

export default InsertingProps;

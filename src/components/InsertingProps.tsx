import { useState, useEffect } from "react";
import { useBanner } from "../context/BannerContext";
import { Box, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BannerObject, BannerChild } from "../types";

interface KeyValuePair {
  key: string;
  value: string;
}

const InsertingProps: React.FC = () => {
  const { temporaryUpdates, setTemporaryUpdates, renderedObjects } =
    useBanner();

  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(() => {
    const savedPairs = sessionStorage.getItem("keyValuePairs");
    return savedPairs
      ? JSON.parse(savedPairs)
      : [
          { key: "title", value: "Назва продукту" },
          { key: "img", value: "https://placehold.co/300" },
          { key: "price", value: "1000" },
        ];
  });

  useEffect(() => {
    sessionStorage.setItem("keyValuePairs", JSON.stringify(keyValuePairs));
  }, [keyValuePairs]);

  const handleKeyChange = (index: number, newKey: string) => {
    const updatedPairs = keyValuePairs.map((pair: KeyValuePair, i: number) =>
      i === index ? { ...pair, key: newKey } : pair
    );
    setKeyValuePairs(updatedPairs);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updatedPairs = keyValuePairs.map((pair: KeyValuePair, i: number) =>
      i === index ? { ...pair, value: newValue } : pair
    );
    setKeyValuePairs(updatedPairs);
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const removeKeyValuePair = (index: number) => {
    const updatedPairs = keyValuePairs.filter(
      (_: KeyValuePair, i: number) => i !== index
    );
    setKeyValuePairs(updatedPairs);
  };

  //

  const processObject = (obj: BannerObject): BannerObject => {
    let isUpdated = false;

    const updates: Partial<typeof obj> = {};

    keyValuePairs.forEach(({ key, value }: KeyValuePair) => {
      if (!key.trim() || !value.trim()) return;

      const dynamicKey = `{{${key}}}`;

      if (obj.content && obj.content.includes(dynamicKey)) {
        updates.content = obj.content.replaceAll(dynamicKey, value);
        isUpdated = true;
      }

      if (obj.src && obj.src.includes(dynamicKey)) {
        updates.src = obj.src.replaceAll(dynamicKey, value);
        isUpdated = true;
      }
    });

    if (obj.type === "group" && Array.isArray(obj.children)) {
      const updatedChildren: BannerChild[] = obj.children
        .filter((child) => child.type === "text" || child.type === "image")
        .map((child) => processObject(child as BannerObject) as BannerChild);

      if (JSON.stringify(updatedChildren) !== JSON.stringify(obj.children)) {
        updates.children = updatedChildren;
        isUpdated = true;
      }
    }
    return isUpdated ? { ...obj, ...updates } : obj;
  };

  const replaceDynamicValues = () => {
    const newTemporaryUpdates = { ...temporaryUpdates };

    renderedObjects.forEach((obj) => {
      const updatedObj = processObject(obj);

      if (JSON.stringify(updatedObj) !== JSON.stringify(obj)) {
        newTemporaryUpdates[obj.id] = updatedObj;
      }
    });

    setTemporaryUpdates(newTemporaryUpdates);
  };

  return (
    <Box className="inserting-props">
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

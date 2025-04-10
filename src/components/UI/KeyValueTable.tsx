import React, { useState } from "react";
import { TextField, IconButton, Menu, MenuItem } from "@mui/material";
import { ThreeDots } from "../../assets/icons";
import { AddButton } from "../../assets/icons";

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueTableProps {
  keyValuePairs: KeyValuePair[];
  handleKeyChange: (index: number, value: string) => void;
  handleValueChange: (index: number, value: string) => void;
  removeKeyValuePair: (index: number) => void;
  addKeyValuePair: () => void;
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({
  keyValuePairs,
  handleKeyChange,
  handleValueChange,
  removeKeyValuePair,
  addKeyValuePair,
}) => {
  const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>(
    Array(keyValuePairs.length).fill(null)
  );

  const handleMenuOpen = (
    index: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    const newAnchors = [...anchorEls];
    newAnchors[index] = event.currentTarget;
    setAnchorEls(newAnchors);
  };

  const handleMenuClose = (index: number) => {
    const newAnchors = [...anchorEls];
    newAnchors[index] = null;
    setAnchorEls(newAnchors);
  };

  return (
    <div className="variables-panel">
      <div className="table-header" style={{ display: "flex" }}>
        <div className="table-cell" style={{ flex: "0 0 40%", padding: "8px" }}>
          Property
        </div>
        <div className="table-cell" style={{ flex: "0 0 40%", padding: "8px" }}>
          Value
        </div>
        <div
          className="table-cell table-actions"
          style={{
            flex: "0 0 20%",
            marginLeft: "-1px",
            // justifyContent: "flex-start",
          }}
        >
          <IconButton onClick={addKeyValuePair}>
            <AddButton />
          </IconButton>
        </div>
      </div>

      {keyValuePairs.map((pair, index) => (
        <div
          className="table-row"
          key={index}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="table-cell" style={{ flex: "0 0 40%" }}>
            <TextField
              fullWidth
              variant="standard"
              value={pair.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              placeholder="key"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    padding: "6px 4px 6px 8px",
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "white",
                },
              }}
            />
          </div>
          <div className="table-cell" style={{ flex: "0 0 40%" }}>
            <TextField
              fullWidth
              variant="standard"
              value={pair.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              placeholder="value"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    padding: "6px 4px 6px 8px",
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "white",
                },
              }}
            />
          </div>
          <div
            className="table-cell table-actions"
            style={{
              flex: "0 0 20%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={(e) => handleMenuOpen(index, e)}>
              <ThreeDots />
            </IconButton>
            <Menu
              anchorEl={anchorEls[index]}
              open={Boolean(anchorEls[index])}
              onClose={() => handleMenuClose(index)}
            >
              <MenuItem
                onClick={() => {
                  removeKeyValuePair(index);
                  handleMenuClose(index);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyValueTable;

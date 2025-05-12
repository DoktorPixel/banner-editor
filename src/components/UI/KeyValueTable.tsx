import React from "react";
import { TextField, IconButton } from "@mui/material";
import { AddButton } from "../../assets/icons";
import { DeleteFile, AddFile } from "../../assets/icons";
import { KeyValuePair } from "../../types";

interface KeyValueTableProps {
  keyValuePairs: KeyValuePair[];
  handleKeyChange: (index: number, value: string) => void;
  handleValueChange: (index: number, value: string) => void;
  removeKeyValuePair: (index: number) => void;
  addKeyValuePair: () => void;
  handleAddText: (text: string) => void;
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({
  keyValuePairs,
  handleKeyChange,
  handleValueChange,
  removeKeyValuePair,
  addKeyValuePair,
  handleAddText,
}) => {
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
                  sx: { padding: "6px 4px 6px 8px" },
                },
              }}
              sx={{ "& .MuiInputBase-root": { backgroundColor: "white" } }}
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
                  sx: { padding: "6px 4px 6px 8px" },
                },
              }}
              sx={{ "& .MuiInputBase-root": { backgroundColor: "white" } }}
            />
          </div>
          <div
            className="table-cell table-actions"
            style={{
              flex: "0 0 20%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <IconButton
              sx={{ padding: "0" }}
              onClick={() => {
                const trimmedKey = pair.key.trim();
                if (trimmedKey && trimmedKey !== "{{}}") {
                  handleAddText?.(`{{${trimmedKey}}}`);
                }
              }}
            >
              <AddFile />
            </IconButton>
            <IconButton
              sx={{ padding: "0" }}
              onClick={() => removeKeyValuePair(index)}
            >
              <DeleteFile />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyValueTable;

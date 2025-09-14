import React from "react";
import { TextField, IconButton } from "@mui/material";
import { AddButton, DeleteFile, AddFile } from "../../../../assets/icons";
import { useTranslation } from "react-i18next";

interface ExtendedPair {
  key: string;
  value: string;
  editable: boolean;
}

interface KeyValueTableProps {
  keyValuePairs: ExtendedPair[];
  handleKeyChange: (index: number, value: string) => void;
  handleValueChange: (index: number, value: string) => void;
  removeKeyValuePair: (index: number) => void;
  addKeyValuePair: () => void;
  handleAddText: (text: string) => void;
  commitProductValue: (key: string, value: string) => void;
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({
  keyValuePairs,
  handleKeyChange,
  handleValueChange,
  removeKeyValuePair,
  addKeyValuePair,
  handleAddText,
  commitProductValue,
}) => {
  const { t } = useTranslation();

  return (
    <div className="variables-panel">
      <div className="table-header" style={{ display: "flex" }}>
        <div className="table-cell" style={{ flex: "0 0 35%", padding: "6px" }}>
          {t("property")}
        </div>
        <div className="table-cell" style={{ flex: "0 0 50%", padding: "6px" }}>
          {t("value")}
        </div>
        <div
          className="table-cell table-actions"
          style={{
            flex: "0 0 15%",
            marginLeft: "-6px",
          }}
        >
          <IconButton onClick={addKeyValuePair}>
            <AddButton />
          </IconButton>
        </div>
      </div>

      {keyValuePairs.map((pair, index) => (
        <div className="table-row" key={index} style={{ display: "flex" }}>
          <div className="table-cell" style={{ flex: "0 0 35%" }}>
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
                    padding: "4px 4px 4px 6px",
                    lineHeight: "120%",
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-root": { backgroundColor: "white" },
              }}
              disabled={!pair.editable}
            />
          </div>
          <div className="table-cell" style={{ flex: "0 0 50%" }}>
            <TextField
              fullWidth
              variant="standard"
              value={pair.value}
              onChange={(e) => {
                if (pair.editable) {
                  handleValueChange(index, e.target.value);
                }
              }}
              onBlur={(e) => {
                if (!pair.editable) {
                  commitProductValue(pair.key, e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (!pair.editable && e.key === "Enter") {
                  commitProductValue(
                    pair.key,
                    (e.target as HTMLInputElement).value
                  );
                  e.currentTarget.blur();
                }
              }}
              placeholder="value"
              multiline
              maxRows={3}
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    padding: "4px 4px 4px 6px",
                    lineHeight: "120%",
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-root": { backgroundColor: "white" },
              }}
              // disabled={!pair.editable}
            />
          </div>
          <div
            className="table-cell table-actions"
            style={{
              flex: "0 0 15%",
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

            {pair.editable && (
              <IconButton
                sx={{ padding: "0" }}
                onClick={() => removeKeyValuePair(index)}
              >
                <DeleteFile />
              </IconButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyValueTable;

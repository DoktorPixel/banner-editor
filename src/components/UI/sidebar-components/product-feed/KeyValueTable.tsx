// src/components/InsertingProps/KeyValueTable.tsx
import React from "react";
import { TextField, IconButton } from "@mui/material";
import { AddButton, DeleteFile, AddFile } from "../../../../assets/icons";
import { useTranslation } from "react-i18next";
import type { ExtendedPair } from "../../../../types";

interface Props {
  combinedPairs: ExtendedPair[];
  onEditKey: (oldKey: string, newKey: string) => void;
  onEditValue: (key: string, value: string) => void;
  onRemoveByKey: (key: string) => void;
  onAddCustom: () => void;
  onAddText: (text: string) => void;
  onCommitProductValue: (key: string, value: string) => void;
}

const KeyValueTable: React.FC<Props> = React.memo(
  ({
    combinedPairs,
    onEditKey,
    onEditValue,
    onRemoveByKey,
    onAddCustom,
    onAddText,
    onCommitProductValue,
  }) => {
    const { t } = useTranslation();

    const uniquePairs = React.useMemo(() => {
      const seen = new Set<string>();
      return combinedPairs.filter((pair) => {
        if (seen.has(pair.key)) return false;
        seen.add(pair.key);
        return true;
      });
    }, [combinedPairs]);

    return (
      <div className="variables-panel">
        <div className="table-header" style={{ display: "flex" }}>
          <div
            className="table-cell"
            style={{ flex: "0 0 35%", padding: "6px" }}
          >
            {t("property")}
          </div>
          <div
            className="table-cell"
            style={{ flex: "0 0 50%", padding: "6px" }}
          >
            {t("value")}
          </div>
          <div
            className="table-cell table-actions"
            style={{ flex: "0 0 15%", marginLeft: "-6px" }}
          >
            <IconButton onClick={onAddCustom}>
              <AddButton />
            </IconButton>
          </div>
        </div>

        {uniquePairs.map((pair, index) => (
          <div className="table-row" key={index} style={{ display: "flex" }}>
            <div className="table-cell" style={{ flex: "0 0 35%" }}>
              <TextField
                fullWidth
                variant="standard"
                value={pair.key}
                onChange={(e) => onEditKey(pair.key, e.target.value)}
                placeholder="key"
                slotProps={{
                  input: {
                    disableUnderline: true,
                    sx: { padding: "4px 4px 4px 6px", lineHeight: "120%" },
                  },
                }}
                sx={{ "& .MuiInputBase-root": { backgroundColor: "white" } }}
                disabled={!pair.custom}
              />
            </div>

            <div className="table-cell" style={{ flex: "0 0 50%" }}>
              <TextField
                fullWidth
                variant="standard"
                value={pair.value}
                onChange={(e) => {
                  if (pair.editable) onEditValue(pair.key, e.target.value);
                }}
                onBlur={(e) => {
                  if (!pair.editable)
                    onCommitProductValue(pair.key, e.target.value);
                }}
                onKeyDown={(e) => {
                  if (!pair.editable && e.key === "Enter") {
                    onCommitProductValue(
                      pair.key,
                      (e.target as HTMLInputElement).value
                    );
                    e.currentTarget.blur();
                  }
                }}
                onMouseDown={() => {
                  // раннее копирование product-field в config, чтобы можно было сразу начать ввод
                  if (!pair.editable)
                    onCommitProductValue(pair.key, pair.value);
                }}
                placeholder="value"
                multiline
                maxRows={3}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    sx: { padding: "4px 4px 4px 6px", lineHeight: "120%" },
                  },
                }}
                sx={{ "& .MuiInputBase-root": { backgroundColor: "white" } }}
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
              {pair.editable && (
                <IconButton
                  sx={{ padding: "0" }}
                  onClick={() => onRemoveByKey(pair.key)}
                >
                  <DeleteFile />
                </IconButton>
              )}
              <IconButton
                sx={{ padding: "0" }}
                onClick={() => {
                  const trimmedKey = pair.key.trim();
                  if (trimmedKey && trimmedKey !== "{{}}") {
                    onAddText(`{{${trimmedKey}}}`);
                  }
                }}
              >
                <AddFile />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default KeyValueTable;

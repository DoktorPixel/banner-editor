import React, { useEffect, useState } from "react";
import { FormControl, Button, TextField, InputLabel } from "@mui/material";
import { BannerObject } from "../../../types";

interface ActionToggleProps<T extends string> {
  options: { value: T; label: React.ReactNode }[];
  selected: T;
  onChange: (value: T) => void;
}

function ActionToggle<T extends string>({
  options,
  selected,
  onChange,
}: ActionToggleProps<T>) {
  return (
    <FormControl fullWidth sx={{ marginTop: "6px", marginBottom: "8px" }}>
      <div
        style={{
          display: "flex",
          backgroundColor: "#F1F1F1",
          padding: "3px",
          borderRadius: "5px",
        }}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              flex: 1,
              width: "100%",
              minWidth: "42px",
              minHeight: "30px",
              height: "29px",
              padding: "4px 6px",
              color: "#000000",
              fontWeight: "400",
              borderRadius: selected === option.value ? "4px" : "0px",
              backgroundColor: selected === option.value ? "white" : "#F1F1F1",
              "&:hover": {
                backgroundColor:
                  selected === option.value ? "#e3e3e3" : "#f5f5f5",
              },
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </FormControl>
  );
}

interface ChildActionToggleMultiple {
  value: string | number | undefined;
  onChangeMultiple: (updates: Partial<BannerObject>) => void;
}

export const ChildActionToggleMultiple: React.FC<ChildActionToggleMultiple> = ({
  value,
  onChangeMultiple,
}) => {
  const [gapValue, setGapValue] = useState<number | undefined>(
    value !== undefined ? parseInt(value as string, 10) : undefined
  );

  const [isAuto, setIsAuto] = useState(gapValue === undefined);

  useEffect(() => {
    const parsedValue =
      value !== undefined ? parseInt(value as string, 10) : undefined;
    setGapValue(parsedValue);
    setIsAuto(parsedValue === undefined);
  }, [value]);

  const handleToggleChange = (selectedValue: "auto" | "fixed") => {
    if (selectedValue === "auto") {
      setGapValue(undefined);
      setIsAuto(true);
      onChangeMultiple({
        gap: undefined,
        justifyContent: "space-between",
      });
    } else {
      setGapValue(10);
      setIsAuto(false);
      onChangeMultiple({
        gap: 10,
        justifyContent: "center",
      });
    }
  };

  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value, 10);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setGapValue(parsedValue);
      onChangeMultiple({ gap: parsedValue });
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <InputLabel sx={{ mt: 1, mb: "-15px", fontSize: "12px" }}>
          Gap
        </InputLabel>
        <TextField
          type="number"
          value={isAuto ? "" : gapValue ?? ""}
          onChange={handleGapChange}
          margin="normal"
          disabled={isAuto}
          sx={{ maxWidth: "60px", height: "35px" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <InputLabel sx={{ mt: 1, mb: "-6px", fontSize: "12px" }}>
          Position
        </InputLabel>
        <ActionToggle
          options={[
            { value: "auto", label: "Auto" },
            { value: "fixed", label: "Fixed" },
          ]}
          selected={isAuto ? "auto" : "fixed"}
          onChange={(value) => handleToggleChange(value as "auto" | "fixed")}
        />
      </div>
    </div>
  );
};

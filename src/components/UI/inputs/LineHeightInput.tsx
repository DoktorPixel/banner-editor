import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface LineHeightInputProps {
  value: string | number;
  onChange: (value: string) => void;
}

export const LineHeightInput: React.FC<LineHeightInputProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const initialUnit =
    typeof value === "string" && value.endsWith("%") ? "%" : "px";
  const initialNumeric = parseFloat(value.toString()) || 1.2;

  const [unit, setUnit] = useState<"px" | "%">(initialUnit as "px" | "%");
  const [number, setNumber] = useState<number>(initialNumeric);

  useEffect(() => {
    const newUnit =
      typeof value === "string" && value.endsWith("%") ? "%" : "px";
    const newNumber = parseFloat(value.toString());

    if (!isNaN(newNumber)) {
      setUnit(newUnit as "px" | "%");
      setNumber(newNumber);
    } else {
      const fallback = newUnit === "%" ? 120 : 20;
      setUnit(newUnit as "px" | "%");
      setNumber(fallback);
    }
  }, [value]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setNumber(NaN);
      onChange("");
      return;
    }

    const parsed = parseFloat(raw);
    setNumber(parsed);
    if (!isNaN(parsed)) {
      onChange(`${parsed}${unit}`);
    }
  };
  const handleBlur = () => {
    if (isNaN(number)) {
      const fallback = unit === "%" ? 120 : 20;
      setNumber(fallback);
      onChange(`${fallback}${unit}`);
    }
  };

  const handleUnitChange = (newUnit: "px" | "%") => {
    const defaultValue = newUnit === "%" ? 120 : 20;

    setUnit(newUnit);
    setNumber(defaultValue);
    onChange(`${defaultValue}${newUnit}`);
  };

  return (
    <Box width={"100%"}>
      <FormControl fullWidth>
        <TextField
          label={t("sidebar.lineHeight")}
          type="number"
          value={number}
          onChange={handleNumberChange}
          onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: 1,
            max: unit === "%" ? 300 : 100,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  value={unit}
                  onChange={(e) =>
                    handleUnitChange(e.target.value as "px" | "%")
                  }
                  variant="standard"
                  disableUnderline
                >
                  <MenuItem value="px">px</MenuItem>
                  <MenuItem value="%">%</MenuItem>
                </Select>
              </InputAdornment>
            ),
          }}
          fullWidth
          margin="normal"
        />
      </FormControl>
    </Box>
  );
};

import { useState, useEffect } from "react";
import { TextField, FormControlLabel, Switch } from "@mui/material";

interface AutoSizeInputProps {
  label: string;
  value: number | string;
  onChange: (value: number | "auto") => void;
}

export const AutoSizeInput: React.FC<AutoSizeInputProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isAuto, setIsAuto] = useState(value === "auto");

  useEffect(() => {
    setIsAuto(value === "auto");
  }, [value]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const auto = event.target.checked;
    setIsAuto(auto);
    onChange(auto ? "auto" : 300);
  };

  return (
    <div className="auto-size">
      <TextField
        label={label}
        type="number"
        value={isAuto ? "" : Math.round(value as number)}
        onChange={(e) => onChange(Math.round(parseInt(e.target.value, 10)))}
        fullWidth
        margin="normal"
        disabled={isAuto}
      />
      <FormControlLabel
        control={<Switch checked={isAuto} onChange={handleSwitchChange} />}
        label="auto"
      />
    </div>
  );
};

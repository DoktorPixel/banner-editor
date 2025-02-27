import { useState, useEffect } from "react";
import { TextField, FormControlLabel, Switch, Tooltip } from "@mui/material";
import { BannerObject } from "../../types";

interface AutoGapInputProps {
  objectId: number;
  value: string | number | undefined;
  updateObjectMultipleProperties: (
    objectId: number,
    updates: Partial<BannerObject>
  ) => void;
}

export const AutoGapInput: React.FC<AutoGapInputProps> = ({
  objectId,
  value,
  updateObjectMultipleProperties,
}) => {
  const [isAuto, setIsAuto] = useState(value === undefined);

  useEffect(() => {
    setIsAuto(value === undefined);
  }, [value]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const auto = event.target.checked;
    setIsAuto(auto);
    updateObjectMultipleProperties(objectId, {
      gap: auto ? undefined : 10,
      justifyContent: auto ? "space-between" : "center",
    });
  };

  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value, 10);
    if (!isNaN(parsedValue)) {
      updateObjectMultipleProperties(objectId, { gap: parsedValue });
    }
  };

  return (
    <div className="auto-size">
      <Tooltip title="Відступ між елементами (gap, px)" placement="top" arrow>
        <TextField
          label="Відступ між елементами (gap, px)"
          type="number"
          value={isAuto ? "" : value ?? 10}
          onChange={handleGapChange}
          fullWidth
          margin="normal"
          disabled={isAuto}
        />
      </Tooltip>
      <FormControlLabel
        control={<Switch checked={isAuto} onChange={handleSwitchChange} />}
        label="auto"
        sx={{ marginTop: "10px" }}
      />
    </div>
  );
};

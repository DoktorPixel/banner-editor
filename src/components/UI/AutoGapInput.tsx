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

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const auto = event.target.checked;
    setIsAuto(auto);
    if (auto) {
      setGapValue(undefined);
      updateObjectMultipleProperties(objectId, {
        gap: undefined,
        justifyContent: "space-between",
      });
    } else {
      setGapValue(10);
      updateObjectMultipleProperties(objectId, {
        gap: 10,
        justifyContent: "center",
      });
    }
  };

  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value, 10);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setGapValue(parsedValue);
      updateObjectMultipleProperties(objectId, { gap: parsedValue });
    }
  };

  return (
    <div className="auto-size">
      <Tooltip title="Відступ між елементами (gap, px)" placement="top" arrow>
        <TextField
          label="Відступ між елементами (gap, px)"
          type="number"
          value={isAuto ? "" : gapValue ?? ""}
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

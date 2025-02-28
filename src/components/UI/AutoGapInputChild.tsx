import { useState, useEffect } from "react";
import { TextField, FormControlLabel, Switch, Tooltip } from "@mui/material";
import { BannerChild } from "../../types";

interface AutoGapInputChildProps {
  value: string | number | undefined;
  onChangeMultiple: (updates: Partial<BannerChild>) => void;
}

export const AutoGapInputChild: React.FC<AutoGapInputChildProps> = ({
  value,
  onChangeMultiple,
}) => {
  const [isAuto, setIsAuto] = useState(value === undefined);

  useEffect(() => {
    setIsAuto(value === undefined);
  }, [value]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const auto = event.target.checked;
    setIsAuto(auto);
    onChangeMultiple({
      gap: auto ? undefined : 10,
      justifyContent: auto ? "space-between" : "center",
    });
  };

  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value, 10);
    if (!isNaN(parsedValue)) {
      onChangeMultiple({ gap: parsedValue });
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

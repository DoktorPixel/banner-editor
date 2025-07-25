import { TextField } from "@mui/material";

type ZoomControlProps = {
  scale: number;
  setScale: (value: number) => void;
};

export const ZoomControl: React.FC<ZoomControlProps> = ({
  scale,
  setScale,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) return;

    value = Math.max(40, Math.min(200, value));
    setScale(value / 100);
  };

  return (
    <TextField
      label="Zoom (%)"
      type="number"
      value={Math.round(scale * 100)}
      onChange={handleChange}
      inputProps={{ min: 40, max: 200 }}
      sx={{ width: 120 }}
    />
  );
};

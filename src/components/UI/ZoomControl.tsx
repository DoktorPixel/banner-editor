import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type ZoomControlProps = {
  scale: number;
  setScale: (value: number) => void;
};

export const ZoomControl: React.FC<ZoomControlProps> = ({
  scale,
  setScale,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    Math.round(scale * 100).toString()
  );
  const { t } = useTranslation();
  useEffect(() => {
    setInputValue(Math.round(scale * 100).toString());
  }, [scale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const value = parseInt(inputValue);

    if (isNaN(value)) {
      setInputValue(Math.round(scale * 100).toString());
      return;
    }

    const clamped = Math.max(40, Math.min(200, value));
    setScale(clamped / 100);
    setInputValue(clamped.toString());
  };

  return (
    <TextField
      label={t("sidebar.zoomInput")}
      // type="number"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ min: 40, max: 200 }}
      sx={{ width: 77 }}
    />
  );
};

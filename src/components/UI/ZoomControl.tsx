import { Box, IconButton, Typography } from "@mui/material";
import { Add, Remove, Search } from "@mui/icons-material";
import { useCallback } from "react";

type ZoomControlProps = {
  scale: number;
  setScale: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const ZoomControl: React.FC<ZoomControlProps> = ({
  scale,
  setScale,
  min = 0.4,
  max = 2,
  step = 0.1,
}) => {
  const percent = Math.round(scale * 100);

  const handleZoom = useCallback(
    (direction: "in" | "out") => {
      const delta = direction === "in" ? step : -step;
      const newScale = Math.max(min, Math.min(max, scale + delta));
      setScale(parseFloat(newScale.toFixed(3)));
    },
    [scale, setScale, step, min, max]
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        userSelect: "none",
      }}
    >
      <IconButton
        size="small"
        onClick={() => handleZoom("out")}
        disabled={scale <= min}
      >
        <Remove fontSize="small" />
      </IconButton>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "4px 8px 4px 3px",
          width: "65px",
        }}
      >
        {" "}
        <Search fontSize="small" sx={{ opacity: 0.7 }} />
        <Typography variant="body2" fontWeight={400}>
          {percent}%
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={() => handleZoom("in")}
        disabled={scale >= max}
      >
        <Add fontSize="small" />
      </IconButton>
    </Box>
  );
};

import { Box, Typography } from "@mui/material";
const DevPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Typography variant="h5">Dev</Typography>
      <Typography variant="body1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
        purus ut sem aliquet vehicula. Nullam nec purus ut sem aliquet vehicula.
      </Typography>
    </Box>
  );
};

export default DevPanel;

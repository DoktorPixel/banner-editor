import { Box, Typography } from "@mui/material";
const ImagePanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Typography variant="h5">Image</Typography>
      <Typography variant="body1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
        purus ut sem aliquet vehicula. Nullam nec purus ut sem aliquet vehicula.
      </Typography>
    </Box>
  );
};

export default ImagePanel;

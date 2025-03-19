import { Box } from "@mui/material";
import DynamicProps from "../DynamicProps";
const VariablesPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <DynamicProps />
    </Box>
  );
};

export default VariablesPanel;

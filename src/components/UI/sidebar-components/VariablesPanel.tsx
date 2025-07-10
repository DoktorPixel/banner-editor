import { Box } from "@mui/material";
import InsertingProps from "../../InsertingProps";
const VariablesPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <InsertingProps />
    </Box>
  );
};

export default VariablesPanel;

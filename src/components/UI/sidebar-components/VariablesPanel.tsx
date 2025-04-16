import { Box } from "@mui/material";
import DynamicProps from "../DynamicProps";
import InsertingProps from "../../InsertingProps";
const VariablesPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <DynamicProps />
      <InsertingProps />
    </Box>
  );
};

export default VariablesPanel;

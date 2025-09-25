import { Box } from "@mui/material";
import InsertingProps from "./product-feed/InsertingProps";
// import InsertingPropsCopy from "./product-feed/InsertingPropsСopy";
const VariablesPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <InsertingProps />
      {/* <InsertingPropsCopy /> */}
    </Box>
  );
};

export default VariablesPanel;

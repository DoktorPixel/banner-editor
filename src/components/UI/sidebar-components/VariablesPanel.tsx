import { Box } from "@mui/material";
import InsertingProps from "./product-feed/InsertingProps";
// import ProductBrowser from "./product-feed/ProductBrowser";
// import InsertingPropsCopy from "./product-feed/InsertingPropsСopy";
// import { mockProducts } from "../../../constants/mockProducts";
const VariablesPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <InsertingProps />
      {/* <InsertingPropsCopy /> */}
      {/* <ProductBrowser products={mockProducts} onSelect={() => {}} /> */}
    </Box>
  );
};

export default VariablesPanel;

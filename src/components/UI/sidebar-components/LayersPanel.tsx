import { Box } from "@mui/material";
import SidebarObjectList from "../SidebarObjectList";
const LayersPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <SidebarObjectList />
    </Box>
  );
};

export default LayersPanel;

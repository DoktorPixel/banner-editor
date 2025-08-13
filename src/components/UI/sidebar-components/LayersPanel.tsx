import { Box } from "@mui/material";
import SidebarObjectList from "../SidebarObjectList";
import ArboristLayersTree from "./ArboristLayersTree";
const LayersPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <SidebarObjectList />
      <ArboristLayersTree />
    </Box>
  );
};

export default LayersPanel;

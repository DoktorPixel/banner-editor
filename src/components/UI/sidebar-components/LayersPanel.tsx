import { Box } from "@mui/material";
import SidebarObjectList from "../SidebarObjectList";
// import ArboristLayersTree from "./ArboristLayersTree";
import { BannerObjectsTree } from "./react-arborist/BannerObjectsTree";
const LayersPanel: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <SidebarObjectList />
      <div className="grey-line"></div>
      {/* <ArboristLayersTree /> */}
      <BannerObjectsTree />
    </Box>
  );
};

export default LayersPanel;

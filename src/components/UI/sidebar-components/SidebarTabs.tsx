import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  SidebarText,
  SidebarImage,
  SidebarLayers,
  SidebarVariables,
  SidebarDev,
} from "../../../assets/icons";
import TextPanel from "./TextPanel";
import ImagePanel from "./ImagePanel";
import LayersPanel from "./LayersPanel";
import VariablesPanel from "./VariablesPanel";
import DevPanel from "./DevPanel";
import { useTranslation } from "react-i18next";

const SidebarTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const { t } = useTranslation();
  const tabs = [
    { id: "text", label: t("sidebarTabs.text"), icon: <SidebarText /> },
    { id: "image", label: t("sidebarTabs.image"), icon: <SidebarImage /> },
    { id: "layers", label: t("sidebarTabs.layers"), icon: <SidebarLayers /> },
    {
      id: "variables",
      label: t("sidebarTabs.variables"),
      icon: <SidebarVariables />,
    },
    { id: "dev", label: t("sidebarTabs.dev"), icon: <SidebarDev /> },
  ];
  return (
    <div className="sidebar-tabs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          marginTop: "0",
        }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textTransform: "none",
              color: "black",
              backgroundColor: activeTab === tab.id ? "#EEEEEE" : "transparent",
              borderRadius: "5px",
              padding: "5px 5px 0 5px",
              minWidth: "56px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {tab.icon}
              <Typography variant="caption">{tab.label}</Typography>
            </Box>
          </Button>
        ))}
      </Box>

      {/* Content Panel */}
      <Box sx={{ flex: 1, margin: "0 10px 10px 10px" }}>
        {activeTab === "text" && <TextPanel />}
        {activeTab === "image" && <ImagePanel />}
        {activeTab === "layers" && <LayersPanel />}
        {activeTab === "variables" && <VariablesPanel />}
        {activeTab === "dev" && <DevPanel />}
      </Box>
    </div>
  );
};

export default SidebarTabs;

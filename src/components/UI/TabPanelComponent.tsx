import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ paddingTop: "10px" }}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

interface TabPanelComponentProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
}

const TabPanelComponent: React.FC<TabPanelComponentProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={activeTab} onChange={handleChange} sx={{ padding: "0px" }}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            sx={{ padding: "0px 6px", fontSize: "12px" }}
          />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabPanelComponent;

import { useConfig } from "../../context/ConfigContext";

import { Box, TextField, Button, Typography } from "@mui/material";

const DynamicProps: React.FC = () => {
  const { config, setConfig } = useConfig();
  const handleConfigChange = (index: number, newValue: string) => {
    const updatedConfig = [...config];
    updatedConfig[index].value = newValue;
    setConfig(updatedConfig);
  };

  const addNewProp = () => {
    setConfig((prevConfig) => [...prevConfig, { key: "", value: "" }]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="body1" sx={{ marginTop: 0 }}>
        Замініть динамічні значення:
      </Typography>
      {config.map((item, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            label="Key"
            value={item.key}
            // disabled
            size="small"
            sx={{ width: "150px" }}
          />
          <TextField
            label="Value"
            value={item.value}
            onChange={(e) => handleConfigChange(index, e.target.value)}
            size="small"
            sx={{ width: "200px" }}
          />
        </Box>
      ))}
      <Button variant="outlined" onClick={addNewProp}>
        додати змінну
      </Button>
    </Box>
  );
};

export default DynamicProps;

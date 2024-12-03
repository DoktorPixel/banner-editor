// GroupObjectForm.tsx

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { BannerObject } from "../../types";

interface TextObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number) => void;
}

export const GroupObjectForm: React.FC<TextObjectFormProps> = ({
  object,
  onChange,
}) => {
  const handleInputChange = (
    key: keyof BannerObject,
    value: string | number
  ) => {
    onChange(key, value);
  };
  return (
    <Box>
      <Typography variant="h6">Налаштування групи</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Display</InputLabel>
        <Select
          value={object.display || "flex"}
          onChange={(e) => handleInputChange("display", e.target.value)}
        >
          <MenuItem value="flex">flex</MenuItem>
          <MenuItem value="block">block</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>flexDirection</InputLabel>
        <Select
          value={object.flexDirection || "row"}
          onChange={(e) => handleInputChange("flexDirection", e.target.value)}
        >
          <MenuItem value="row">row</MenuItem>
          <MenuItem value="row-reverse">row-reverse</MenuItem>
          <MenuItem value="column">column</MenuItem>
          <MenuItem value="column-reverse">column-reverse</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>justifyContent</InputLabel>
        <Select
          value={object.justifyContent || "center"}
          onChange={(e) => handleInputChange("justifyContent", e.target.value)}
        >
          <MenuItem value="start">start</MenuItem>
          <MenuItem value="center">center</MenuItem>
          <MenuItem value="space-between">space-between</MenuItem>
          <MenuItem value="space-around">space-around</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>alignItems</InputLabel>
        <Select
          value={object.alignItems || "center"}
          onChange={(e) => handleInputChange("alignItems", e.target.value)}
        >
          <MenuItem value="flex-start">flex-start</MenuItem>
          <MenuItem value="flex-end">flex-end</MenuItem>
          <MenuItem value="center">center</MenuItem>
          <MenuItem value="baseline">baseline</MenuItem>
          <MenuItem value="stretch">stretch</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="gap (px)"
        type="number"
        value={object.gap}
        onChange={(e) => handleInputChange("gap", parseInt(e.target.value))}
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

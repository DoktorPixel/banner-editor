import { FC, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useObjectCondition } from "../../utils/hooks";

interface ConditionSelectorProps {
  objectId: number;
  condition?: { type: "showIf" | "hideIf"; props: string[] };
}

export const ConditionSelector: FC<ConditionSelectorProps> = ({
  objectId,
  condition,
}) => {
  const { updateCondition } = useObjectCondition();
  const [inputValue, setInputValue] = useState(
    condition?.props?.join(", ") || ""
  );

  const handleConditionChange = (
    newType?: "showIf" | "hideIf",
    newProps?: string[]
  ) => {
    const cleanedProps = Array.from(
      new Set(newProps?.map((p) => p.trim()).filter((p) => p !== ""))
    );

    const updatedCondition = {
      type: newType ?? condition?.type ?? "hideIf",
      props: cleanedProps.length > 0 ? cleanedProps : condition?.props ?? [""],
    };

    updateCondition(objectId, updatedCondition);
  };

  const handleAddCondition = () => {
    updateCondition(objectId, { type: "showIf", props: [] });
  };

  const handleRemoveCondition = () => {
    updateCondition(objectId, undefined);
  };

  if (!condition) {
    return (
      <Box textAlign="center" mt={2}>
        <Button variant="outlined" color="primary" onClick={handleAddCondition}>
          Додати умову відображення
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ mt: -1 }}>Умова відображення</InputLabel>
        <Select
          value={condition?.type || "hideIf"}
          onChange={(e) =>
            handleConditionChange(e.target.value as "showIf" | "hideIf")
          }
        >
          <MenuItem value="showIf">Показати якщо є</MenuItem>
          <MenuItem value="hideIf">Приховати якщо є</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Параметри умови (props через кому)"
        value={inputValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setInputValue(newValue);

          if (newValue.endsWith(",")) return;

          const propsArray = newValue
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p !== "");

          handleConditionChange(undefined, propsArray);
        }}
        onBlur={() => {
          const finalPropsArray = inputValue
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p !== "");

          handleConditionChange(undefined, finalPropsArray);
        }}
        fullWidth
        margin="normal"
      />

      <Box textAlign="center" mt={2}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleRemoveCondition}
        >
          Видалити умову відображення
        </Button>
      </Box>
    </Box>
  );
};

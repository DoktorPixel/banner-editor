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
import { useChildCondition } from "../../utils/hooks";
import { useObjectProperties } from "../../utils/hooks";

interface ChildConditionSelectorProps {
  childId: number;
  condition?: {
    type: "showIf" | "hideIf";
    props: string[];
    state: "exist" | "noExist";
  };
}

export const ChildConditionSelector: FC<ChildConditionSelectorProps> = ({
  childId,
  condition,
}) => {
  const { updateChildCondition } = useChildCondition();
  const [inputValue, setInputValue] = useState(
    condition?.props?.join(", ") || ""
  );

  const { selectedObjectIds } = useObjectProperties();
  const groupId = selectedObjectIds[0];

  const handleConditionChange = (
    newType?: "showIf" | "hideIf",
    newState?: "exist" | "noExist",
    newProps?: string[]
  ) => {
    const cleanedProps = Array.from(
      new Set(newProps?.map((p) => p.trim()).filter((p) => p !== ""))
    );

    const updatedCondition = {
      type: newType ?? condition?.type ?? "hideIf",
      state: newState ?? condition?.state ?? "exist",
      props: cleanedProps.length > 0 ? cleanedProps : condition?.props ?? [""],
    };

    updateChildCondition(groupId, childId, updatedCondition);
  };

  const handleAddCondition = () => {
    updateChildCondition(groupId, childId, {
      type: "showIf",
      state: "exist",
      props: [],
    });
  };

  const handleRemoveCondition = () => {
    updateChildCondition(groupId, childId, undefined);
  };

  if (!condition) {
    return (
      <Box mt={2}>
        <Button variant="outlined" color="primary" onClick={handleAddCondition}>
          Додати умову відображення
        </Button>
      </Box>
    );
  }

  return (
    <Box mt={1}>
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

          handleConditionChange(undefined, undefined, propsArray);
        }}
        onBlur={() => {
          const finalPropsArray = inputValue
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p !== "");

          handleConditionChange(undefined, undefined, finalPropsArray);
        }}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ mt: -1 }}>Стан параметра</InputLabel>
        <Select
          value={condition?.state || "exist"}
          onChange={(e) =>
            handleConditionChange(
              undefined,
              e.target.value as "exist" | "noExist"
            )
          }
        >
          <MenuItem value="exist">Існує</MenuItem>
          <MenuItem value="noExist">Не існує</MenuItem>
        </Select>
      </FormControl>

      <Box mt={2}>
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

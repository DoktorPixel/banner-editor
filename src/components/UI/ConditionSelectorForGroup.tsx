import { FC, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { PlusIcon, MinusIcon } from "../../assets/icons";
import ActionToggle from "./button-groups/ActionToggle";
import { useAbstractGroupCondition } from "../../utils/hooks";

interface Condition {
  type: "showIf" | "hideIf";
  props: string[];
  state: "exist" | "noExist";
}

interface ConditionSelectorForGroupProps {
  abstractGroupId: number;
  condition?: Condition;
}

export const ConditionSelectorForGroup: FC<ConditionSelectorForGroupProps> = ({
  abstractGroupId,
  condition,
}) => {
  const { updateGroupCondition } = useAbstractGroupCondition();
  const [inputValue, setInputValue] = useState(
    condition?.props?.join(", ") || ""
  );

  const handleConditionChange = (
    newType?: Condition["type"],
    newState?: Condition["state"],
    newProps?: string[]
  ) => {
    const cleanedProps = Array.from(
      new Set(newProps?.map((p) => p.trim()).filter((p) => p !== ""))
    );

    const updatedCondition: Condition = {
      type: newType ?? condition?.type ?? "hideIf",
      state: newState ?? condition?.state ?? "exist",
      props: cleanedProps.length > 0 ? cleanedProps : condition?.props ?? [""],
    };

    updateGroupCondition(abstractGroupId, updatedCondition);
  };

  const handleAddCondition = () => {
    updateGroupCondition(abstractGroupId, {
      type: "showIf",
      state: "exist",
      props: [],
    });
  };

  const handleRemoveCondition = () => {
    updateGroupCondition(abstractGroupId, undefined);
  };

  if (!condition) {
    return (
      <Box
        paddingLeft="10px"
        paddingRight="10px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="subtitle2">Program visibility (Group)</Typography>
        <IconButton onClick={handleAddCondition}>
          <PlusIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box paddingLeft="10px" paddingRight="10px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">Program visibility (Group)</Typography>
        <IconButton onClick={handleRemoveCondition} edge="start">
          <MinusIcon />
        </IconButton>
      </Box>

      <div style={{ maxWidth: "134px" }}>
        <ActionToggle
          label="Action"
          options={[
            { value: "hideIf", label: "Hide" },
            { value: "showIf", label: "Show" },
          ]}
          selected={condition?.type || "hideIf"}
          onChange={(newValue) =>
            handleConditionChange(newValue as Condition["type"])
          }
        />
      </div>

      <div className="auto-size" style={{ marginTop: "8px" }}>
        <div style={{ flex: 1 }}>
          <InputLabel sx={{ mt: "-2px", mb: -2, fontSize: "12px" }}>
            Property
          </InputLabel>
          <TextField
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
        </div>
        <div style={{ flex: 1 }}>
          <InputLabel sx={{ mt: "-2px", mb: -2, fontSize: "12px" }}>
            Condition
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              sx={{
                backgroundColor: "#fff",
                borderRadius: "6px",
                border: "1px solid #E4E4E4",
                width: "100%",
              }}
              value={condition?.state || "exist"}
              onChange={(e) =>
                handleConditionChange(
                  undefined,
                  e.target.value as Condition["state"]
                )
              }
            >
              <MenuItem value="exist">Exist</MenuItem>
              <MenuItem value="noExist">No exist</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </Box>
  );
};

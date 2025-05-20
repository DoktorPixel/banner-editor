import { FC, useMemo, useState } from "react";
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
import { PlusIcon, MinusIcon } from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import { useAbstractGroupCondition } from "../../../utils/hooks";

export type Condition = {
  type: "showIf" | "hideIf";
  props: string[];
  state:
    | "exist"
    | "noExist"
    | "eq"
    | "not-eq"
    | "more-than"
    | "less-than"
    | "more-or-eq"
    | "less-or-eq";
  compareValue?: string;
};

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
  const [compareValue, setCompareValue] = useState(
    condition?.compareValue || ""
  );

  const isComparisonOperator = useMemo(
    () =>
      [
        "eq",
        "not-eq",
        "more-than",
        "less-than",
        "more-or-eq",
        "less-or-eq",
      ].includes(condition?.state || ""),
    [condition?.state]
  );

  const handleConditionChange = (
    newType?: Condition["type"],
    newState?: Condition["state"],
    newProps?: string[],
    newCompareValue?: string
  ) => {
    const cleanedProps = Array.from(new Set(newProps ?? condition?.props ?? []))
      .map((p) => p.trim())
      .filter((p) => p !== "");

    const updatedCondition: Condition = {
      type: newType ?? condition?.type ?? "hideIf",
      state: newState ?? condition?.state ?? "exist",
      props: cleanedProps.length > 0 ? cleanedProps : [""],
      ...(newCompareValue !== undefined
        ? { compareValue: newCompareValue }
        : condition?.compareValue
        ? { compareValue: condition.compareValue }
        : {}),
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

      <Box sx={{ maxWidth: "134px" }}>
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
      </Box>

      <Box display="flex" gap={2} mt={1}>
        <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ mt: "-2px", mb: -1, fontSize: "12px" }}>
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
        </Box>

        <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ mt: "-2px", mb: -1, fontSize: "12px" }}>
            Condition
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={condition.state}
              onChange={(e) => {
                const newState = e.target.value as Condition["state"];
                handleConditionChange(undefined, newState);
              }}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "6px",
                border: "1px solid #E4E4E4",
              }}
            >
              <MenuItem value="exist">Exist</MenuItem>
              <MenuItem value="noExist">No exist</MenuItem>
              <MenuItem value="eq">Equal (=)</MenuItem>
              <MenuItem value="not-eq">Not equal (≠)</MenuItem>
              <MenuItem value="more-than">More than (&gt;)</MenuItem>
              <MenuItem value="less-than">Less than (&lt;)</MenuItem>
              <MenuItem value="more-or-eq">More or equal (≥)</MenuItem>
              <MenuItem value="less-or-eq">Less or equal (≤)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isComparisonOperator && (
        <Box sx={{ marginTop: "8px" }}>
          <InputLabel sx={{ mt: "-2px", mb: -1, fontSize: "12px" }}>
            Value to compare
          </InputLabel>
          <TextField
            type={
              ["more-than", "less-than", "more-or-eq", "less-or-eq"].includes(
                condition.state
              )
                ? "number"
                : "text"
            }
            value={compareValue}
            onChange={(e) => {
              const newVal = e.target.value;

              if (
                ["more-than", "less-than", "more-or-eq", "less-or-eq"].includes(
                  condition.state
                ) &&
                isNaN(Number(newVal))
              ) {
                return;
              }
              setCompareValue(newVal);
              handleConditionChange(undefined, undefined, undefined, newVal);
            }}
            fullWidth
            margin="normal"
            placeholder={
              ["more-than", "less-than", "more-or-eq", "less-or-eq"].includes(
                condition.state
              )
                ? "Enter the number"
                : "Enter comparison value"
            }
          />
        </Box>
      )}
    </Box>
  );
};

import { FC, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { PlusIcon, MinusIcon } from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import { useChildCondition } from "../../../utils/hooks";
import { useObjectProperties } from "../../../utils/hooks";

export type ChildCondition = {
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

interface ChildConditionSelectorProps {
  childId: number;
  condition?: ChildCondition;
}

export const ChildConditionSelector: FC<ChildConditionSelectorProps> = ({
  childId,
  condition,
}) => {
  const { updateChildCondition } = useChildCondition();
  const { selectedObjectIds } = useObjectProperties();
  const groupId = selectedObjectIds[0];

  const [inputPropsString, setInputPropsString] = useState(
    condition?.props?.join(", ") || ""
  );
  const [compareValue, setCompareValue] = useState<string>(
    condition?.compareValue || ""
  );

  useEffect(() => {
    setInputPropsString(condition?.props?.join(", ") || "");
    setCompareValue(condition?.compareValue || "");
  }, [condition]);

  const handleConditionChange = (
    newType?: "showIf" | "hideIf",
    newState?: ChildCondition["state"],
    newProps?: string[],
    newCompareValue?: string
  ) => {
    const type = newType ?? condition?.type ?? "hideIf";
    const state = newState ?? condition?.state ?? "exist";

    const props =
      newProps !== undefined
        ? Array.from(
            new Set(newProps.map((p) => p.trim()).filter((p) => p !== ""))
          )
        : condition?.props ?? [];

    const updatedCondition: ChildCondition = {
      type,
      state,
      props,
      ...([
        "eq",
        "not-eq",
        "more-than",
        "less-than",
        "more-or-eq",
        "less-or-eq",
      ].includes(state)
        ? {
            compareValue:
              newCompareValue !== undefined
                ? newCompareValue
                : compareValue || condition?.compareValue || "",
          }
        : {}),
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
      <Box
        paddingLeft="10px"
        paddingRight="10px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="subtitle2">Program visibility</Typography>
        <IconButton onClick={handleAddCondition}>
          <PlusIcon />
        </IconButton>
      </Box>
    );
  }

  const isComparisonOperator = [
    "eq",
    "not-eq",
    "more-than",
    "less-than",
    "more-or-eq",
    "less-or-eq",
  ].includes(condition.state);

  return (
    <Box paddingLeft="10px" paddingRight="10px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">Program visibility</Typography>
        <IconButton onClick={handleRemoveCondition} edge="start">
          <MinusIcon />
        </IconButton>
      </Box>

      <Box sx={{ maxWidth: "134px", marginTop: "8px" }}>
        <ActionToggle
          label="Action"
          options={[
            { value: "hideIf", label: "Hide" },
            { value: "showIf", label: "Show" },
          ]}
          selected={condition.type}
          onChange={(newType) =>
            handleConditionChange(newType, undefined, undefined, undefined)
          }
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, marginTop: "12px" }}>
        <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ mt: "-2px", mb: -1, fontSize: "12px" }}>
            Property
          </InputLabel>
          <TextField
            value={inputPropsString}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputPropsString(newValue);

              if (newValue.endsWith(",") && newValue !== ",") return;

              const propsArray = newValue
                .split(",")
                .map((p) => p.trim())
                .filter((p) => p !== "");

              handleConditionChange(
                undefined,
                undefined,
                propsArray,
                undefined
              );
            }}
            onBlur={() => {
              const finalPropsArray = inputPropsString
                .split(",")
                .map((p) => p.trim())
                .filter((p) => p !== "");

              handleConditionChange(
                undefined,
                undefined,
                finalPropsArray,
                undefined
              );
            }}
            fullWidth
            margin="normal"
            placeholder="e.g. name, value"
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
                const newState = e.target.value as ChildCondition["state"];
                handleConditionChange(
                  undefined,
                  newState,
                  undefined,
                  undefined
                );
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

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
  Tooltip,
} from "@mui/material";
import { PlusIcon, MinusIcon, SvgHelp } from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import {
  useAbstractGroupCondition,
  parsePropsString,
} from "../../../utils/hooks";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        <Typography variant="subtitle2">
          {" "}
          {t("sidebar.groupProgramVisibility")}
        </Typography>
        <IconButton onClick={handleAddCondition}>
          <PlusIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box paddingLeft="10px" paddingRight="10px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">
          {" "}
          {t("sidebar.groupProgramVisibility")}{" "}
        </Typography>
        <IconButton onClick={handleRemoveCondition} edge="start">
          <MinusIcon />
        </IconButton>
      </Box>

      <Box sx={{ maxWidth: "170px" }}>
        <ActionToggle
          label={t("sidebar.action")}
          options={[
            { value: "hideIf", label: t("sidebar.hide") },
            { value: "showIf", label: t("sidebar.show") },
          ]}
          selected={condition?.type || "hideIf"}
          onChange={(newValue) =>
            handleConditionChange(newValue as Condition["type"])
          }
        />
      </Box>

      <Box display="flex" gap={2} mt={1}>
        <Box sx={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "-15px",
            }}
          >
            <InputLabel sx={{ mt: "-2px", mb: "8px", fontSize: "12px" }}>
              {t("sidebar.property")}
            </InputLabel>
            <Tooltip
              arrow
              title={
                <Typography sx={{ whiteSpace: "pre-line", fontSize: "14px" }}>
                  {t("sidebar.dynamicPropertyHelp")}
                </Typography>
              }
            >
              <span
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                  zIndex: 100,
                  marginTop: "-6px",
                }}
              >
                <SvgHelp width="18px" height="18px" />
              </span>
            </Tooltip>
          </div>
          <TextField
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValue(newValue);
              if (newValue.endsWith(",")) return;
              const propsArray = parsePropsString(newValue);
              handleConditionChange(undefined, undefined, propsArray);
            }}
            onBlur={() => {
              const finalPropsArray = parsePropsString(inputValue);
              handleConditionChange(undefined, undefined, finalPropsArray);
            }}
            fullWidth
            margin="normal"
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ mt: "4px", mb: "-5px", fontSize: "12px" }}>
            {t("sidebar.condition")}
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
              <MenuItem value="exist">{t("sidebar.exist")}</MenuItem>
              <MenuItem value="noExist">{t("sidebar.noExist")}</MenuItem>
              <MenuItem value="eq">{t("sidebar.equal")}</MenuItem>
              <MenuItem value="not-eq">{t("sidebar.notEqual")}</MenuItem>
              <MenuItem value="more-than">{t("sidebar.moreThan")}</MenuItem>
              <MenuItem value="less-than">{t("sidebar.lessThan")}</MenuItem>
              <MenuItem value="more-or-eq">{t("sidebar.moreOrEqual")}</MenuItem>
              <MenuItem value="less-or-eq">{t("sidebar.lessOrEqual")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isComparisonOperator && (
        <Box sx={{ marginTop: "8px" }}>
          <InputLabel sx={{ mt: "-2px", mb: -1, fontSize: "12px" }}>
            {t("sidebar.valueToCompare")}
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
                ? t("sidebar.enterNumber")
                : t("sidebar.enterComparisonValue")
            }
          />
        </Box>
      )}
    </Box>
  );
};

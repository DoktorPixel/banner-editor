import { FC, useState, useEffect } from "react";
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
import { useObjectCondition } from "../../../utils/hooks";
import { PlusIcon, MinusIcon } from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import { useTranslation } from "react-i18next";
export type ObjectCondition = {
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

interface ConditionSelectorProps {
  objectId: number;
  condition?: ObjectCondition;
}

export const ConditionSelector: FC<ConditionSelectorProps> = ({
  objectId,
  condition,
}) => {
  const { updateCondition } = useObjectCondition();
  const { t } = useTranslation();
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
    newState?: ObjectCondition["state"],
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

    const updatedCondition: ObjectCondition = {
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

    updateCondition(objectId, updatedCondition);
  };

  const handleAddCondition = () => {
    updateCondition(objectId, {
      type: "showIf",
      state: "exist",
      props: [],
    });
  };

  const handleRemoveCondition = () => {
    updateCondition(objectId, undefined);
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
          {t("sidebar.programVisibility")}
        </Typography>
        <IconButton onClick={handleAddCondition}>
          <PlusIcon />
        </IconButton>
      </Box>
    );
  }

  let isComparisonOperator = false;

  if (condition && typeof condition === "object" && "state" in condition) {
    isComparisonOperator = [
      "eq",
      "not-eq",
      "more-than",
      "less-than",
      "more-or-eq",
      "less-or-eq",
    ].includes(condition.state);
  }

  return (
    <Box paddingLeft="10px" paddingRight="10px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">
          {" "}
          {t("sidebar.programVisibility")}
        </Typography>
        <IconButton onClick={handleRemoveCondition} edge="start">
          <MinusIcon />
        </IconButton>
      </Box>

      <Box sx={{ maxWidth: "170px", marginTop: "8px" }}>
        <ActionToggle
          label={t("sidebar.action")}
          options={[
            { value: "hideIf", label: t("sidebar.hide") },
            { value: "showIf", label: t("sidebar.show") },
          ]}
          selected={condition.type}
          onChange={(newType) =>
            handleConditionChange(newType, undefined, undefined, undefined)
          }
        />
      </Box>

      <Box
        className="auto-size"
        sx={{ display: "flex", gap: 2, marginTop: "12px" }}
      >
        <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ mt: "-2px", mb: -1, fontSize: "12px" }}>
            {t("sidebar.property")}
          </InputLabel>
          <TextField
            value={inputPropsString}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputPropsString(newValue);

              if (newValue.endsWith(",") && newValue !== ",") {
                return;
              }

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
            placeholder={t("sidebar.conditionPlaceholder")}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ mt: "-2px", mb: -1, fontSize: "12px" }}>
            {t("sidebar.condition")}
          </InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={condition.state}
              onChange={(e) => {
                type ConditionState = ObjectCondition["state"];
                const newState = e.target.value as ConditionState;
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

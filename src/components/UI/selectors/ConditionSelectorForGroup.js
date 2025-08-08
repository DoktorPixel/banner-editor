import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography, IconButton, } from "@mui/material";
import { PlusIcon, MinusIcon } from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import { useAbstractGroupCondition } from "../../../utils/hooks";
import { useTranslation } from "react-i18next";
export const ConditionSelectorForGroup = ({ abstractGroupId, condition, }) => {
    const { updateGroupCondition } = useAbstractGroupCondition();
    const [inputValue, setInputValue] = useState(condition?.props?.join(", ") || "");
    const [compareValue, setCompareValue] = useState(condition?.compareValue || "");
    const { t } = useTranslation();
    const isComparisonOperator = useMemo(() => [
        "eq",
        "not-eq",
        "more-than",
        "less-than",
        "more-or-eq",
        "less-or-eq",
    ].includes(condition?.state || ""), [condition?.state]);
    const handleConditionChange = (newType, newState, newProps, newCompareValue) => {
        const cleanedProps = Array.from(new Set(newProps ?? condition?.props ?? []))
            .map((p) => p.trim())
            .filter((p) => p !== "");
        const updatedCondition = {
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
        return (_jsxs(Box, { paddingLeft: "10px", paddingRight: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsxs(Typography, { variant: "subtitle2", children: [" ", t("sidebar.groupProgramVisibility")] }), _jsx(IconButton, { onClick: handleAddCondition, children: _jsx(PlusIcon, {}) })] }));
    }
    return (_jsxs(Box, { paddingLeft: "10px", paddingRight: "10px", children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsxs(Typography, { variant: "subtitle2", children: [" ", t("sidebar.groupProgramVisibility"), " "] }), _jsx(IconButton, { onClick: handleRemoveCondition, edge: "start", children: _jsx(MinusIcon, {}) })] }), _jsx(Box, { sx: { maxWidth: "170px" }, children: _jsx(ActionToggle, { label: t("sidebar.action"), options: [
                        { value: "hideIf", label: t("sidebar.hide") },
                        { value: "showIf", label: t("sidebar.show") },
                    ], selected: condition?.type || "hideIf", onChange: (newValue) => handleConditionChange(newValue) }) }), _jsxs(Box, { display: "flex", gap: 2, mt: 1, children: [_jsxs(Box, { sx: { flex: 1 }, children: [_jsx(InputLabel, { sx: { mt: "-2px", mb: -1, fontSize: "12px" }, children: t("sidebar.property") }), _jsx(TextField, { value: inputValue, onChange: (e) => {
                                    const newValue = e.target.value;
                                    setInputValue(newValue);
                                    if (newValue.endsWith(","))
                                        return;
                                    const propsArray = newValue
                                        .split(",")
                                        .map((p) => p.trim())
                                        .filter((p) => p !== "");
                                    handleConditionChange(undefined, undefined, propsArray);
                                }, onBlur: () => {
                                    const finalPropsArray = inputValue
                                        .split(",")
                                        .map((p) => p.trim())
                                        .filter((p) => p !== "");
                                    handleConditionChange(undefined, undefined, finalPropsArray);
                                }, fullWidth: true, margin: "normal" })] }), _jsxs(Box, { sx: { flex: 1 }, children: [_jsx(InputLabel, { sx: { mt: "-2px", mb: -1, fontSize: "12px" }, children: t("sidebar.condition") }), _jsx(FormControl, { fullWidth: true, margin: "normal", children: _jsxs(Select, { value: condition.state, onChange: (e) => {
                                        const newState = e.target.value;
                                        handleConditionChange(undefined, newState);
                                    }, sx: {
                                        backgroundColor: "#fff",
                                        borderRadius: "6px",
                                        border: "1px solid #E4E4E4",
                                    }, children: [_jsx(MenuItem, { value: "exist", children: t("sidebar.exist") }), _jsx(MenuItem, { value: "noExist", children: t("sidebar.noExist") }), _jsx(MenuItem, { value: "eq", children: t("sidebar.equal") }), _jsx(MenuItem, { value: "not-eq", children: t("sidebar.notEqual") }), _jsx(MenuItem, { value: "more-than", children: t("sidebar.moreThan") }), _jsx(MenuItem, { value: "less-than", children: t("sidebar.lessThan") }), _jsx(MenuItem, { value: "more-or-eq", children: t("sidebar.moreOrEqual") }), _jsx(MenuItem, { value: "less-or-eq", children: t("sidebar.lessOrEqual") })] }) })] })] }), isComparisonOperator && (_jsxs(Box, { sx: { marginTop: "8px" }, children: [_jsx(InputLabel, { sx: { mt: "-2px", mb: -1, fontSize: "12px" }, children: t("sidebar.valueToCompare") }), _jsx(TextField, { type: ["more-than", "less-than", "more-or-eq", "less-or-eq"].includes(condition.state)
                            ? "number"
                            : "text", value: compareValue, onChange: (e) => {
                            const newVal = e.target.value;
                            if (["more-than", "less-than", "more-or-eq", "less-or-eq"].includes(condition.state) &&
                                isNaN(Number(newVal))) {
                                return;
                            }
                            setCompareValue(newVal);
                            handleConditionChange(undefined, undefined, undefined, newVal);
                        }, fullWidth: true, margin: "normal", placeholder: ["more-than", "less-than", "more-or-eq", "less-or-eq"].includes(condition.state)
                            ? t("sidebar.enterNumber")
                            : t("sidebar.enterComparisonValue") })] }))] }));
};

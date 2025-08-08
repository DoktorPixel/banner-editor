import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography, } from "@mui/material";
import { PlusIcon, MinusIcon } from "../../../assets/icons";
import ActionToggle from "../button-groups/ActionToggle";
import { useChildCondition } from "../../../utils/hooks";
import { useObjectProperties } from "../../../utils/hooks";
import { useTranslation } from "react-i18next";
export const ChildConditionSelector = ({ childId, condition, }) => {
    const { updateChildCondition } = useChildCondition();
    const { selectedObjectIds } = useObjectProperties();
    const groupId = selectedObjectIds[0];
    const { t } = useTranslation();
    const [inputPropsString, setInputPropsString] = useState(condition?.props?.join(", ") || "");
    const [compareValue, setCompareValue] = useState(condition?.compareValue || "");
    useEffect(() => {
        setInputPropsString(condition?.props?.join(", ") || "");
        setCompareValue(condition?.compareValue || "");
    }, [condition]);
    const handleConditionChange = (newType, newState, newProps, newCompareValue) => {
        const type = newType ?? condition?.type ?? "hideIf";
        const state = newState ?? condition?.state ?? "exist";
        const props = newProps !== undefined
            ? Array.from(new Set(newProps.map((p) => p.trim()).filter((p) => p !== "")))
            : condition?.props ?? [];
        const updatedCondition = {
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
                    compareValue: newCompareValue !== undefined
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
        return (_jsxs(Box, { paddingLeft: "10px", paddingRight: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.programVisibility") }), _jsx(IconButton, { onClick: handleAddCondition, children: _jsx(PlusIcon, {}) })] }));
    }
    const isComparisonOperator = [
        "eq",
        "not-eq",
        "more-than",
        "less-than",
        "more-or-eq",
        "less-or-eq",
    ].includes(condition.state);
    return (_jsxs(Box, { paddingLeft: "10px", paddingRight: "10px", children: [_jsxs(Box, { display: "flex", alignItems: "center", justifyContent: "space-between", children: [_jsxs(Typography, { variant: "subtitle2", children: [" ", t("sidebar.programVisibility")] }), _jsx(IconButton, { onClick: handleRemoveCondition, edge: "start", children: _jsx(MinusIcon, {}) })] }), _jsx(Box, { sx: { maxWidth: "170px", marginTop: "8px" }, children: _jsx(ActionToggle, { label: t("sidebar.action"), options: [
                        { value: "hideIf", label: t("sidebar.hide") },
                        { value: "showIf", label: t("sidebar.show") },
                    ], selected: condition.type, onChange: (newType) => handleConditionChange(newType, undefined, undefined, undefined) }) }), _jsxs(Box, { sx: { display: "flex", gap: 2, marginTop: "12px" }, children: [_jsxs(Box, { sx: { flex: 1 }, children: [_jsx(InputLabel, { sx: { mt: "-2px", mb: -1, fontSize: "12px" }, children: t("sidebar.property") }), _jsx(TextField, { value: inputPropsString, onChange: (e) => {
                                    const newValue = e.target.value;
                                    setInputPropsString(newValue);
                                    if (newValue.endsWith(",") && newValue !== ",")
                                        return;
                                    const propsArray = newValue
                                        .split(",")
                                        .map((p) => p.trim())
                                        .filter((p) => p !== "");
                                    handleConditionChange(undefined, undefined, propsArray, undefined);
                                }, onBlur: () => {
                                    const finalPropsArray = inputPropsString
                                        .split(",")
                                        .map((p) => p.trim())
                                        .filter((p) => p !== "");
                                    handleConditionChange(undefined, undefined, finalPropsArray, undefined);
                                }, fullWidth: true, margin: "normal", placeholder: t("sidebar.conditionPlaceholder") })] }), _jsxs(Box, { sx: { flex: 1 }, children: [_jsx(InputLabel, { sx: { mt: "-2px", mb: -1, fontSize: "12px" }, children: t("sidebar.condition") }), _jsx(FormControl, { fullWidth: true, margin: "normal", children: _jsxs(Select, { value: condition.state, onChange: (e) => {
                                        const newState = e.target.value;
                                        handleConditionChange(undefined, newState, undefined, undefined);
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

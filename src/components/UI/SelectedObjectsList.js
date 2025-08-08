import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Box } from "@mui/material";
import { ConditionSelectorForGroup } from "./selectors/ConditionSelectorForGroup";
export const SelectedObjectsList = ({ objects, }) => {
    // console.log("Selected objects:", objects);
    const validObjects = objects.filter(Boolean);
    const abstractGroupId = validObjects[0]?.abstractGroupId ?? null;
    const isSameGroup = abstractGroupId != null &&
        validObjects.every((obj) => obj.abstractGroupId === abstractGroupId);
    const conditionForAbstract = isSameGroup && validObjects[0].conditionForAbstract
        ? validObjects[0].conditionForAbstract
        : undefined;
    return (_jsxs("div", { className: "padding-wrapper", children: [_jsx(Typography, { variant: "h6", children: "Selected objects:" }), _jsx("ul", { children: validObjects.map((obj) => (_jsxs("li", { children: [obj.type, " (ID: ", obj.id, ")"] }, obj.id))) }), isSameGroup && (_jsx(Box, { sx: { mt: 2 }, children: _jsxs(Typography, { variant: "subtitle1", children: ["Editing Abstract Group (ID: ", abstractGroupId, ")", _jsx(ConditionSelectorForGroup, { abstractGroupId: abstractGroupId, condition: conditionForAbstract })] }) }))] }));
};

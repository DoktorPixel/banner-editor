import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button, Box } from "@mui/material";
import { GroupLeft, GroupCenter, GroupRight, GroupRowLeft, GroupRowCenter, GroupRowRight, RowLeftBottom, RowCenterBottom, RowRightBottom, } from "../../../assets/icons";
const rowAlignments = [
    { label: _jsx(GroupLeft, {}), justifyContent: "start", alignItems: "flex-start" },
    {
        label: _jsx(GroupCenter, {}),
        justifyContent: "center",
        alignItems: "flex-start",
    },
    { label: _jsx(GroupRight, {}), justifyContent: "end", alignItems: "flex-start" },
    { label: _jsx(GroupRowLeft, {}), justifyContent: "start", alignItems: "center" },
    { label: _jsx(GroupRowCenter, {}), justifyContent: "center", alignItems: "center" },
    { label: _jsx(GroupRowRight, {}), justifyContent: "end", alignItems: "center" },
    { label: _jsx(RowLeftBottom, {}), justifyContent: "start", alignItems: "flex-end" },
    {
        label: _jsx(RowCenterBottom, {}),
        justifyContent: "center",
        alignItems: "flex-end",
    },
    { label: _jsx(RowRightBottom, {}), justifyContent: "end", alignItems: "flex-end" },
];
const columnAlignments = [
    { label: _jsx(GroupLeft, {}), justifyContent: "start", alignItems: "flex-start" },
    { label: _jsx(GroupCenter, {}), justifyContent: "start", alignItems: "center" },
    { label: _jsx(GroupRight, {}), justifyContent: "start", alignItems: "flex-end" },
    {
        label: _jsx(GroupRowLeft, {}),
        justifyContent: "center",
        alignItems: "flex-start",
    },
    { label: _jsx(GroupRowCenter, {}), justifyContent: "center", alignItems: "center" },
    {
        label: _jsx(GroupRowRight, {}),
        justifyContent: "center",
        alignItems: "flex-end",
    },
    { label: _jsx(RowLeftBottom, {}), justifyContent: "end", alignItems: "flex-start" },
    { label: _jsx(RowCenterBottom, {}), justifyContent: "end", alignItems: "center" },
    { label: _jsx(RowRightBottom, {}), justifyContent: "end", alignItems: "flex-end" },
];
const spaceBetweenRow = [
    {
        label: (_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "26px" }, children: [_jsx(GroupLeft, {}), _jsx(GroupCenter, {}), _jsx(GroupRight, {})] })),
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    {
        label: (_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "25px" }, children: [_jsx(GroupRowLeft, {}), _jsx(GroupRowCenter, {}), _jsx(GroupRowRight, {})] })),
        justifyContent: "space-between",
        alignItems: "center",
    },
    {
        label: (_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "25px" }, children: [_jsx(RowLeftBottom, {}), _jsx(RowCenterBottom, {}), _jsx(RowRightBottom, {})] })),
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
];
const spaceBetweenColumn = [
    {
        label: (_jsxs("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "18px",
            }, children: [_jsx(GroupLeft, {}), _jsx(GroupRowLeft, {}), _jsx(RowLeftBottom, {})] })),
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    {
        label: (_jsxs("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "18px",
            }, children: [_jsx(GroupCenter, {}), _jsx(GroupRowCenter, {}), _jsx(RowCenterBottom, {})] })),
        justifyContent: "space-between",
        alignItems: "center",
    },
    {
        label: (_jsxs("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "18px",
            }, children: [_jsx(GroupRight, {}), _jsx(GroupRowRight, {}), _jsx(RowRightBottom, {})] })),
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
];
export const AutoLayoutForm = ({ justifyContent, alignItems, flexDirection, onChange, }) => {
    const isSpaceBetween = justifyContent === "space-between";
    const alignments = isSpaceBetween
        ? flexDirection === "row"
            ? spaceBetweenRow
            : spaceBetweenColumn
        : flexDirection === "row"
            ? rowAlignments
            : columnAlignments;
    const isActive = (item) => item.justifyContent === justifyContent && item.alignItems === alignItems;
    return (_jsx(Box, { children: _jsx(Box, { display: "flex", flexDirection: "column", children: isSpaceBetween ? (_jsx(Box, { display: "flex", flexDirection: flexDirection === "row" ? "column" : "row", children: alignments.map((item, index) => (_jsx(Button, { sx: {
                        maxWidth: 118,
                        border: "2px solid #F1F1F1",
                        padding: "7px 10px",
                        minWidth: "39px",
                        backgroundColor: isActive(item) ? "white" : "#F1F1F1",
                        "&:hover": {
                            backgroundColor: isActive(item) ? "#e3e3e3" : "#f5f5f5",
                        },
                    }, onClick: () => {
                        onChange({
                            justifyContent: item.justifyContent,
                            alignItems: item.alignItems,
                        });
                    }, children: item.label }, index))) })) : ([0, 1, 2].map((rowIndex) => (_jsx(ButtonGroup, { children: alignments
                    .slice(rowIndex * 3, rowIndex * 3 + 3)
                    .map((item, index) => {
                    let borderRadiusStyles = {};
                    if (rowIndex === 0 && index === 0) {
                        borderRadiusStyles = { borderTopLeftRadius: "6px" };
                    }
                    else if (rowIndex === 0 && index === 2) {
                        borderRadiusStyles = { borderTopRightRadius: "6px" };
                    }
                    else if (rowIndex === 2 && index === 0) {
                        borderRadiusStyles = { borderBottomLeftRadius: "6px" };
                    }
                    else if (rowIndex === 2 && index === 2) {
                        borderRadiusStyles = { borderBottomRightRadius: "6px" };
                    }
                    return (_jsx(Button, { sx: {
                            maxWidth: 90,
                            border: "2px solid #F1F1F1",
                            padding: "7px 10px",
                            color: "#000000",
                            fontWeight: "400",
                            borderRadius: 0,
                            backgroundColor: isActive(item) ? "white" : "#F1F1F1",
                            "&:hover": {
                                backgroundColor: isActive(item)
                                    ? "#e3e3e3"
                                    : "#fcfafa",
                            },
                            ...borderRadiusStyles,
                        }, onClick: () => {
                            onChange({
                                justifyContent: item.justifyContent,
                                alignItems: item.alignItems,
                            });
                        }, children: item.label }, index));
                }) }, rowIndex)))) }) }));
};

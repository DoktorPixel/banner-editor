import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { TextField, FormControlLabel, Switch, Tooltip } from "@mui/material";
export const AutoGapInput = ({ objectId, value, updateObjectMultipleProperties, }) => {
    const [gapValue, setGapValue] = useState(value !== undefined ? parseInt(value, 10) : undefined);
    const [isAuto, setIsAuto] = useState(gapValue === undefined);
    useEffect(() => {
        const parsedValue = value !== undefined ? parseInt(value, 10) : undefined;
        setGapValue(parsedValue);
        setIsAuto(parsedValue === undefined);
    }, [value]);
    const handleSwitchChange = (event) => {
        const auto = event.target.checked;
        setIsAuto(auto);
        if (auto) {
            setGapValue(undefined);
            updateObjectMultipleProperties(objectId, {
                gap: undefined,
                justifyContent: "space-between",
            });
        }
        else {
            setGapValue(10);
            updateObjectMultipleProperties(objectId, {
                gap: 10,
                justifyContent: "center",
            });
        }
    };
    const handleGapChange = (e) => {
        const parsedValue = parseInt(e.target.value, 10);
        if (!isNaN(parsedValue) && parsedValue >= 0) {
            setGapValue(parsedValue);
            updateObjectMultipleProperties(objectId, { gap: parsedValue });
        }
    };
    return (_jsxs("div", { className: "auto-size", children: [_jsx(Tooltip, { title: "gap, px", placement: "top", arrow: true, children: _jsx(TextField, { type: "number", value: isAuto ? "" : gapValue ?? "", onChange: handleGapChange, fullWidth: true, margin: "normal", disabled: isAuto }) }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: isAuto, onChange: handleSwitchChange }), label: "auto", sx: { marginTop: "10px" } })] }));
};

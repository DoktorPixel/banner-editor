import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { TextField, FormControlLabel, Switch, Tooltip } from "@mui/material";
export const AutoGapInputChild = ({ value, onChangeMultiple, }) => {
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
            onChangeMultiple({
                gap: undefined,
                justifyContent: "space-between",
            });
        }
        else {
            setGapValue(10);
            onChangeMultiple({
                gap: 10,
                justifyContent: "center",
            });
        }
    };
    const handleGapChange = (e) => {
        const parsedValue = parseInt(e.target.value, 10);
        if (!isNaN(parsedValue) && parsedValue >= 0) {
            setGapValue(parsedValue);
            onChangeMultiple({ gap: parsedValue });
        }
    };
    return (_jsxs("div", { className: "auto-size", children: [_jsx(Tooltip, { title: "\u0412\u0456\u0434\u0441\u0442\u0443\u043F \u043C\u0456\u0436 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u043C\u0438 (gap, px)", placement: "top", arrow: true, children: _jsx(TextField, { label: "\u0412\u0456\u0434\u0441\u0442\u0443\u043F \u043C\u0456\u0436 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u043C\u0438 (gap, px)", type: "number", value: isAuto ? "" : gapValue ?? "", onChange: handleGapChange, fullWidth: true, margin: "normal", disabled: isAuto }) }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: isAuto, onChange: handleSwitchChange }), label: "auto", sx: { marginTop: "10px" } })] }));
};

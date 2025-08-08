import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { TextField, FormControlLabel, Switch } from "@mui/material";
export const AutoSizeInput = ({ label, value, onChange, }) => {
    const [isAuto, setIsAuto] = useState(value === "auto");
    useEffect(() => {
        setIsAuto(value === "auto");
    }, [value]);
    const handleSwitchChange = (event) => {
        const auto = event.target.checked;
        setIsAuto(auto);
        onChange(auto ? "auto" : 300);
    };
    return (_jsxs("div", { className: "auto-size", children: [_jsx(TextField, { label: label, type: "number", value: isAuto ? "" : Math.round(value), onChange: (e) => onChange(Math.round(parseInt(e.target.value, 10))), fullWidth: true, margin: "normal", disabled: isAuto }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: isAuto, onChange: handleSwitchChange }), label: "auto" })] }));
};

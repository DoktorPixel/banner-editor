import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Box, TextField, Select, MenuItem, InputAdornment, FormControl, } from "@mui/material";
import { useTranslation } from "react-i18next";
export const LineHeightInput = ({ value, onChange, }) => {
    const { t } = useTranslation();
    const initialUnit = typeof value === "string" && value.endsWith("%") ? "%" : "px";
    const initialNumeric = parseFloat(value.toString()) || 1.2;
    const [unit, setUnit] = useState(initialUnit);
    const [number, setNumber] = useState(initialNumeric);
    useEffect(() => {
        const newUnit = typeof value === "string" && value.endsWith("%") ? "%" : "px";
        const newNumber = parseFloat(value.toString());
        if (!isNaN(newNumber)) {
            setUnit(newUnit);
            setNumber(newNumber);
        }
        else {
            const fallback = newUnit === "%" ? 120 : 20;
            setUnit(newUnit);
            setNumber(fallback);
        }
    }, [value]);
    const handleNumberChange = (e) => {
        const raw = e.target.value;
        if (raw === "") {
            setNumber(NaN);
            onChange("");
            return;
        }
        const parsed = parseFloat(raw);
        setNumber(parsed);
        if (!isNaN(parsed)) {
            onChange(`${parsed}${unit}`);
        }
    };
    const handleBlur = () => {
        if (isNaN(number)) {
            const fallback = unit === "%" ? 120 : 20;
            setNumber(fallback);
            onChange(`${fallback}${unit}`);
        }
    };
    const handleUnitChange = (newUnit) => {
        const defaultValue = newUnit === "%" ? 120 : 20;
        setUnit(newUnit);
        setNumber(defaultValue);
        onChange(`${defaultValue}${newUnit}`);
    };
    return (_jsx(Box, { width: "100%", children: _jsx(FormControl, { fullWidth: true, children: _jsx(TextField, { label: t("sidebar.lineHeight"), type: "number", value: number, onChange: handleNumberChange, onBlur: handleBlur, inputProps: {
                    step: 1,
                    min: 1,
                    max: unit === "%" ? 300 : 100,
                }, InputProps: {
                    endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsxs(Select, { value: unit, onChange: (e) => handleUnitChange(e.target.value), variant: "standard", disableUnderline: true, children: [_jsx(MenuItem, { value: "px", children: "px" }), _jsx(MenuItem, { value: "%", children: "%" })] }) })),
                }, fullWidth: true, margin: "normal" }) }) }));
};

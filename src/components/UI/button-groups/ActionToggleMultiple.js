import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FormControl, Button, TextField, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
function ActionToggle({ options, selected, onChange, }) {
    return (_jsx(FormControl, { fullWidth: true, sx: { marginTop: "6px", marginBottom: "8px" }, children: _jsx("div", { style: {
                display: "flex",
                backgroundColor: "#F1F1F1",
                padding: "3px",
                borderRadius: "5px",
            }, children: options.map((option) => (_jsx(Button, { onClick: () => onChange(option.value), sx: {
                    flex: 1,
                    width: "100%",
                    // minWidth: "42px",
                    minHeight: "30px",
                    height: "29px",
                    padding: "4px 6px",
                    color: "#000000",
                    fontWeight: "400",
                    borderRadius: selected === option.value ? "4px" : "0px",
                    backgroundColor: selected === option.value ? "white" : "#F1F1F1",
                    "&:hover": {
                        backgroundColor: selected === option.value ? "#e3e3e3" : "#f5f5f5",
                    },
                }, children: option.label }, option.value))) }) }));
}
export const ActionToggleMultiple = ({ objectId, value, updateObjectMultipleProperties, }) => {
    const [gapValue, setGapValue] = useState(value !== undefined ? parseInt(value, 10) : undefined);
    const [isAuto, setIsAuto] = useState(gapValue === undefined);
    const { t } = useTranslation();
    useEffect(() => {
        const parsedValue = value !== undefined ? parseInt(value, 10) : undefined;
        setGapValue(parsedValue);
        setIsAuto(parsedValue === undefined);
    }, [value]);
    const handleToggleChange = (selectedValue) => {
        if (selectedValue === "auto") {
            setGapValue(undefined);
            setIsAuto(true);
            updateObjectMultipleProperties(objectId, {
                gap: undefined,
                justifyContent: "space-between",
            });
        }
        else {
            setGapValue(10);
            setIsAuto(false);
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
    return (_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [_jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [_jsx(InputLabel, { sx: { mt: 1, mb: "-15px", fontSize: "12px" }, children: t("selectors.gap") }), _jsx(TextField, { type: "number", value: isAuto ? "" : gapValue ?? "", onChange: handleGapChange, margin: "normal", disabled: isAuto, sx: { maxWidth: "60px", height: "35px" } })] }), _jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [_jsx(InputLabel, { sx: { mt: 1, mb: "-6px", fontSize: "12px" }, children: t("selectors.position") }), _jsx(ActionToggle, { options: [
                            { value: "auto", label: t("sidebar.auto") },
                            { value: "fixed", label: t("sidebar.fixed") },
                        ], selected: isAuto ? "auto" : "fixed", onChange: (value) => handleToggleChange(value) })] })] }));
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, FormControl, Typography } from "@mui/material";
function ActionToggle({ label, options, selected, onChange, }) {
    return (_jsxs(FormControl, { fullWidth: true, sx: { marginTop: "6px", marginBottom: "8px" }, children: [label && (_jsx(Typography, { variant: "caption", sx: { color: "#00000099" }, children: label })), _jsx("div", { style: {
                    display: "flex",
                    backgroundColor: "#F1F1F1",
                    padding: "3px",
                    borderRadius: "5px",
                }, children: options.map((option) => (_jsx(Button, { onClick: () => onChange(option.value), sx: {
                        flex: 1,
                        width: "100%",
                        minWidth: "42px",
                        minHeight: "30px",
                        padding: "4px 6px",
                        color: "#000000",
                        fontWeight: "400",
                        borderRadius: selected === option.value ? "4px" : "0px",
                        backgroundColor: selected === option.value ? "white" : "#F1F1F1",
                        "&:hover": {
                            backgroundColor: selected === option.value ? "#e3e3e3" : "#f5f5f5",
                        },
                    }, children: option.label }, option.value))) })] }));
}
export default ActionToggle;

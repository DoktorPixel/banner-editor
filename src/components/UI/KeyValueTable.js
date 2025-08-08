import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextField, IconButton } from "@mui/material";
import { AddButton } from "../../assets/icons";
import { DeleteFile, AddFile } from "../../assets/icons";
import { useTranslation } from "react-i18next";
const KeyValueTable = ({ keyValuePairs, handleKeyChange, handleValueChange, removeKeyValuePair, addKeyValuePair, handleAddText, }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "variables-panel", children: [_jsxs("div", { className: "table-header", style: { display: "flex" }, children: [_jsx("div", { className: "table-cell", style: { flex: "0 0 40%", padding: "8px" }, children: t("property") }), _jsx("div", { className: "table-cell", style: { flex: "0 0 40%", padding: "8px" }, children: t("value") }), _jsx("div", { className: "table-cell table-actions", style: {
                            flex: "0 0 20%",
                            marginLeft: "-1px",
                        }, children: _jsx(IconButton, { onClick: addKeyValuePair, children: _jsx(AddButton, {}) }) })] }), keyValuePairs.map((pair, index) => (_jsxs("div", { className: "table-row", style: { display: "flex", alignItems: "center" }, children: [_jsx("div", { className: "table-cell", style: { flex: "0 0 40%" }, children: _jsx(TextField, { fullWidth: true, variant: "standard", value: pair.key, onChange: (e) => handleKeyChange(index, e.target.value), placeholder: "key", slotProps: {
                                input: {
                                    disableUnderline: true,
                                    sx: { padding: "6px 4px 6px 8px" },
                                },
                            }, sx: { "& .MuiInputBase-root": { backgroundColor: "white" } } }) }), _jsx("div", { className: "table-cell", style: { flex: "0 0 40%" }, children: _jsx(TextField, { fullWidth: true, variant: "standard", value: pair.value, onChange: (e) => handleValueChange(index, e.target.value), placeholder: "value", slotProps: {
                                input: {
                                    disableUnderline: true,
                                    sx: { padding: "6px 4px 6px 8px" },
                                },
                            }, sx: { "& .MuiInputBase-root": { backgroundColor: "white" } } }) }), _jsxs("div", { className: "table-cell table-actions", style: {
                            flex: "0 0 20%",
                            display: "flex",
                            justifyContent: "space-around",
                        }, children: [_jsx(IconButton, { sx: { padding: "0" }, onClick: () => {
                                    const trimmedKey = pair.key.trim();
                                    if (trimmedKey && trimmedKey !== "{{}}") {
                                        handleAddText?.(`{{${trimmedKey}}}`);
                                    }
                                }, children: _jsx(AddFile, {}) }), _jsx(IconButton, { sx: { padding: "0" }, onClick: () => removeKeyValuePair(index), children: _jsx(DeleteFile, {}) })] })] }, index)))] }));
};
export default KeyValueTable;

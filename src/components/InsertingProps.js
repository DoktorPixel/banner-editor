import { jsx as _jsx } from "react/jsx-runtime";
import KeyValueTable from "./UI/KeyValueTable";
import { useConfig } from "../context/ConfigContext";
import { useBanner } from "../context/BannerContext";
const InsertingProps = () => {
    const { config, setConfig } = useConfig();
    const { addObject } = useBanner();
    const keyValuePairs = config?.keyValuePairs ?? [];
    const updatePairs = (newPairs) => {
        setConfig((prev) => ({
            ...prev,
            ...prev,
            keyValuePairs: newPairs,
        }));
    };
    const handleKeyChange = (index, newKey) => {
        const updated = [...keyValuePairs];
        updated[index].key = newKey;
        updatePairs(updated);
    };
    const handleValueChange = (index, newValue) => {
        const updated = [...keyValuePairs];
        updated[index].value = newValue;
        updatePairs(updated);
    };
    const addKeyValuePair = () => {
        updatePairs([...keyValuePairs, { key: "", value: "" }]);
    };
    const removeKeyValuePair = (index) => {
        updatePairs(keyValuePairs.filter((_, i) => i !== index));
    };
    const handleAddText = (text) => {
        if (!text.trim())
            return;
        addObject({
            id: Date.now(),
            type: "text",
            x: 50,
            y: 50,
            width: 200,
            height: 50,
            content: text,
            fontSize: 16,
            color: "#000000",
            name: "",
        });
    };
    return (_jsx("div", { className: "inserting-props", children: _jsx(KeyValueTable, { keyValuePairs: keyValuePairs, handleKeyChange: handleKeyChange, handleValueChange: handleValueChange, removeKeyValuePair: removeKeyValuePair, addKeyValuePair: addKeyValuePair, handleAddText: handleAddText }) }));
};
export default InsertingProps;

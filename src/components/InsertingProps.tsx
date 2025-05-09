import KeyValueTable from "./UI/KeyValueTable";
import { useConfig } from "../context/ConfigContext";
import { useBanner } from "../context/BannerContext";

const InsertingProps: React.FC = () => {
  const { config, setConfig } = useConfig();

  const { addObject } = useBanner();

  const keyValuePairs = config?.keyValuePairs ?? [];

  const updatePairs = (newPairs: typeof keyValuePairs) => {
    setConfig((prev) => ({
      ...prev,
      ...prev,
      keyValuePairs: newPairs,
    }));
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...keyValuePairs];
    updated[index].key = newKey;
    updatePairs(updated);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...keyValuePairs];
    updated[index].value = newValue;
    updatePairs(updated);
  };

  const addKeyValuePair = () => {
    updatePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const removeKeyValuePair = (index: number) => {
    updatePairs(keyValuePairs.filter((_, i) => i !== index));
  };

  const handleAddText = (text: string) => {
    if (!text.trim()) return;

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

  return (
    <div className="inserting-props">
      <KeyValueTable
        keyValuePairs={keyValuePairs}
        handleKeyChange={handleKeyChange}
        handleValueChange={handleValueChange}
        removeKeyValuePair={removeKeyValuePair}
        addKeyValuePair={addKeyValuePair}
        handleAddText={handleAddText}
      />
    </div>
  );
};

export default InsertingProps;

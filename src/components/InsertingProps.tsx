import KeyValueTable from "./UI/KeyValueTable";
import { useConfig } from "../context/ConfigContext";

const InsertingProps: React.FC = () => {
  const { config, setConfig } = useConfig();
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

  return (
    <div className="inserting-props">
      <KeyValueTable
        keyValuePairs={keyValuePairs}
        handleKeyChange={handleKeyChange}
        handleValueChange={handleValueChange}
        removeKeyValuePair={removeKeyValuePair}
        addKeyValuePair={addKeyValuePair}
      />
    </div>
  );
};

export default InsertingProps;

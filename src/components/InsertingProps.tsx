import { useState, useEffect } from "react";
import KeyValueTable from "./UI/KeyValueTable";

interface KeyValuePair {
  key: string;
  value: string;
}

const InsertingProps: React.FC = () => {
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(() => {
    const savedPairs = sessionStorage.getItem("keyValuePairs");
    return savedPairs
      ? JSON.parse(savedPairs)
      : [
          { key: "title", value: "Назва продукту" },
          { key: "img", value: "https://placehold.co/300" },
          { key: "price", value: "1000" },
        ];
  });

  useEffect(() => {
    sessionStorage.setItem("keyValuePairs", JSON.stringify(keyValuePairs));
  }, [keyValuePairs]);

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...keyValuePairs];
    updated[index].key = newKey;
    setKeyValuePairs(updated);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...keyValuePairs];
    updated[index].value = newValue;
    setKeyValuePairs(updated);
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const removeKeyValuePair = (index: number) => {
    setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index));
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

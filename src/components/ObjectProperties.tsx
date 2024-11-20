import { useState } from "react";
import { BannerObject } from "../types";
import styles from "../styles/modules/ObjectProperties.module.scss";

interface ObjectPropertiesProps {
  selectedObject: BannerObject;
  updateObject: (id: number, updatedProperties: Partial<BannerObject>) => void;
}

const ObjectProperties: React.FC<ObjectPropertiesProps> = ({
  selectedObject,
  updateObject,
}) => {
  const [localProperties, setLocalProperties] =
    useState<BannerObject>(selectedObject);

  const updateProperties = (key: keyof BannerObject, value: unknown) => {
    setLocalProperties((prev) => ({ ...prev, [key]: value }));
    updateObject(selectedObject.id, { [key]: value });
  };

  return (
    <div className={styles.properties}>
      {selectedObject.type === "text" && (
        <>
          <label>
            Текст:
            <input
              type="text"
              value={localProperties.content || ""}
              onChange={(e) => updateProperties("content", e.target.value)}
            />
          </label>
          <label>
            Колір:
            <input
              type="color"
              value={localProperties.color || "#000"}
              onChange={(e) => updateProperties("color", e.target.value)}
            />
          </label>
          <label>
            Розмір шрифта:
            <input
              type="number"
              value={localProperties.fontSize || 16}
              onChange={(e) => updateProperties("fontSize", +e.target.value)}
            />
          </label>
        </>
      )}
    </div>
  );
};

export default ObjectProperties;

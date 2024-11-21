import { useState } from "react";
import { useBanner } from "../context/BannerContext";
import { BannerObject } from "../types";

const ObjectProperties: React.FC = () => {
  const { objects, updateObject } = useBanner();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedObject = objects.find((obj) => obj.id === selectedId);

  const handleChange = (key: keyof BannerObject, value: any) => {
    if (selectedId !== null) {
      updateObject(selectedId, { [key]: value });
    }
  };

  return (
    <div className="object-properties">
      <h3>Свойства объекта</h3>
      {selectedObject ? (
        <>
          {selectedObject.type === "text" && (
            <>
              <label>
                Текст:
                <input
                  type="text"
                  value={selectedObject.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                />
              </label>
              <label>
                Размер шрифта:
                <input
                  type="number"
                  value={selectedObject.fontSize || 16}
                  onChange={(e) =>
                    handleChange("fontSize", parseInt(e.target.value))
                  }
                />
              </label>
              <label>
                Цвет:
                <input
                  type="color"
                  value={selectedObject.color || "#000000"}
                  onChange={(e) => handleChange("color", e.target.value)}
                />
              </label>
            </>
          )}
          {selectedObject.type === "image" && (
            <>
              <label>
                URL изображения:
                <input
                  type="text"
                  value={selectedObject.src || ""}
                  onChange={(e) => handleChange("src", e.target.value)}
                />
              </label>
            </>
          )}
        </>
      ) : (
        <p>Выберите объект для редактирования</p>
      )}
      <div className="object-list">
        <h4>Список объектов</h4>
        <ul>
          {objects.map((obj) => (
            <li
              key={obj.id}
              onClick={() => setSelectedId(obj.id)}
              style={{
                cursor: "pointer",
                fontWeight: obj.id === selectedId ? "bold" : "normal",
              }}
            >
              {obj.type === "text" ? obj.content || "Текст" : "Изображение"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ObjectProperties;

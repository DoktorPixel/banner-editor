import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ObjectProperties from "./components/ObjectProperties";
import BannerArea from "./components/BannerArea";
import { BannerObject } from "./types";
import styles from "./styles/modules/App.module.scss";

const App: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<BannerObject | null>(
    null
  );
  const [objects, setObjects] = useState<BannerObject[]>(
    JSON.parse(localStorage.getItem("banner-objects") || "[]")
  );

  const updateObject = (
    id: number,
    updatedProperties: Partial<BannerObject>
  ) => {
    setObjects((prev) => {
      const updatedObjects = prev.map((obj) =>
        obj.id === id ? { ...obj, ...updatedProperties } : obj
      );
      localStorage.setItem("banner-objects", JSON.stringify(updatedObjects));
      return updatedObjects;
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.app}>
        <Sidebar setObjects={setObjects} />
        <BannerArea
          objects={objects}
          setSelectedObject={setSelectedObject}
          setObjects={setObjects}
        />
        {selectedObject && (
          <ObjectProperties
            selectedObject={selectedObject}
            updateObject={updateObject}
          />
        )}
      </div>
    </div>
  );
};

export default App;


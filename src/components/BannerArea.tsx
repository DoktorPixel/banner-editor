import { BannerObject } from "../types";
import styles from "../styles/modules/BannerArea.module.scss";

interface BannerAreaProps {
  objects: BannerObject[];
  setSelectedObject: React.Dispatch<React.SetStateAction<BannerObject | null>>;
  setObjects: React.Dispatch<React.SetStateAction<BannerObject[]>>;
}

const BannerArea: React.FC<BannerAreaProps> = ({
  objects,
  setSelectedObject,
  setObjects,
}) => {
  const onDrag = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    const deltaX = e.movementX;
    const deltaY = e.movementY;

    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === id ? { ...obj, x: obj.x + deltaX, y: obj.y + deltaY } : obj
      )
    );
  };

  const deleteObject = (id: number) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
  };

  return (
    <div className={styles.bannerArea}>
      {objects.map((obj) => (
        <div
          key={obj.id}
          style={{ top: obj.y, left: obj.x }}
          className={styles.object}
          onMouseDown={() => setSelectedObject(obj)}
          draggable
          onDrag={(e) => onDrag(e, obj.id)}
        >
          {obj.type === "text" && (
            <span style={{ fontSize: obj.fontSize, color: obj.color }}>
              {obj.content}
            </span>
          )}
          {obj.type === "image" && (
            <img
              src={obj.src}
              alt=""
              style={{ width: obj.width, height: obj.height }}
            />
          )}
          <button onClick={() => deleteObject(obj.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default BannerArea;

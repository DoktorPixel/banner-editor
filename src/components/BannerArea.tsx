import { useState } from "react";
import { useBanner } from "../context/BannerContext";

const BannerArea: React.FC = () => {
  const { objects, updateObject } = useBanner();
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const handleMouseDown = (id: number, event: React.MouseEvent) => {
    setDraggingId(id);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggingId !== null) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      updateObject(draggingId, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      className="banner-area"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {objects.map((object) => (
        <div
          key={object.id}
          style={{
            position: "absolute",
            left: object.x,
            top: object.y,
            cursor: "move",
          }}
          onMouseDown={(e) => handleMouseDown(object.id, e)}
        >
          {object.type === "text" ? (
            <p style={{ fontSize: object.fontSize, color: object.color }}>
              {object.content}
            </p>
          ) : (
            <img
              src={object.src}
              alt=""
              style={{ width: "300px", height: "300px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerArea;

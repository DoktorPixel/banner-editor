import { useState, useRef } from "react";
import { useBanner } from "../context/BannerContext";

const BannerArea: React.FC = () => {
  const { objects, updateObject } = useBanner();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (id: number, event: React.MouseEvent) => {
    event.preventDefault(); // Отключает выделение текста при перетаскивании
    setDraggingId(id);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggingId !== null && bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      updateObject(draggingId, { x, y });
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      className="banner-area"
      ref={bannerRef}
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
            width: object.width || "auto",
            height: object.height || "auto",
          }}
          onMouseDown={(e) => handleMouseDown(object.id, e)}
        >
          {object.type === "text" ? (
            <p
              style={{
                fontSize: object.fontSize,
                color: object.color,
              }}
            >
              {object.content}
            </p>
          ) : (
            <img
              src={object.src}
              alt="img"
              style={{
                width: object.width || 300,
                height: object.height || 300,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerArea;

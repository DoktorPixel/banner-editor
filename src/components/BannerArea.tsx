import { useState, useRef } from "react";
import { useBanner } from "../context/BannerContext";

const BannerArea: React.FC = () => {
  const { objects, updateObject, selectedObjectId, selectObject } = useBanner();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (id: number, event: React.MouseEvent) => {
    event.preventDefault();

    const object = objects.find((obj) => obj.id === id);
    if (object && bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + object.x);
      const offsetY = event.clientY - (rect.top + object.y);
      setOffset({ x: offsetX, y: offsetY });
      setDraggingId(id);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggingId !== null && bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - offset.x;
      const y = event.clientY - rect.top - offset.y;

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
            zIndex: object.zIndex || 0,
            cursor: "move",
            width: object.width || "auto",
            height: object.height || "auto",
          }}
          onMouseDown={(e) => handleMouseDown(object.id, e)}
          className={`banner-object ${
            selectedObjectId === object.id ? "selected" : ""
          }`}
          onClick={() => selectObject(object.id)}
        >
          {object.type === "text" ? (
            <p
              style={{
                fontSize: object.fontSize,
                color: object.color,
                fontWeight: object.fontWeight,
                fontStyle: object.fontStyle,
                textTransform: object.textTransform,
                textDecoration: object.textDecoration,
                textAlign: object.textAlign,
                width: object.width || 300,
                height: object.height || 50,
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

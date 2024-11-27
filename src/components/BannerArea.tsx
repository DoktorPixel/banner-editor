import { useState, useRef } from "react";
import { useBanner } from "../context/BannerContext";

const BannerArea: React.FC = () => {
  const { objects, updateObject, selectedObjectId, selectObject } = useBanner();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [resizingId, setResizingId] = useState<number | null>(null);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
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

  const handleResizeMouseDown = (
    id: number,
    direction: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setResizingId(id);
    setResizeDirection(direction);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggingId !== null && bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - offset.x;
      const y = event.clientY - rect.top - offset.y;

      updateObject(draggingId, { x, y });
    }

    if (resizingId !== null && bannerRef.current) {
      const object = objects.find((obj) => obj.id === resizingId);
      if (object) {
        const rect = bannerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const updates: Partial<typeof object> = {};
        if (resizeDirection?.includes("right")) {
          updates.width = mouseX - object.x;
        }
        if (resizeDirection?.includes("bottom")) {
          updates.height = mouseY - object.y;
        }

        updateObject(resizingId, updates);
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
    setResizeDirection(null);
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
            width: object.width || 300,
            height: object.height || 300,
            zIndex: object.zIndex || 0,
            cursor: "move",
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
                wordBreak: "break-all",
              }}
            >
              {object.content}
            </p>
          ) : (
            <img
              src={object.src}
              alt="img"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}

          <div
            className={`resize-handle bottom-right ${
              selectedObjectId === object.id ? "selected" : ""
            }`}
            onMouseDown={(e) =>
              handleResizeMouseDown(object.id, "bottom-right", e)
            }
          ></div>
        </div>
      ))}
    </div>
  );
};

export default BannerArea;

import { useState, useRef } from "react";
import { useBanner } from "../context/BannerContext";
import { BannerChild } from "../types";

const BannerArea: React.FC = () => {
  const {
    objects,
    updateObject,
    selectedObjectIds,
    selectObject,
    clearSelection,

    selectedChildId,
    selectChild,
    clearChildSelection,
  } = useBanner();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [resizingId, setResizingId] = useState<number | null>(null);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleChildClick = (
    groupId: number,
    childId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    selectChild(groupId, childId);
    console.log("childId", childId);
    console.log("groupId", groupId);
  };

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

  const handleObjectClick = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    selectObject(id, event.ctrlKey || event.metaKey);
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
      onClick={() => {
        clearSelection();
        clearChildSelection();
      }}
    >
      {objects.map((object) => {
        if (object.type === "group") {
          return (
            <div
              key={object.id}
              style={{
                position: "absolute",
                left: object.x,
                top: object.y,
                width: object.width,
                height: object.height,
                zIndex: object.zIndex,
                display: object.display || "flex",
                flexDirection: object.flexDirection,
                justifyContent: object.justifyContent,
                alignItems: object.alignItems,
                // border: "1px dashed gray",
                gap: object.gap || "10px",
              }}
              onMouseDown={(e) => handleMouseDown(object.id, e)}
              onClick={(e) => {
                handleObjectClick(object.id, e);
                clearChildSelection();
              }}
              className={`banner-object ${
                selectedObjectIds.includes(object.id) ? "selected" : ""
              }`}
            >
              {object.children?.map((child: BannerChild, index: number) => (
                <p
                  key={child.id || index}
                  style={{
                    fontSize: child.fontSize,
                    color: child.color,
                    fontWeight: child.fontWeight,
                    fontStyle: child.fontStyle,
                    textTransform: child.textTransform,
                    textDecoration: child.textDecoration,
                    textAlign: child.textAlign,
                    // width: child.width,
                    // height: child.height,

                    border:
                      selectedChildId?.groupId === object.id &&
                      selectedChildId.childId === child.id
                        ? "1px solid blue"
                        : "none",
                  }}
                  onDoubleClick={(e) =>
                    handleChildClick(object.id, child.id, e)
                  }
                >
                  {child.type === "text" ? child.content : null}
                </p>
              ))}

              <div
                className={`resize-handle bottom-right ${
                  selectedObjectIds[0] === object.id ? "selected" : ""
                }`}
                onMouseDown={(e) =>
                  handleResizeMouseDown(object.id, "bottom-right", e)
                }
              ></div>
            </div>
          );
        }

        return (
          <div
            key={object.id}
            style={{
              position: "absolute",
              left: object.x,
              top: object.y,
              width: object.width,
              height: object.height,
              zIndex: object.zIndex,
              cursor: "move",
            }}
            onMouseDown={(e) => handleMouseDown(object.id, e)}
            onClick={(e) => handleObjectClick(object.id, e)}
            className={`banner-object ${
              selectedObjectIds.includes(object.id) ? "selected" : ""
            }`}
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
                selectedObjectIds[0] === object.id ? "selected" : ""
              }`}
              onMouseDown={(e) =>
                handleResizeMouseDown(object.id, "bottom-right", e)
              }
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default BannerArea;

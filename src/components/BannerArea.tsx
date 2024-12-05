import { useState, useRef } from "react";
import { useBanner } from "../context/BannerContext";
import { BannerChild } from "../types";

const SNAP_DISTANCE = 15;

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
  const [showHorizontalLine, setShowHorizontalLine] = useState(false);
  const [showVerticalLine, setShowVerticalLine] = useState(false);

  const [isNearRight, setIsNearRight] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);

  const handleChildClick = (
    groupId: number,
    childId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    selectChild(groupId, childId);
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
    event.stopPropagation();
    setResizingId(id);
    setResizeDirection(direction);
  };

  const handleObjectClick = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    selectObject(id, event.ctrlKey || event.metaKey);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = bannerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (draggingId !== null) {
      const x = event.clientX - rect.left - offset.x;
      const y = event.clientY - rect.top - offset.y;

      const object = objects.find((obj) => obj.id === draggingId);
      const objectWidth = object?.width ?? 0;
      const objectHeight = object?.height ?? 0;

      let snappedX = x;
      let snappedY = y;

      const isNearLeft = Math.abs(x) <= SNAP_DISTANCE;

      setIsNearRight(Math.abs(x + objectWidth - rect.width) <= SNAP_DISTANCE);
      setIsNearBottom(
        Math.abs(y + objectHeight - rect.height) <= SNAP_DISTANCE
      );

      if (isNearRight) {
        snappedX = rect.width - objectWidth;
        setShowVerticalLine(true);
      }
      if (isNearBottom) {
        snappedY = rect.height - objectHeight;
        setShowHorizontalLine(true);
      }
      const isNearTop = Math.abs(y) <= SNAP_DISTANCE;

      if (isNearLeft) snappedX = 0;
      if (isNearRight) snappedX = rect.width - objectWidth;
      if (isNearTop) snappedY = 0;
      if (isNearBottom) snappedY = rect.height - objectHeight;

      setShowVerticalLine(isNearLeft || isNearRight);
      setShowHorizontalLine(isNearTop || isNearBottom);

      objects.forEach((obj) => {
        if (obj.id !== draggingId) {
          if (Math.abs(x - obj.x) <= SNAP_DISTANCE) snappedX = obj.x;
          if (
            Math.abs(x + objectWidth - (obj.x + (obj.width ?? 0))) <=
            SNAP_DISTANCE
          )
            snappedX = obj.x + (obj.width ?? 0) - objectWidth;
          if (Math.abs(y - obj.y) <= SNAP_DISTANCE) snappedY = obj.y;
          if (
            Math.abs(y + objectHeight - (obj.y + (obj.height ?? 0))) <=
            SNAP_DISTANCE
          )
            snappedY = obj.y + (obj.height ?? 0) - objectHeight;
        }
      });

      updateObject(draggingId, { x: snappedX, y: snappedY });
    }

    if (resizingId !== null) {
      const object = objects.find((obj) => obj.id === resizingId);
      if (!object) return;

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const updates: Partial<typeof object> = {};
      // const objectWidth = object.width ?? 0;
      // const objectHeight = object.height ?? 0;

      if (resizeDirection?.includes("right")) {
        const newWidth = mouseX - object.x;
        updates.width =
          Math.abs(newWidth - rect.width) <= SNAP_DISTANCE
            ? rect.width - object.x
            : newWidth;
      }
      if (resizeDirection?.includes("bottom")) {
        const newHeight = mouseY - object.y;
        updates.height =
          Math.abs(newHeight - rect.height) <= SNAP_DISTANCE
            ? rect.height - object.y
            : newHeight;
      }

      objects.forEach((obj) => {
        if (obj.id !== resizingId) {
          if (resizeDirection?.includes("right")) {
            const newWidth = mouseX - object.x;
            if (Math.abs(newWidth - obj.x) <= SNAP_DISTANCE)
              updates.width = obj.x - object.x;
            if (
              Math.abs(newWidth - (obj.x + (obj.width ?? 0))) <= SNAP_DISTANCE
            )
              updates.width = obj.x + (obj.width ?? 0) - object.x;
          }
          if (resizeDirection?.includes("bottom")) {
            const newHeight = mouseY - object.y;
            if (Math.abs(newHeight - obj.y) <= SNAP_DISTANCE)
              updates.height = obj.y - object.y;
            if (
              Math.abs(newHeight - (obj.y + (obj.height ?? 0))) <= SNAP_DISTANCE
            )
              updates.height = obj.y + (obj.height ?? 0) - object.y;
          }
        }
      });

      updateObject(resizingId, updates);
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
    setResizeDirection(null);
    setShowHorizontalLine(false);
    setShowVerticalLine(false);
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
      {showVerticalLine && (
        <div
          className={`banner-anchor-line vertical ${
            isNearRight ? "right" : ""
          }`}
        ></div>
      )}
      {showHorizontalLine && (
        <div
          className={`banner-anchor-line horizontal ${
            isNearBottom ? "bottom" : ""
          }`}
        ></div>
      )}

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
                  className={`banner-object-child ${
                    selectedChildId?.groupId === object.id &&
                    selectedChildId.childId === child.id
                      ? "selected"
                      : ""
                  }`}
                  key={child.id || index}
                  style={{
                    fontSize: child.fontSize,
                    color: child.color,
                    fontWeight: child.fontWeight,
                    fontStyle: child.fontStyle,
                    textTransform: child.textTransform,
                    textDecoration: child.textDecoration,
                    textAlign: child.textAlign,
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

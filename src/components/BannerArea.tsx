import { useState, useEffect, useRef } from "react";
import { useBanner } from "../context/BannerContext";
import { BannerObject, BannerChild, ResizeDirection } from "../types";
import { calculateResizeUpdates } from "../utils/calculateResizeUpdates";
import ResizeHandles from "./UI/ResizeHandles";

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
  const [temporaryUpdates, setTemporaryUpdates] = useState<{
    [key: number]: Partial<BannerObject>;
  }>({});

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
    if (resizingId !== null) return;

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
    if (draggingId !== null && resizingId === null && bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - offset.x;
      const y = event.clientY - rect.top - offset.y;

      setTemporaryUpdates((prev) => ({
        ...prev,
        [draggingId]: { x, y },
      }));
    }

    if (resizingId !== null && bannerRef.current) {
      const object = objects.find((obj) => obj.id === resizingId);

      if (object) {
        const rect = bannerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const updates = calculateResizeUpdates({
          resizeDirection: resizeDirection as ResizeDirection,
          mouseX,
          mouseY,
          object: {
            x: object.x ?? 0,
            y: object.y ?? 0,
            width: object.width ?? 0,
            height: object.height ?? 0,
          },
        });

        setTemporaryUpdates((prev) => ({
          ...prev,
          [resizingId]: { ...temporaryUpdates[resizingId], ...updates },
        }));
      }
    }
  };

  const handleMouseUp = () => {
    if (draggingId !== null) {
      if (temporaryUpdates[draggingId]) {
        updateObject(draggingId, temporaryUpdates[draggingId]);
      }
    }
    if (resizingId !== null) {
      if (temporaryUpdates[resizingId]) {
        updateObject(resizingId, temporaryUpdates[resizingId]);
      }
    }

    setDraggingId(null);
    setResizingId(null);
    setResizeDirection(null);
    setTemporaryUpdates({});
  };
  //
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!selectedObjectIds.length) return;

    const increment = event.shiftKey ? 10 : 1;
    let deltaX = 0;
    let deltaY = 0;

    if (event.key === "ArrowUp") deltaY = -increment;
    if (event.key === "ArrowDown") deltaY = increment;
    if (event.key === "ArrowLeft") deltaX = -increment;
    if (event.key === "ArrowRight") deltaX = increment;

    if (deltaX !== 0 || deltaY !== 0) {
      selectedObjectIds.forEach((id) => {
        const object = objects.find((obj) => obj.id === id);
        if (object) {
          updateObject(id, {
            x: (object.x || 0) + deltaX,
            y: (object.y || 0) + deltaY,
          });
        }
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObjectIds, objects]);

  const renderedObjects = objects.map((obj) => ({
    ...obj,
    ...(temporaryUpdates[obj.id] || {}),
  }));

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
      {renderedObjects.map((object) => {
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

              <ResizeHandles
                objectId={object.id}
                selectedObjectId={selectedObjectIds[0]}
                handleResizeMouseDown={handleResizeMouseDown}
              />
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
              width: object.autoWidth ? "auto" : object.width, //
              height: object.height,
              zIndex: object.zIndex,
              cursor: "move",
              overflow: object.autoWidth ? "visible" : "hidden", //
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
                  //
                  display: object.maxLines ? "-webkit-box" : "block",
                  WebkitLineClamp: object.maxLines,
                  WebkitBoxOrient: object.maxLines ? "vertical" : undefined,
                  overflow: object.maxLines ? "hidden" : undefined,
                  whiteSpace: object.autoWidth ? "nowrap" : "normal",
                }}
              >
                {object.content}
              </p>
            ) : object.type === "image" ? (
              <img
                src={object.src}
                alt="img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: object.objectFit,
                }}
              />
            ) : object.type === "figure" ? (
              <div
                className="banner-figure"
                style={{
                  backgroundColor: object.backgroundColor,
                  borderStyle: object.borderStyle,
                  borderColor: object.borderColor,
                  borderWidth: object.borderWidth,
                  borderRadius: object.borderRadius,
                  opacity: object.opacity,
                }}
              ></div>
            ) : null}

            <ResizeHandles
              objectId={object.id}
              selectedObjectId={selectedObjectIds[0]}
              handleResizeMouseDown={handleResizeMouseDown}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BannerArea;

import { useState, useEffect, useRef, Fragment } from "react";
import { useBanner } from "../context/BannerContext";
import { useMode } from "../context/ModeContext";
import { ResizeDirection } from "../types";
import { calculateResizeUpdates } from "../utils/calculateResizeUpdates";
import ResizeHandles from "../utils/ResizeHandles";
import ContextMenu from "./UI/ContextMenu";
import { BannerObject } from "../types";

import { useSelectionBounds } from "../utils/hooks";

const BannerArea: React.FC = () => {
  const {
    objects,
    updateObject,
    updateMultipleObjects,
    selectedObjectIds,
    selectObject,
    clearSelection,
    selectedChildId,
    selectChild,
    clearChildSelection,
    //
    temporaryUpdates,
    setTemporaryUpdates,
    renderedObjects,
  } = useBanner();
  const { mode } = useMode();
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIds, setDraggingIds] = useState<number[] | null>(null);
  const [offsets, setOffsets] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const [mouseDownPosition, setMouseDownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [resizingId, setResizingId] = useState<number | null>(null);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);

  const bannerRef = useRef<HTMLDivElement>(null);

  //
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    object: BannerObject | null;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, object: BannerObject) => {
    event.preventDefault();
    event.stopPropagation();

    if (bannerRef.current) {
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        object: object,
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  //
  // const handleObjectClick = (id: number, event: React.MouseEvent) => {
  //   if (mode === "test" || isDragging) return;
  //   event.stopPropagation();
  //   selectObject(id, event.ctrlKey || event.metaKey);
  // };
  const handleObjectClick = (id: number, event: React.MouseEvent) => {
    if (mode === "test" || isDragging) return;
    event.stopPropagation();
    if (mouseDownPosition) {
      const deltaX = Math.abs(event.clientX - mouseDownPosition.x);
      const deltaY = Math.abs(event.clientY - mouseDownPosition.y);

      if (deltaX < 5 && deltaY < 5) {
        selectObject(id, event.ctrlKey || event.metaKey);
      }
    }
    setMouseDownPosition(null);
  };

  const handleChildClick = (
    groupId: number,
    childId: number,
    event: React.MouseEvent,
    parentId?: number
  ) => {
    event.stopPropagation();
    selectChild(groupId, childId, parentId);
  };

  const handleResizeMouseDown = (
    id: number,
    direction: string,
    event: React.MouseEvent
  ) => {
    if (mode === "test") return;
    event.preventDefault();
    setResizingId(id);
    setResizeDirection(direction);
  };

  const handleMouseDown = (id: number, event: React.MouseEvent) => {
    if (mode === "test" || resizingId !== null) return;
    event.preventDefault();
    event.stopPropagation();
    setMouseDownPosition({ x: event.clientX, y: event.clientY });

    // Если объект уже выделен, не сбрасываем выделение
    const isSelected = selectedObjectIds.includes(id);
    const shouldKeepSelection = event.ctrlKey || event.metaKey || isSelected;

    const movingObjects = shouldKeepSelection ? [...selectedObjectIds] : [id];

    setDraggingIds(movingObjects);
    setIsDragging(true);

    const newOffsets: Record<number, { x: number; y: number }> = {};
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();

      movingObjects.forEach((objId) => {
        const obj = objects.find((o) => o.id === objId);
        if (obj) {
          newOffsets[objId] = {
            x: event.clientX - (rect.left + obj.x),
            y: event.clientY - (rect.top + obj.y),
          };
        }
      });
    }
    setOffsets(newOffsets);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (mode === "test") return;

    if (draggingIds !== null && resizingId === null && bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();

      setTemporaryUpdates((prev) => {
        const newUpdates = { ...prev };

        draggingIds.forEach((id) => {
          const obj = objects.find((o) => o.id === id);
          if (obj) {
            newUpdates[id] = {
              x: event.clientX - rect.left - offsets[id].x,
              y: event.clientY - rect.top - offsets[id].y,
            };
          }
        });

        return newUpdates;
      });
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
    if (mode === "test") return;

    if (draggingIds !== null && Object.keys(temporaryUpdates).length > 0) {
      updateMultipleObjects(temporaryUpdates);
    }

    if (resizingId !== null && temporaryUpdates[resizingId]) {
      updateObject(resizingId, temporaryUpdates[resizingId]);
    }

    setDraggingIds(null);
    setResizingId(null);
    setResizeDirection(null);
    setTemporaryUpdates({});
    setIsDragging(false);
  };

  //

  useEffect(() => {
    if (mode === "dev") {
      setTemporaryUpdates({});
    }
  }, [mode]);
  //
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      mode === "test" ||
      !selectedObjectIds.length ||
      (event.target instanceof HTMLElement &&
        ["input", "textarea", "select"].includes(
          event.target.tagName.toLowerCase()
        ))
    ) {
      return; //test
    }

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

  const selectionBounds = useSelectionBounds(selectedObjectIds, objects);
  // Начинаем перемещать все выделенные объекты
  const handleSelectionBorderMouseDown = (event: React.MouseEvent) => {
    if (mode === "test") return;
    event.preventDefault();
    event.stopPropagation();
    if (event.target !== event.currentTarget) return;

    setDraggingIds([...selectedObjectIds]);
    setIsDragging(true);

    const newOffsets: Record<number, { x: number; y: number }> = {};
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();

      selectedObjectIds.forEach((id) => {
        const obj = objects.find((o) => o.id === id);
        if (obj) {
          newOffsets[id] = {
            x: event.clientX - (rect.left + obj.x),
            y: event.clientY - (rect.top + obj.y),
          };
        }
      });
    }
    setOffsets(newOffsets);
  };

  useEffect(() => {
    objects.forEach((object) => {
      if (object.autoWidth && objectRefs.current[object.id]) {
        const realWidth = objectRefs.current[object.id]!.offsetWidth;
        if (object.width !== realWidth) {
          updateObject(object.id, { width: realWidth });
        }
      }
      if (object.autoHeight && objectRefs.current[object.id]) {
        const realHeight = objectRefs.current[object.id]!.offsetHeight;
        if (object.height !== realHeight) {
          updateObject(object.id, { height: realHeight });
        }
      }
    });
  }, [updateObject, objects]);

  const objectRefs = useRef<Record<number, HTMLDivElement | null>>({});

  return (
    <div className="banner-area-container">
      <div
        className="banner-area"
        ref={bannerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          clearSelection();
          clearChildSelection();
          setContextMenu(null);
        }}
      >
        {selectionBounds && !isDragging && (
          <div
            className="selection-border"
            style={{
              position: "absolute",
              left: selectionBounds.left,
              top: selectionBounds.top,
              width: selectionBounds.width,
              height: selectionBounds.height,
              border: "1px dashed rgba(191, 191, 221, 0.75)",
              pointerEvents: "none",

              // pointerEvents: "all",
              // cursor: "move",
            }}
            onMouseDownCapture={handleSelectionBorderMouseDown}
          />
        )}

        {renderedObjects.map((object) => {
          if (object.type === "group") {
            return (
              <Fragment key={object.id}>
                <div
                  id={`${object.id}`}
                  data-condition={JSON.stringify(object.condition)}
                  ref={(el) => (objectRefs.current[object.id] = el)}
                  style={{
                    position: "absolute",
                    left: object.x,
                    top: object.y,
                    // width: object.width,
                    width: object.autoWidth ? "auto" : object.width,
                    // overflow: object.autoWidth ? "visible" : "hidden",
                    // height: object.height,
                    height: object.autoHeight ? "auto" : object.height,
                    zIndex: object.zIndex,
                  }}
                  onMouseDown={(e) => handleMouseDown(object.id, e)}
                  onClick={(e) => {
                    handleObjectClick(object.id, e);
                    clearChildSelection();
                  }}
                  onContextMenu={(e) => handleContextMenu(e, object)}
                  className={`banner-object ${
                    selectedObjectIds.includes(object.id) ? "selected" : ""
                  }`}
                >
                  <div
                    style={{
                      width: object.autoWidth ? "auto" : object.width,
                      height: object.autoHeight ? "auto" : object.height,
                      display: object.display || "flex",
                      flexDirection: object.flexDirection,
                      justifyContent: object.justifyContent,
                      alignItems: object.alignItems,
                      gap: object.gap || 0,
                      transform: `rotate(${object.rotate || 0}deg)`,
                      //
                      backgroundColor: object.backgroundColor,
                      borderRadius: object.borderRadius,
                      opacity: object.opacity,
                      borderTopStyle: object.borderTopStyle,
                      borderTopColor: object.borderTopColor,
                      borderTopWidth: object.borderTopWidth,
                      borderBottomStyle: object.borderBottomStyle,
                      borderBottomColor: object.borderBottomColor,
                      borderBottomWidth: object.borderBottomWidth,
                      borderLeftStyle: object.borderLeftStyle,
                      borderLeftColor: object.borderLeftColor,
                      borderLeftWidth: object.borderLeftWidth,
                      borderRightStyle: object.borderRightStyle,
                      borderRightColor: object.borderRightColor,
                      borderRightWidth: object.borderRightWidth,
                      //
                      paddingTop: object.paddingTop,
                      paddingBottom: object.paddingBottom,
                      paddingLeft: object.paddingLeft,
                      paddingRight: object.paddingRight,
                    }}
                  >
                    {object.children?.map((child) => {
                      if (child.type === "text") {
                        return (
                          <div
                            key={child.id}
                            id={`${child.id}`}
                            data-condition={JSON.stringify(child.condition)}
                            className={`text-field banner-object-child ${
                              selectedChildId?.groupId === object.id &&
                              selectedChildId.childId === child.id
                                ? "selected"
                                : ""
                            }`}
                            style={{
                              fontSize: child.fontSize,
                              color: child.color,
                              fontFamily: child.fontFamily,
                              fontWeight: child.fontWeight,
                              fontStyle: child.fontStyle,
                              textDecoration: child.textDecoration,
                              textAlign: child.textAlign,
                              border:
                                selectedChildId?.groupId === object.id &&
                                selectedChildId.childId === child.id
                                  ? "1px solid blue"
                                  : "none",
                              transform: `rotate(${child.rotate || 0}deg)`,
                            }}
                            onDoubleClick={(e) =>
                              handleChildClick(
                                object.id,
                                child.id,
                                e,
                                undefined
                              )
                            }
                          >
                            {child.content}
                          </div>
                        );
                      } else if (child.type === "image") {
                        return (
                          <img
                            id={`${child.id}`}
                            data-condition={JSON.stringify(child.condition)}
                            key={child.id}
                            src={child.src}
                            alt={child.name || "image"}
                            style={{
                              width: child.width,
                              height: child.height,
                              objectFit: child.objectFit,
                              transform: `rotate(${child.rotate || 0}deg)`,
                            }}
                            onDoubleClick={(e) =>
                              handleChildClick(
                                object.id,
                                child.id,
                                e,
                                undefined
                              )
                            }
                            className={`banner-object-child image-field ${
                              selectedChildId?.groupId === object.id &&
                              selectedChildId.childId === child.id
                                ? "selected"
                                : ""
                            }`}
                          />
                        );
                      } else if (child.type === "figure") {
                        const { id, width, height, rotate, ...figureStyles } =
                          child;
                        return (
                          <div
                            key={id}
                            id={`${child.id}`}
                            data-condition={JSON.stringify(child.condition)}
                            style={{
                              transform: `rotate(${rotate ?? 0}deg)`,
                            }}
                            onDoubleClick={(e) =>
                              handleChildClick(
                                object.id,
                                child.id,
                                e,
                                undefined
                              )
                            }
                            className={`banner-object-child ${
                              selectedChildId?.groupId === object.id &&
                              selectedChildId.childId === child.id
                                ? "selected"
                                : ""
                            }`}
                          >
                            <div
                              style={{
                                position: "relative",
                                width: width ?? "100px",
                                height: height ?? "100px",
                                ...figureStyles,
                              }}
                            ></div>
                          </div>
                        );
                      } else if (child.type === "group") {
                        const { id, children, rotate, ...groupStyles } = child;
                        return (
                          <div
                            id={`${id}`}
                            data-condition={JSON.stringify(child.condition)}
                            style={{
                              transform: `rotate(${rotate ?? 0}deg)`,
                            }}
                            className={`banner-object-child ${
                              selectedChildId?.groupId === object.id &&
                              selectedChildId.childId === child.id
                                ? "selected"
                                : ""
                            }`}
                            onDoubleClick={(e) =>
                              handleChildClick(
                                object.id,
                                child.id,
                                e,
                                undefined
                              )
                            }
                          >
                            <div
                              style={{
                                width: "auto",
                                position: "relative",
                                ...groupStyles,
                              }}
                            >
                              {children?.map((nestedChild) => {
                                const {
                                  id: nestedId,
                                  condition,
                                  content,
                                  rotate,
                                  src,
                                  ...nestedStyles
                                } = nestedChild;
                                if (nestedChild.type === "image") {
                                  return (
                                    <img
                                      key={nestedId}
                                      id={`${nestedId}`}
                                      data-condition={JSON.stringify(condition)}
                                      src={src}
                                      alt={"image"}
                                      style={{
                                        ...nestedStyles,
                                      }}
                                      className={`image-field banner-object-child ${
                                        selectedChildId?.groupId === child.id &&
                                        selectedChildId.childId ===
                                          nestedChild.id
                                          ? "selected-grand-child"
                                          : ""
                                      }`}
                                      onDoubleClick={(e) =>
                                        handleChildClick(
                                          child.id,
                                          nestedChild.id,
                                          e,
                                          object.id
                                        )
                                      }
                                    />
                                  );
                                } else if (nestedChild.type === "text") {
                                  return (
                                    <div
                                      id={`${nestedId}`}
                                      data-condition={JSON.stringify(condition)}
                                      key={nestedId}
                                      style={{
                                        ...nestedStyles,
                                        transform: `rotate(${rotate ?? 0}deg)`,
                                        position: "relative",
                                        width: "auto",
                                        height: "auto",
                                      }}
                                      className={`image-field banner-object-child ${
                                        selectedChildId?.groupId === child.id &&
                                        selectedChildId.childId ===
                                          nestedChild.id
                                          ? "selected-grand-child"
                                          : ""
                                      }`}
                                      onDoubleClick={(e) =>
                                        handleChildClick(
                                          child.id,
                                          nestedChild.id,
                                          e,
                                          object.id
                                        )
                                      }
                                    >
                                      {content}
                                    </div>
                                  );
                                }
                                // else if (nestedChild.type === "figure") {
                                //   return (
                                //   )
                                // }
                                return (
                                  <p
                                    id={`${nestedId}`}
                                    data-condition={JSON.stringify(condition)}
                                    key={nestedId}
                                    style={{
                                      ...nestedStyles,
                                      transform: `rotate(${rotate ?? 0}deg)`,
                                      position: "relative",
                                    }}
                                    className={`image-field banner-object-child ${
                                      selectedChildId?.groupId === child.id &&
                                      selectedChildId.childId === nestedChild.id
                                        ? "selected-grand-child"
                                        : ""
                                    }`}
                                    onDoubleClick={(e) =>
                                      handleChildClick(
                                        child.id,
                                        nestedChild.id,
                                        e,
                                        object.id
                                      )
                                    }
                                  >
                                    {content}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <ResizeHandles
                    objectId={object.id}
                    selectedObjectId={selectedObjectIds[0]}
                    handleResizeMouseDown={handleResizeMouseDown}
                  />
                </div>

                {contextMenu && contextMenu.object?.id === object.id && (
                  <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    object={contextMenu.object}
                    onClose={handleCloseContextMenu}
                    objects={objects}
                    updateObject={updateObject}
                  />
                )}
              </Fragment>
            );
          }

          return (
            <Fragment key={object.id}>
              <div
                // key={object.id}
                ref={(el) => (objectRefs.current[object.id] = el)}
                style={{
                  position: "absolute",
                  left: object.x,
                  top: object.y,
                  width: object.autoWidth ? "auto" : object.width,

                  height: object.height,
                  zIndex: object.zIndex,
                  cursor: "move",
                  overflow: object.autoWidth ? "visible" : "hidden",
                  transform: `rotate(${object.rotate || 0}deg)`,
                }}
                onMouseDown={(e) => handleMouseDown(object.id, e)}
                onClick={(e) => {
                  handleObjectClick(object.id, e);
                  clearChildSelection();
                }}
                onContextMenu={(e) => handleContextMenu(e, object)}
                className={`banner-object ${
                  selectedObjectIds.includes(object.id) ? "selected" : ""
                }`}
              >
                {object.type === "text" ? (
                  <div
                    id={`${object.id}`}
                    data-condition={JSON.stringify(object.condition)}
                    className="text-field"
                    style={{
                      fontSize: object.fontSize,
                      color: object.color,
                      fontFamily: object.fontFamily || "Poppins, sans-serif",
                      fontWeight: object.fontWeight,
                      fontStyle: object.fontStyle,
                      // textTransform: object.textTransform,
                      textDecoration: object.textDecoration,
                      textAlign: object.textAlign,
                      display: object.maxLines ? "-webkit-box" : "block",
                      WebkitLineClamp: object.maxLines,
                      WebkitBoxOrient: object.maxLines ? "vertical" : undefined,
                      overflow: object.maxLines ? "hidden" : undefined,
                      whiteSpace: object.autoWidth ? "nowrap" : "pre-wrap",
                      // whiteSpace: "pre-wrap",
                    }}
                  >
                    {object.content}
                  </div>
                ) : object.type === "image" ? (
                  <img
                    id={`${object.id}`}
                    data-condition={JSON.stringify(object.condition)}
                    className="image-field"
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
                    id={`${object.id}`}
                    data-condition={JSON.stringify(object.condition)}
                    className="banner-figure"
                    style={{
                      backgroundColor: object.backgroundColor,
                      borderRadius: object.borderRadius,
                      opacity: object.opacity,
                      borderTopStyle: object.borderTopStyle,
                      borderTopColor: object.borderTopColor,
                      borderTopWidth: object.borderTopWidth,
                      borderBottomStyle: object.borderBottomStyle,
                      borderBottomColor: object.borderBottomColor,
                      borderBottomWidth: object.borderBottomWidth,
                      borderLeftStyle: object.borderLeftStyle,
                      borderLeftColor: object.borderLeftColor,
                      borderLeftWidth: object.borderLeftWidth,
                      borderRightStyle: object.borderRightStyle,
                      borderRightColor: object.borderRightColor,
                      borderRightWidth: object.borderRightWidth,
                    }}
                  ></div>
                ) : null}

                <ResizeHandles
                  objectId={object.id}
                  selectedObjectId={selectedObjectIds[0]}
                  handleResizeMouseDown={handleResizeMouseDown}
                />
              </div>
              {contextMenu && contextMenu.object?.id === object.id && (
                <ContextMenu
                  x={contextMenu.x}
                  y={contextMenu.y}
                  object={contextMenu.object}
                  onClose={handleCloseContextMenu}
                  objects={objects}
                  updateObject={updateObject}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BannerArea;

import { useState, useEffect, useRef, Fragment } from "react";
import { useBanner } from "../context/BannerContext";
import { useMode } from "../context/ModeContext";
import { ResizeDirection } from "../types";
import { calculateResizeUpdates } from "../utils/calculateResizeUpdates";
import ResizeHandles from "./UI/ResizeHandles";
import ContextMenu from "./UI/ContextMenu";
import { BannerObject } from "../types";
import Header from "./Header";

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
    //
    temporaryUpdates,
    setTemporaryUpdates,
    renderedObjects,
  } = useBanner();
  const { mode } = useMode();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
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

  const handleChildClick = (
    groupId: number,
    childId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    selectChild(groupId, childId);
  };

  const handleMouseDown = (id: number, event: React.MouseEvent) => {
    if (mode === "test" || resizingId !== null) return;

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
    if (mode === "test") return;
    event.preventDefault();
    setResizingId(id);
    setResizeDirection(direction);
  };

  const handleObjectClick = (id: number, event: React.MouseEvent) => {
    if (mode === "test") return;
    event.stopPropagation();
    selectObject(id, event.ctrlKey || event.metaKey);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (mode === "test") return;
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
    if (mode === "test") return;

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

  return (
    <div className="banner-area-container">
      <Header />
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
        {renderedObjects.map((object) => {
          if (object.type === "group") {
            return (
              <Fragment key={object.id}>
                <div
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
                  {object.children?.map((child) => {
                    if (child.type === "text") {
                      return (
                        <div
                          key={child.id}
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
                            handleChildClick(object.id, child.id, e)
                          }
                        >
                          {child.content}
                        </div>
                      );
                    } else if (child.type === "image") {
                      return (
                        <img
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
                            handleChildClick(object.id, child.id, e)
                          }
                          className={`banner-object-child ${
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
                          style={{
                            transform: `rotate(${rotate ?? 0}deg)`,
                          }}
                          className={`banner-object-child ${
                            selectedChildId?.groupId === object.id &&
                            selectedChildId.childId === child.id
                              ? "selected"
                              : ""
                          }`}
                        >
                          <div
                            key={id}
                            style={{
                              position: "relative",
                              width: width ?? "100px",
                              height: height ?? "100px",
                              ...figureStyles,
                            }}
                            onDoubleClick={(e) =>
                              handleChildClick(object.id, child.id, e)
                            }
                          ></div>
                        </div>
                      );
                    } else if (child.type === "group") {
                      const { id, children, rotate, ...groupStyles } = child;
                      return (
                        <div
                          className={`banner-object-child ${
                            selectedChildId?.groupId === object.id &&
                            selectedChildId.childId === child.id
                              ? "selected"
                              : ""
                          }`}
                          style={{
                            transform: `rotate(${rotate ?? 0}deg)`,
                          }}
                        >
                          <div
                            key={id}
                            style={{
                              width: "auto",
                              position: "relative",
                              ...groupStyles,
                            }}
                            onDoubleClick={(e) =>
                              handleChildClick(object.id, child.id, e)
                            }
                          >
                            {children?.map((nestedChild) => {
                              const {
                                id: nestedId,
                                content,
                                rotate,
                                src,
                                ...nestedStyles
                              } = nestedChild;
                              if (nestedChild.type === "image") {
                                return (
                                  <img
                                    key={nestedId}
                                    src={src}
                                    alt={"image"}
                                    style={{
                                      ...nestedStyles,
                                    }}
                                  />
                                );
                              } else if (nestedChild.type === "text") {
                                return (
                                  <div
                                    key={nestedId}
                                    style={{
                                      ...nestedStyles,
                                      transform: `rotate(${rotate ?? 0}deg)`,
                                      position: "relative",
                                      width: "auto",
                                      height: "auto",
                                    }}
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
                                  key={nestedId}
                                  style={{
                                    ...nestedStyles,
                                    transform: `rotate(${rotate ?? 0}deg)`,
                                    position: "relative",
                                  }}
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
                key={object.id}
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
                      whiteSpace: object.autoWidth ? "nowrap" : "normal",
                    }}
                  >
                    {object.content}
                  </div>
                ) : object.type === "image" ? (
                  <img
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

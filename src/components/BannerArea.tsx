import { useRef, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useBanner } from "../context/BannerContext";
import { useConfig } from "../context/ConfigContext";
import {
  useContextMenu,
  useInjectCustomFonts,
  useObjectSelection,
  useDragAndResize,
  useSelectionBox,
  useArrowKeyMovement,
  useDeleteKeys,
  useAutoSizeUpdate,
  ResizeHandles,
  RightClickDragScroll,
} from "../utils/banner-hooks";
import {
  useChildProperties,
  useObjectProperties,
  shouldHideObject,
  shouldHideGroup,
  computeOpacity,
} from "../utils/hooks";
import ContextMenu from "./UI/ContextMenu";
import {
  TextObject,
  ImageObject,
  FigureObject,
  GroupObjectChildren,
} from "./UI/area-objects";

const BannerArea: React.FC = () => {
  //  1. Основные зависимости и контексты
  const {
    objects,
    updateObject,
    updateMultipleObjects,
    selectedObjectIds,
    clearSelection,
    selectedChildId,
    clearChildSelection,
    temporaryUpdates,
    setTemporaryUpdates,
    renderedObjects,
    dynamicImgs,
    scale,
  } = useBanner();

  const { hiddenObjectIds, config, canvasSize } = useConfig();
  const { selectedChild, handleDeleteChild } = useChildProperties();
  const { handleDelete, handleDeleteAll } = useObjectProperties();
  const { t } = useTranslation();

  // 2. Состояния и ссылки
  const bannerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // 3. Контекстное меню
  const { contextMenu, openContextMenu, closeContextMenu } =
    useContextMenu(bannerRef);

  // 4. Кастомные значения и генерация стилей
  const keyValuePairs = config?.keyValuePairs ?? [];
  const fallbackText = encodeURIComponent(
    t("dialogs.dynamicImageDialog.fillIn")
  );
  useInjectCustomFonts(config);

  const bannerStyles = useMemo(
    () => ({
      width: `${canvasSize.width}px`,
      height: `${canvasSize.height}px`,
      minWidth: `${canvasSize.width}px`,
      minHeight: `${canvasSize.height}px`,
      transform: `scale(${scale})`,
      transformOrigin: scale >= 1 ? "top left" : "center",
    }),
    [config.canvasSize?.width, config.canvasSize?.height, scale]
  );

  // 6. Обработка drag & resize
  const {
    isDragging,
    setIsDragging,
    setDraggingIds,
    setOffsets,
    handleMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
    setMouseDownPosition,
    mouseDownPosition,
  } = useDragAndResize({
    bannerRef,
    objects,
    selectedObjectIds,
    updateObject,
    updateMultipleObjects,
    setTemporaryUpdates,
    temporaryUpdates,
    scale,
  });

  // 5. Обработчики выделения
  const { handleObjectClick, handleChildClick } = useObjectSelection(
    isDragging,
    mouseDownPosition,
    setMouseDownPosition
  );

  // 7. Выделение рамкой
  const { selectionBounds, handleSelectionBorderMouseDown } = useSelectionBox({
    bannerRef,
    selectedObjectIds,
    objects,
    setDraggingIds,
    setIsDragging,
    setOffsets,
  });

  // 8. Обработка клавиатуры: стрелки (перемещение)
  useArrowKeyMovement({
    selectedObjectIds,
    objects,
    updateObject,
  });

  // 9. Обработка клавиатуры: удаление объектов
  useDeleteKeys({
    selectedObjectIds,
    selectedChild,
    handleDelete,
    handleDeleteAll,
    handleDeleteChild,
  });

  // 10. Автоматическое обновление размеров
  useAutoSizeUpdate({ objects, objectRefs, updateObject });

  return (
    <div className="banner-area-container" ref={containerRef}>
      <RightClickDragScroll containerRef={containerRef} />
      <div
        className="banner-area"
        style={bannerStyles}
        ref={bannerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          clearSelection();
          clearChildSelection();
          closeContextMenu();
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
            }}
            onMouseDownCapture={handleSelectionBorderMouseDown}
          />
        )}

        {renderedObjects.map((object) => {
          const isHidden =
            shouldHideGroup(object.conditionForAbstract, keyValuePairs) ||
            shouldHideObject(object.condition, keyValuePairs);
          const isVisible = !hiddenObjectIds.includes(object.id);
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
                    width: object.autoWidth ? "auto" : object.width,
                    height: object.autoHeight ? "auto" : object.height,
                    zIndex: object.zIndex,
                    visibility: isVisible ? "visible" : "hidden",
                  }}
                  onMouseDown={(e) => handleMouseDown(object.id, e)}
                  onClick={(e) => {
                    handleObjectClick(object.id, e);
                    clearChildSelection();
                    closeContextMenu();
                  }}
                  onContextMenu={(e) => openContextMenu(e, object)}
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
                      backgroundColor:
                        object.backgroundColor !== "none"
                          ? object.backgroundColor
                          : undefined,
                      borderRadius: object.borderRadius,
                      opacity: computeOpacity(object.opacity, isHidden),
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
                      paddingTop: object.paddingTop,
                      paddingBottom: object.paddingBottom,
                      paddingLeft: object.paddingLeft,
                      paddingRight: object.paddingRight,
                    }}
                  >
                    <GroupObjectChildren
                      object={object}
                      isVisible={isVisible}
                      hiddenObjectIds={hiddenObjectIds}
                      keyValuePairs={keyValuePairs}
                      selectedChildId={selectedChildId}
                      handleChildClick={handleChildClick}
                    />
                  </div>
                  <ResizeHandles
                    objectId={object.id}
                    selectedObjectId={selectedObjectIds[0]}
                    handleResizeMouseDown={handleResizeMouseDown}
                  />
                </div>

                {contextMenu?.object?.id === object.id && (
                  <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    object={contextMenu.object}
                    onClose={closeContextMenu}
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
                  visibility: isVisible ? "visible" : "hidden",
                }}
                onMouseDown={(e) => handleMouseDown(object.id, e)}
                onClick={(e) => {
                  handleObjectClick(object.id, e);
                  clearChildSelection();
                  closeContextMenu();
                }}
                onContextMenu={(e) => openContextMenu(e, object)}
                className={`banner-object ${
                  selectedObjectIds.includes(object.id) ? "selected" : ""
                }`}
              >
                {object.type === "text" ? (
                  <TextObject
                    object={object}
                    isHidden={isHidden}
                    keyValuePairs={keyValuePairs}
                  />
                ) : object.type === "image" ? (
                  <ImageObject
                    object={object}
                    isHidden={isHidden}
                    keyValuePairs={keyValuePairs}
                    dynamicImgs={dynamicImgs}
                    fallbackText={fallbackText}
                  />
                ) : object.type === "figure" ? (
                  <FigureObject object={object} isHidden={isHidden} />
                ) : null}

                <ResizeHandles
                  objectId={object.id}
                  selectedObjectId={selectedObjectIds[0]}
                  handleResizeMouseDown={handleResizeMouseDown}
                />
              </div>
              {contextMenu?.object?.id === object.id && (
                <ContextMenu
                  x={contextMenu.x}
                  y={contextMenu.y}
                  object={contextMenu.object}
                  onClose={closeContextMenu}
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

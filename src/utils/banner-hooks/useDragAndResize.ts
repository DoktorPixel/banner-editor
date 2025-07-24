import { useCallback, useState } from "react";
import { BannerObject, ResizeDirection } from "../../types";
import { calculateResizeUpdates } from "./calculateResizeUpdates";

type UseDragAndResizeParams = {
  bannerRef: React.RefObject<HTMLDivElement>;
  objects: BannerObject[];
  selectedObjectIds: number[];
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
  updateMultipleObjects: (
    updates: Record<number, Partial<BannerObject>>
  ) => void;
  setTemporaryUpdates: React.Dispatch<
    React.SetStateAction<Record<number, Partial<BannerObject>>>
  >;
  temporaryUpdates: Record<number, Partial<BannerObject>>;
};

export const useDragAndResize = ({
  bannerRef,
  objects,
  selectedObjectIds,
  updateObject,
  updateMultipleObjects,
  setTemporaryUpdates,
  temporaryUpdates,
}: UseDragAndResizeParams) => {
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
  const [resizeDirection, setResizeDirection] =
    useState<ResizeDirection | null>(null);

  const handleMouseDown = useCallback(
    (id: number, event: React.MouseEvent) => {
      if (resizingId !== null) return;
      event.preventDefault();
      event.stopPropagation();

      setMouseDownPosition({ x: event.clientX, y: event.clientY });

      const isSelected = selectedObjectIds.includes(id);
      const shouldKeepSelection = event.ctrlKey || event.metaKey || isSelected;
      const movingObjects = shouldKeepSelection ? [...selectedObjectIds] : [id];

      setDraggingIds(movingObjects);
      setIsDragging(true);

      const newOffsets: Record<number, { x: number; y: number }> = {};
      const rect = bannerRef.current?.getBoundingClientRect();
      if (rect) {
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
    },
    [resizingId, selectedObjectIds, bannerRef, objects]
  );

  const handleResizeMouseDown = useCallback(
    (id: number, direction: ResizeDirection, event: React.MouseEvent) => {
      event.preventDefault();
      setResizingId(id);
      setResizeDirection(direction);
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const rect = bannerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (draggingIds && resizingId === null) {
        setTemporaryUpdates((prev) => {
          const updates = { ...prev };
          draggingIds.forEach((id) => {
            const obj = objects.find((o) => o.id === id);
            if (obj) {
              updates[id] = {
                x: event.clientX - rect.left - offsets[id].x,
                y: event.clientY - rect.top - offsets[id].y,
              };
            }
          });
          return updates;
        });
      }

      if (resizingId !== null) {
        const object = objects.find((obj) => obj.id === resizingId);
        if (!object) return;

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const updates = calculateResizeUpdates({
          resizeDirection: resizeDirection!,
          mouseX,
          mouseY,
          object: {
            x: object.x ?? 0,
            y: object.y ?? 0,
            width: object.width ?? 0,
            height: object.height ?? 0,
            rotate: object.rotate ?? 0,
          },
        });

        setTemporaryUpdates((prev) => ({
          ...prev,
          [resizingId]: { ...temporaryUpdates[resizingId], ...updates },
        }));
      }
    },
    [
      bannerRef,
      draggingIds,
      resizingId,
      resizeDirection,
      objects,
      offsets,
      setTemporaryUpdates,
      temporaryUpdates,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (draggingIds && Object.keys(temporaryUpdates).length > 0) {
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
  }, [
    draggingIds,
    resizingId,
    temporaryUpdates,
    updateMultipleObjects,
    updateObject,
  ]);

  return {
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
  };
};

import { useCallback, useState } from "react";
import { calculateResizeUpdates } from "./calculateResizeUpdates";
export const useDragAndResize = ({ bannerRef, objects, selectedObjectIds, updateObject, updateMultipleObjects, setTemporaryUpdates, temporaryUpdates, scale = 1, }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [draggingIds, setDraggingIds] = useState(null);
    const [offsets, setOffsets] = useState({});
    const [mouseDownPosition, setMouseDownPosition] = useState(null);
    const [resizingId, setResizingId] = useState(null);
    const [resizeDirection, setResizeDirection] = useState(null);
    const getScaledPosition = useCallback((clientX, clientY, rect) => {
        return {
            x: (clientX - rect.left) / scale,
            y: (clientY - rect.top) / scale,
        };
    }, [scale]);
    const handleMouseDown = useCallback((id, event) => {
        if (resizingId !== null)
            return;
        event.preventDefault();
        event.stopPropagation();
        setMouseDownPosition({ x: event.clientX, y: event.clientY });
        const isSelected = selectedObjectIds.includes(id);
        const shouldKeepSelection = event.ctrlKey || event.metaKey || isSelected;
        const movingObjects = shouldKeepSelection ? [...selectedObjectIds] : [id];
        setDraggingIds(movingObjects);
        setIsDragging(true);
        const newOffsets = {};
        const rect = bannerRef.current?.getBoundingClientRect();
        if (rect) {
            const scaledPos = getScaledPosition(event.clientX, event.clientY, rect);
            movingObjects.forEach((objId) => {
                const obj = objects.find((o) => o.id === objId);
                if (obj) {
                    newOffsets[objId] = {
                        x: scaledPos.x - obj.x,
                        y: scaledPos.y - obj.y,
                    };
                }
            });
        }
        setOffsets(newOffsets);
    }, [
        resizingId,
        selectedObjectIds,
        bannerRef,
        objects,
        scale,
        getScaledPosition,
    ]);
    const handleResizeMouseDown = useCallback((id, direction, event) => {
        event.preventDefault();
        setResizingId(id);
        setResizeDirection(direction);
    }, []);
    const handleMouseMove = useCallback((event) => {
        const rect = bannerRef.current?.getBoundingClientRect();
        if (!rect)
            return;
        if (draggingIds && resizingId === null) {
            const scaledPos = getScaledPosition(event.clientX, event.clientY, rect);
            setTemporaryUpdates((prev) => {
                const updates = { ...prev };
                draggingIds.forEach((id) => {
                    const obj = objects.find((o) => o.id === id);
                    if (obj) {
                        updates[id] = {
                            x: Math.round(scaledPos.x - offsets[id].x),
                            y: Math.round(scaledPos.y - offsets[id].y),
                        };
                    }
                });
                return updates;
            });
        }
        if (resizingId !== null) {
            const object = objects.find((obj) => obj.id === resizingId);
            if (!object)
                return;
            const scaledPos = getScaledPosition(event.clientX, event.clientY, rect);
            const updates = calculateResizeUpdates({
                resizeDirection: resizeDirection,
                mouseX: scaledPos.x,
                mouseY: scaledPos.y,
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
    }, [
        bannerRef,
        draggingIds,
        resizingId,
        resizeDirection,
        objects,
        offsets,
        setTemporaryUpdates,
        temporaryUpdates,
        getScaledPosition,
    ]);
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

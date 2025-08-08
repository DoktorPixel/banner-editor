import { useCallback } from "react";
import { useBanner } from "../../context/BannerContext";
export const useObjectSelection = (isDragging, mouseDownPosition, setMouseDownPosition) => {
    const { selectObject, selectChild } = useBanner();
    const handleObjectClick = useCallback((id, event) => {
        if (isDragging)
            return;
        event.stopPropagation();
        if (mouseDownPosition) {
            const deltaX = Math.abs(event.clientX - mouseDownPosition.x);
            const deltaY = Math.abs(event.clientY - mouseDownPosition.y);
            if (deltaX < 5 && deltaY < 5) {
                selectObject(id, event.ctrlKey || event.metaKey);
            }
        }
        setMouseDownPosition(null);
    }, [isDragging, mouseDownPosition, selectObject, setMouseDownPosition]);
    const handleChildClick = useCallback((groupId, childId, event, parentId) => {
        event.stopPropagation();
        selectChild(groupId, childId, parentId);
    }, [selectChild]);
    return {
        handleObjectClick,
        handleChildClick,
    };
};

import { useSelectionBounds } from "../hooks";
export const useSelectionBox = ({ bannerRef, selectedObjectIds, objects, setDraggingIds, setIsDragging, setOffsets, }) => {
    const selectionBounds = useSelectionBounds(selectedObjectIds, objects);
    const handleSelectionBorderMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target !== event.currentTarget)
            return;
        setDraggingIds([...selectedObjectIds]);
        setIsDragging(true);
        const newOffsets = {};
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
    return { selectionBounds, handleSelectionBorderMouseDown };
};

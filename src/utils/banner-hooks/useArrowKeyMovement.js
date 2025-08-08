import { useEffect } from "react";
export const useArrowKeyMovement = ({ selectedObjectIds, objects, updateObject, }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Не обрабатываем, если нет выделения или фокус в инпуте
            if (!selectedObjectIds.length ||
                (event.target instanceof HTMLElement &&
                    ["input", "textarea", "select"].includes(event.target.tagName.toLowerCase()))) {
                return;
            }
            const increment = event.shiftKey ? 10 : 1;
            let deltaX = 0;
            let deltaY = 0;
            if (event.key === "ArrowUp")
                deltaY = -increment;
            if (event.key === "ArrowDown")
                deltaY = increment;
            if (event.key === "ArrowLeft")
                deltaX = -increment;
            if (event.key === "ArrowRight")
                deltaX = increment;
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
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedObjectIds, objects, updateObject]);
};

import { useEffect } from "react";
export const useDeleteKeys = ({ selectedObjectIds, selectedChild, handleDelete, handleDeleteAll, handleDeleteChild, }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const target = event.target;
            const isInput = target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable;
            if (isInput)
                return;
            if (event.key === "Delete" || event.key === "Backspace") {
                if (selectedChild) {
                    handleDeleteChild();
                }
                else if (selectedObjectIds.length === 1) {
                    handleDelete();
                }
                else if (selectedObjectIds.length > 1) {
                    handleDeleteAll();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        selectedObjectIds,
        selectedChild,
        handleDelete,
        handleDeleteAll,
        handleDeleteChild,
    ]);
};

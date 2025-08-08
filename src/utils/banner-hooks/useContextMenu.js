import { useState, useEffect } from "react";
export const useContextMenu = (ref, scale) => {
    const [contextMenu, setContextMenu] = useState(null);
    const openContextMenu = (event, object) => {
        event.preventDefault();
        event.stopPropagation();
        const container = ref.current;
        if (!container)
            return;
        const rect = container.getBoundingClientRect();
        const scrollLeft = container.scrollLeft;
        const scrollTop = container.scrollTop;
        const offsetX = (event.clientX - rect.left + scrollLeft) / scale;
        const offsetY = (event.clientY - rect.top + scrollTop) / scale;
        setContextMenu({
            x: offsetX,
            y: offsetY,
            object,
        });
    };
    const closeContextMenu = () => {
        setContextMenu(null);
    };
    useEffect(() => {
        const handleGlobalClick = (e) => {
            const menu = document.getElementById("context-menu");
            if (menu && !menu.contains(e.target)) {
                closeContextMenu();
            }
        };
        if (contextMenu) {
            document.addEventListener("click", handleGlobalClick);
        }
        return () => {
            document.removeEventListener("click", handleGlobalClick);
        };
    }, [contextMenu]);
    return {
        contextMenu,
        openContextMenu,
        closeContextMenu,
        setContextMenu,
    };
};

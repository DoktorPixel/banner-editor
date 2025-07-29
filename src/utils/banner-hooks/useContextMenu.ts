import { useState, useEffect } from "react";
import { BannerObject } from "../../types";

interface ContextMenuState {
  x: number;
  y: number;
  object: BannerObject | null;
}

export const useContextMenu = (
  ref: React.RefObject<HTMLElement>,
  scale: number
) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const openContextMenu = (event: React.MouseEvent, object: BannerObject) => {
    event.preventDefault();
    event.stopPropagation();

    const container = ref.current;
    if (!container) return;

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
    const handleGlobalClick = (e: MouseEvent) => {
      const menu = document.getElementById("context-menu");
      if (menu && !menu.contains(e.target as Node)) {
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

import { useState, useEffect } from "react";
import { BannerObject } from "../types";

interface ContextMenuState {
  x: number;
  y: number;
  object: BannerObject | null;
}

export const useContextMenu = (ref: React.RefObject<HTMLElement>) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const openContextMenu = (event: React.MouseEvent, object: BannerObject) => {
    event.preventDefault();
    event.stopPropagation();
    if (ref.current) {
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        object,
      });
    }
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

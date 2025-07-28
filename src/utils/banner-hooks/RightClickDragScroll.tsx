import { useEffect, useRef } from "react";

type RightClickDragScrollProps = {
  containerRef: React.RefObject<HTMLElement>;
};

export const RightClickDragScroll = ({
  containerRef,
}: RightClickDragScrollProps) => {
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const wasRightClickDown = useRef(false);
  const moved = useRef(false);
  const DRAG_THRESHOLD = 3;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        wasRightClickDown.current = true;
        isDragging.current = true;
        moved.current = false;
        lastPos.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !container) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        moved.current = true;
      }

      container.scrollLeft -= dx;
      container.scrollTop -= dy;

      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      if (isDragging.current && container) {
        isDragging.current = false;
        container.style.cursor = "default";
      }
      wasRightClickDown.current = false;
      setTimeout(() => {
        moved.current = false;
      }, 0);
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (moved.current) {
        e.preventDefault();
        moved.current = false;
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [containerRef]);

  return null;
};

import { useEffect, useRef } from "react";
import { useBanner } from "../../context/BannerContext";

type ZoomToCursorProps = {
  containerRef: React.RefObject<HTMLDivElement>; // scrollable wrapper
  contentRef: React.RefObject<HTMLDivElement>; // .banner-area
  min?: number;
  max?: number;
  step?: number;
};

export const ZoomToCursor: React.FC<ZoomToCursorProps> = ({
  containerRef,
  contentRef,
  min = 0.4,
  max = 2,
  step = 0.02,
}) => {
  const { scale, setScale } = useBanner();
  const scaleRef = useRef(scale);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;

      e.preventDefault();

      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const rect = content.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const delta = (-e.deltaY / 50) * step;
      const newScale = Math.min(max, Math.max(min, scaleRef.current + delta));
      const ratio = newScale / scaleRef.current;

      const scrollLeft = (offsetX + container.scrollLeft) * ratio - offsetX;
      const scrollTop = (offsetY + container.scrollTop) * ratio - offsetY;

      setScale(parseFloat(newScale.toFixed(3)));

      requestAnimationFrame(() => {
        container.scrollLeft = scrollLeft;
        container.scrollTop = scrollTop;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [containerRef, contentRef, min, max, step, setScale]);

  return null;
};

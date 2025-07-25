import { useEffect, useRef } from "react";
import { useBanner } from "../../context/BannerContext";

export const useZoom = (min = 0.4, max = 2, step = 0.02) => {
  const { scale, setScale } = useBanner();
  const scaleRef = useRef(scale);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;

      e.preventDefault();

      const delta = (-e.deltaY / 40) * step;

      const newScale = Math.min(max, Math.max(min, scaleRef.current + delta));
      setScale(parseFloat(newScale.toFixed(3)));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [min, max, step, setScale]);

  return { scale, setScale };
};

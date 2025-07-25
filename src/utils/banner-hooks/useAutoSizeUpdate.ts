import { useEffect } from "react";
import { BannerObject } from "../../types";

type UseAutoSizeUpdateProps = {
  objects: BannerObject[];
  objectRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
};

export const useAutoSizeUpdate = ({
  objects,
  objectRefs,
  updateObject,
}: UseAutoSizeUpdateProps) => {
  useEffect(() => {
    objects.forEach((object) => {
      const el = objectRefs.current[object.id];
      if (!el) return;

      if (object.autoWidth) {
        const realWidth = el.offsetWidth;
        if (object.width !== realWidth) {
          updateObject(object.id, { width: realWidth });
        }
      }

      if (object.autoHeight) {
        const realHeight = el.offsetHeight;
        if (object.height !== realHeight) {
          updateObject(object.id, { height: realHeight });
        }
      }
    });
  }, [objects, objectRefs, updateObject]);
};

import { useEffect } from "react";
export const useAutoSizeUpdate = ({ objects, objectRefs, updateObject, }) => {
    useEffect(() => {
        objects.forEach((object) => {
            const el = objectRefs.current[object.id];
            if (!el)
                return;
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

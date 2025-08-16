import { BannerObject } from "../../types";
import "../../styles/components/ContextMenu.scss";
import { Button } from "@mui/material";
import { useBanner } from "../../context/BannerContext";
import { useTranslation } from "react-i18next";
import { useVirtualGroupActions } from "../../utils/hooks";

interface ContextMenuProps {
  x: number;
  y: number;
  object: BannerObject;
  onClose: () => void;
  updateObject: (id: number, updates: Partial<BannerObject>) => void;
  objects: BannerObject[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  object,
  onClose,
  objects,
}) => {
  const {
    selectedObjectIds,
    groupSelectedObjects,
    ungroupSelectedObject,
    updateMultipleObjects,
  } = useBanner();
  const { groupSelectedObjectsAbstract, ungroupSelectedObjectsAbstract } =
    useVirtualGroupActions();
  const { t } = useTranslation();

  const getRootObjects = () =>
    objects.filter(
      (o) => o.abstractGroupId === null || o.abstractGroupId === undefined
    );

  const sortTopFirst = (list: BannerObject[]) =>
    [...list].sort((a, b) => {
      const za =
        a.zIndex === undefined || a.zIndex === null ? -Infinity : a.zIndex;
      const zb =
        b.zIndex === undefined || b.zIndex === null ? -Infinity : b.zIndex;
      return zb - za; // descending
    });

  const applyTopOrder = (topFirst: BannerObject[]) => {
    const total = topFirst.length;
    const updates: Record<number, Partial<BannerObject>> = {};
    topFirst.forEach((obj, idx) => {
      const newZ = total - 1 - idx; // idx=0 (top) -> max
      if (obj.zIndex !== newZ) updates[obj.id] = { zIndex: newZ };
    });
    if (Object.keys(updates).length > 0) updateMultipleObjects(updates);
  };

  const getTopAndIndex = () => {
    const roots = getRootObjects();
    const top = sortTopFirst(roots);
    const i = top.findIndex((o) => o.id === object.id);
    return { top, i };
  };

  const bringToFront = () => {
    const { top, i } = getTopAndIndex();
    if (i === -1) return onClose(); // объект не из корня — пропускаем (логика как в Tree)
    const item = top[i];
    const rest = [...top.slice(0, i), ...top.slice(i + 1)];
    const newTop = [item, ...rest]; // в начало (front)
    applyTopOrder(newTop);
    onClose();
  };

  const sendToBack = () => {
    const { top, i } = getTopAndIndex();
    if (i === -1) return onClose();
    const item = top[i];
    const rest = [...top.slice(0, i), ...top.slice(i + 1)];
    const newTop = [...rest, item]; // в конец (back)
    applyTopOrder(newTop);
    onClose();
  };

  const stepForward = () => {
    const { top, i } = getTopAndIndex();
    if (i === -1 || i === 0) return onClose();
    const swapped = [...top];
    [swapped[i - 1], swapped[i]] = [swapped[i], swapped[i - 1]];
    applyTopOrder(swapped);
    onClose();
  };

  const stepBackward = () => {
    const { top, i } = getTopAndIndex();
    if (i === -1 || i === top.length - 1) return onClose();
    const swapped = [...top];
    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
    applyTopOrder(swapped);
    onClose();
  };

  return (
    <div className="context-menu" id="context-menu" style={{ top: y, left: x }}>
      <Button
        onClick={stepForward}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {t("contextMenu.moveForward")}
      </Button>

      <Button
        onClick={bringToFront}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {t("contextMenu.bringToFront")}
      </Button>

      <Button
        onClick={stepBackward}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {t("contextMenu.moveBackward")}
      </Button>

      <Button
        onClick={sendToBack}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {t("contextMenu.sendToBack")}
      </Button>

      <Button
        onClick={groupSelectedObjects}
        disabled={selectedObjectIds.length < 2}
        style={{
          padding: "2px 6px",
          fontSize: "12px",
          textAlign: "start",
          minWidth: "10px",
        }}
      >
        {t("contextMenu.group")}
      </Button>

      <Button
        onClick={ungroupSelectedObject}
        disabled={
          selectedObjectIds.length !== 1 ||
          objects.find((obj) => obj.id === selectedObjectIds[0])?.type !==
            "group"
        }
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {t("contextMenu.ungroup")}
      </Button>

      <Button
        onClick={groupSelectedObjectsAbstract}
        disabled={
          selectedObjectIds.length < 2 ||
          !objects.some(
            (obj) =>
              selectedObjectIds.includes(obj.id) &&
              (obj.abstractGroupId === null ||
                obj.abstractGroupId === undefined)
          )
        }
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {t("contextMenu.groupVirtual")}
      </Button>

      <Button
        onClick={ungroupSelectedObjectsAbstract}
        disabled={
          selectedObjectIds.length < 2 ||
          !objects.some(
            (obj) =>
              selectedObjectIds.includes(obj.id) && obj.abstractGroupId != null
          )
        }
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {t("contextMenu.ungroupVirtual")}
      </Button>
    </div>
  );
};

export default ContextMenu;

import { BannerObject } from "../../types";
import "../../styles/components/ContextMenu.scss";
import { Button } from "@mui/material";
import {
  stepForwardWithCollision,
  stepBackwardWithCollision,
} from "../../utils/hooks";
import { useBanner } from "../../context/BannerContext";
import { useTranslation } from "react-i18next";

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
  updateObject,
  objects,
}) => {
  const {
    selectedObjectIds,
    groupSelectedObjects,
    ungroupSelectedObject,
    updateMultipleObjects,
  } = useBanner();
  const bringToFront = () => {
    const maxZIndex = Math.max(...objects.map((obj) => obj.zIndex || 0));
    updateObject(object.id, { zIndex: maxZIndex + 1 });
    onClose();
  };
  const { t } = useTranslation();

  const sendToBack = () => {
    const minZIndex = Math.min(...objects.map((obj) => obj.zIndex || 0));
    const newZIndex = minZIndex - 1;
    updateObject(object.id, { zIndex: newZIndex });
    onClose();
  };

  const stepForward = () => {
    stepForwardWithCollision(object, objects, updateObject);
    onClose();
  };

  const stepBackward = () => {
    stepBackwardWithCollision(object, objects, updateObject);
    onClose();
  };

  const groupSelectedObjectsAbstract = () => {
    if (selectedObjectIds.length < 2) return;

    const newAbstractGroupId = Date.now();

    const updates = selectedObjectIds.reduce((acc, id) => {
      acc[id] = { abstractGroupId: newAbstractGroupId };
      return acc;
    }, {} as Record<number, Partial<BannerObject>>);

    updateMultipleObjects(updates);
  };

  const ungroupSelectedObjectsAbstract = () => {
    if (selectedObjectIds.length === 0) return;

    const updates = selectedObjectIds.reduce((acc, id) => {
      acc[id] = { abstractGroupId: null };
      return acc;
    }, {} as Record<number, Partial<BannerObject>>);

    updateMultipleObjects(updates);
  };

  return (
    <div
      className="context-menu"
      id="context-menu"
      style={{
        top: y,
        left: x,
      }}
    >
      <Button
        onClick={stepForward}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {/* перенести вперед */}
        {t("contextMenu.moveForward")}
      </Button>

      <Button
        onClick={bringToFront}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {/* на передній план */}
        {t("contextMenu.bringToFront")}
      </Button>

      <Button
        onClick={stepBackward}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {/* перенести назад */}
        {t("contextMenu.moveBackward")}
      </Button>

      <Button
        onClick={sendToBack}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        {/* на задній план */}
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

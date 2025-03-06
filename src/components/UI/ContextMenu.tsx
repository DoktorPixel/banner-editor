import { BannerObject } from "../../types";
import "../../styles/components/ContextMenu.scss";
import { Button } from "@mui/material";
import {
  stepForwardWithCollision,
  stepBackwardWithCollision,
} from "../../utils/hooks";

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
  const bringToFront = () => {
    const maxZIndex = Math.max(...objects.map((obj) => obj.zIndex || 0));
    updateObject(object.id, { zIndex: maxZIndex + 1 });
    onClose();
  };

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

  return (
    <div
      className="context-menu"
      style={{
        top: y,
        left: x,
      }}
    >
      <Button
        onClick={stepForward}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        перенести вперед
      </Button>

      <Button
        onClick={bringToFront}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        на передній план
      </Button>

      <Button
        onClick={stepBackward}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        перенести назад
      </Button>

      <Button
        onClick={sendToBack}
        style={{ padding: "2px 6px", fontSize: "12px" }}
      >
        на задній план
      </Button>
    </div>
  );
};

export default ContextMenu;

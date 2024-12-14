import { BannerObject } from "../../types";
import "../../styles/components/ContextMenu.scss";
import { Button } from "@mui/material";

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
    // zIndex>0
    const newZIndex = Math.max(minZIndex - 1, 0);
    updateObject(object.id, { zIndex: newZIndex });
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
        onClick={sendToBack}
        style={{ padding: "4px 6px", fontSize: "14px" }}
      >
        Вивести назад
      </Button>
      <Button
        onClick={bringToFront}
        style={{ padding: "4px 6px", fontSize: "14px" }}
      >
        Вивести вперед
      </Button>
    </div>
  );
};

export default ContextMenu;

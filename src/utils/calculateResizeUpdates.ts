import { ResizeParams } from "../types";

export const calculateResizeUpdates = ({
  resizeDirection,
  mouseX,
  mouseY,
  object,
}: ResizeParams) => {
  if (!resizeDirection) return {};
  const { x, y, width, height } = object;
  const updates: Partial<typeof object> = {};

  switch (resizeDirection) {
    case "top-left":
      updates.width = Math.max(30, x + width - mouseX);
      updates.height = Math.max(30, y + height - mouseY);
      updates.x = mouseX;
      updates.y = mouseY;
      break;
    case "top-right":
      updates.width = Math.max(30, mouseX - x);
      updates.height = Math.max(30, y + height - mouseY);
      updates.y = mouseY;
      break;
    case "bottom-left":
      updates.width = Math.max(30, x + width - mouseX);
      updates.height = Math.max(30, mouseY - y);
      updates.x = mouseX;
      break;
    case "bottom-right":
      updates.width = Math.max(30, mouseX - x);
      updates.height = Math.max(30, mouseY - y);
      break;
    case "middle-top":
      updates.height = Math.max(30, y + height - mouseY);
      updates.y = mouseY;
      break;
    case "middle-bottom":
      updates.height = Math.max(30, mouseY - y);
      break;
    case "middle-left":
      updates.width = Math.max(30, x + width - mouseX);
      updates.x = mouseX;
      break;
    case "middle-right":
      updates.width = Math.max(30, mouseX - x);
      break;
  }

  return updates;
};

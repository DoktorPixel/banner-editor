import { ResizeParams } from "../types";

export const calculateResizeUpdates = ({
  resizeDirection,
  mouseX,
  mouseY,
  object,
}: ResizeParams) => {
  if (!resizeDirection) return {};
  const { x, y, width, height, rotate = 0 } = object;
  const updates: Partial<typeof object> = {};

  const rad = (Math.PI / 180) * rotate;

  // Центр объекта
  const cx = x + width / 2;
  const cy = y + height / 2;

  // Смещение мыши от центра
  const dx = mouseX - cx;
  const dy = mouseY - cy;

  // Поворачиваем координаты обратно
  const rotatedX = dx * Math.cos(-rad) - dy * Math.sin(-rad);
  const rotatedY = dx * Math.sin(-rad) + dy * Math.cos(-rad);

  // Получаем локальные координаты мыши
  const localX = cx + rotatedX;
  const localY = cy + rotatedY;

  const deltaLeft = x - localX;
  const deltaTop = y - localY;
  const deltaRight = localX - (x + width);
  const deltaBottom = localY - (y + height);

  switch (resizeDirection) {
    case "top-left":
      updates.x = localX;
      updates.y = localY;
      updates.width = Math.max(30, width + deltaLeft);
      updates.height = Math.max(30, height + deltaTop);
      break;
    case "top-right":
      updates.y = localY;
      updates.width = Math.max(30, width + deltaRight);
      updates.height = Math.max(30, height + deltaTop);
      break;
    case "bottom-left":
      updates.x = localX;
      updates.width = Math.max(30, width + deltaLeft);
      updates.height = Math.max(30, height + deltaBottom);
      break;
    case "bottom-right":
      updates.width = Math.max(30, width + deltaRight);
      updates.height = Math.max(30, height + deltaBottom);
      break;
    case "middle-top":
      updates.y = localY;
      updates.height = Math.max(30, height + deltaTop);
      break;
    case "middle-bottom":
      updates.height = Math.max(30, height + deltaBottom);
      break;
    case "middle-left":
      updates.x = localX;
      updates.width = Math.max(30, width + deltaLeft);
      break;
    case "middle-right":
      updates.width = Math.max(30, width + deltaRight);
      break;
  }

  return updates;
};

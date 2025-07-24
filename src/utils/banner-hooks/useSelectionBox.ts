import { useSelectionBounds } from "../hooks";
import { BannerObject } from "../../types";
import { RefObject } from "react";

type UseSelectionBoxProps = {
  bannerRef: RefObject<HTMLDivElement>;
  selectedObjectIds: number[];
  objects: BannerObject[];
  setDraggingIds: (ids: number[]) => void;
  setIsDragging: (dragging: boolean) => void;
  setOffsets: React.Dispatch<
    React.SetStateAction<Record<number, { x: number; y: number }>>
  >;
};

export const useSelectionBox = ({
  bannerRef,
  selectedObjectIds,
  objects,
  setDraggingIds,
  setIsDragging,
  setOffsets,
}: UseSelectionBoxProps) => {
  const selectionBounds = useSelectionBounds(selectedObjectIds, objects);

  const handleSelectionBorderMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.target !== event.currentTarget) return;

    setDraggingIds([...selectedObjectIds]);
    setIsDragging(true);

    const newOffsets: Record<number, { x: number; y: number }> = {};
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();

      selectedObjectIds.forEach((id) => {
        const obj = objects.find((o) => o.id === id);
        if (obj) {
          newOffsets[id] = {
            x: event.clientX - (rect.left + obj.x),
            y: event.clientY - (rect.top + obj.y),
          };
        }
      });
    }

    setOffsets(newOffsets);
  };

  return { selectionBounds, handleSelectionBorderMouseDown };
};

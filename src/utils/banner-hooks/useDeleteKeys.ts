import { useEffect } from "react";
import { BannerChild } from "../../types";

type UseDeleteKeysProps = {
  selectedObjectIds: number[];
  selectedChild: BannerChild | null;
  handleDelete: () => void;
  handleDeleteAll: () => void;
  handleDeleteChild: () => void;
};

export const useDeleteKeys = ({
  selectedObjectIds,
  selectedChild,
  handleDelete,
  handleDeleteAll,
  handleDeleteChild,
}: UseDeleteKeysProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInput) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedChild) {
          handleDeleteChild();
        } else if (selectedObjectIds.length === 1) {
          handleDelete();
        } else if (selectedObjectIds.length > 1) {
          handleDeleteAll();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedObjectIds,
    selectedChild,
    handleDelete,
    handleDeleteAll,
    handleDeleteChild,
  ]);
};

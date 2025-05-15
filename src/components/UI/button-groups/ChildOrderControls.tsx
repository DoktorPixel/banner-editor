import React from "react";
import { Typography, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useChildOrder, useChildProperties } from "../../../utils/hooks";
import { BannerChild } from "../../../types";

interface ChildOrderControlsProps {
  object: BannerChild;
}

export const ChildOrderControls: React.FC<ChildOrderControlsProps> = ({
  object,
}) => {
  const { selectedChildId } = useChildProperties();
  const { getGroupChildren, moveChildUp, moveChildDown } = useChildOrder();

  const groupChildren = selectedChildId
    ? getGroupChildren(selectedChildId.groupId)
    : [];
  const currentIndex = groupChildren.findIndex(
    (child) => child.id === object.id
  );
  const canMoveUp = currentIndex > 0;
  const canMoveDown =
    currentIndex >= 0 && currentIndex < groupChildren.length - 1;

  const handleMoveUp = () => {
    if (selectedChildId && canMoveUp) {
      moveChildUp(selectedChildId.groupId, object.id);
    }
  };

  const handleMoveDown = () => {
    if (selectedChildId && canMoveDown) {
      moveChildDown(selectedChildId.groupId, object.id);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <Typography variant="subtitle2">Order</Typography>
      <IconButton onClick={handleMoveUp} disabled={!canMoveUp} title="Move Up">
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton
        onClick={handleMoveDown}
        disabled={!canMoveDown}
        title="Move Down"
      >
        <ArrowDownwardIcon />
      </IconButton>
    </div>
  );
};

export default ChildOrderControls;

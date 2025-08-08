import { useState } from "react";
import { ListItem, Collapse, List, IconButton } from "@mui/material";
import { BannerObject, BannerChild } from "../../types";
import { useChildProperties, useObjectTypeLabel } from "../../utils/hooks";
import ChildGroupListItem from "./ChildGroupListItem";
import {
  SvgLayout,
  ArrowRight,
  ArrowDown,
  SvgLayoutOpen,
  SvgImage,
  SvgText,
} from "../../assets/icons";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { useTranslation } from "react-i18next";
import { useDroppable, useDraggable } from "@dnd-kit/core";

interface GroupListItemProps {
  group: BannerObject;
  selectedObjectIds: number[];
  selectObject: (id: number, ctrlKey: boolean) => void;
  openNameDialog: (object: BannerObject) => void;
}

const GroupListItem: React.FC<GroupListItemProps> = ({
  group,
  selectedObjectIds,
  selectObject,
  openNameDialog,
}) => {
  const [open, setOpen] = useState(false);
  const { selectChild, selectedChildId } = useChildProperties();
  const { t } = useTranslation();
  const handleToggle = () => setOpen(!open);
  const getObjectTypeLabel = useObjectTypeLabel();
  const handleChildClick = (
    groupId: number,
    child: BannerChild,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    selectChild(groupId, child.id);
  };
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `flex-${group.id}`,
  });
  const {
    setNodeRef: setDragRef,
    attributes,
    listeners,
  } = useDraggable({
    id: `root-${group.id}`,
    data: { kind: "root", objectId: group.id },
  });

  return (
    <>
      <div
        ref={setDragRef}
        {...listeners}
        {...attributes}
        style={{ touchAction: "none" }}
      >
        <div
          ref={setDropRef}
          style={{ backgroundColor: isOver ? "#e8f0fe" : undefined }}
        >
          <ListItem
            key={group.id}
            component="li"
            onClick={(e) => selectObject(group.id, e.ctrlKey || e.metaKey)}
            onDoubleClick={() => openNameDialog(group)}
            sx={{
              cursor: "pointer",
              backgroundColor: selectedObjectIds.includes(group.id)
                ? "#EEEEEE"
                : "white",
              "&:hover": { backgroundColor: "#f5f5f5" },
              padding: "5px 0 5px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              size="small"
              edge="start"
              sx={{ marginRight: "3px" }}
              onClick={handleToggle}
            >
              {open ? <ArrowDown /> : <ArrowRight />}
            </IconButton>
            {open ? <SvgLayoutOpen /> : <SvgLayout />}
            <span className="layers-list-item">
              {group.name?.substring(0, 10) || t("layersPanel.layout")}
              <VisibilityToggle objectId={group.id} />
            </span>
          </ListItem>
        </div>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className="group-list-item">
          {group.children?.map((child) =>
            child.type === "group" ? (
              <ChildGroupListItem
                key={child.id}
                groupId={group.id}
                child={child}
              />
            ) : (
              <ListItem
                key={child.id}
                component="li"
                onClick={(e) => handleChildClick(group.id, child, e)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedChildId?.childId === child.id
                      ? "lightgray"
                      : "white",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  padding: "5px 0 5px 36px",
                }}
              >
                {child.type === "text" && <SvgText />}
                {child.type === "image" && <SvgImage />}
                {child.type === "figure" && <SvgImage />}
                <span className="layers-list-item">
                  {child.name?.substring(0, 8) ||
                    getObjectTypeLabel(child.type)}
                  <VisibilityToggle objectId={child.id} />
                </span>
              </ListItem>
            )
          )}
        </List>
      </Collapse>
    </>
  );
};

export default GroupListItem;

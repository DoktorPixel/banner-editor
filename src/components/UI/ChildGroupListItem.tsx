import { useState } from "react";
import { ListItem, Collapse, List, IconButton } from "@mui/material";
import {
  SvgLayout,
  ArrowRight,
  ArrowDown,
  SvgLayoutOpen,
  SvgImage,
  SvgText,
} from "../../assets/icons";
import { BannerChild } from "../../types";
import { useChildProperties, useObjectTypeLabel } from "../../utils/hooks";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { useDraggable } from "@dnd-kit/core";

interface ChildGroupListItemProps {
  groupId: number;
  child: BannerChild;
}

const ChildGroupListItem: React.FC<ChildGroupListItemProps> = ({
  groupId,
  child,
}) => {
  const [open, setOpen] = useState(false);
  const { selectChild, selectedChildId } = useChildProperties();
  const getObjectTypeLabel = useObjectTypeLabel();
  const handleToggle = () => setOpen(!open);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `flex-child-${groupId}-${child.id}`,
    data: { kind: "flex-child", groupId, childId: child.id },
  });

  const handleChildClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    selectChild(groupId, child.id);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ touchAction: "none" }}
      >
        <ListItem
          component="li"
          onClick={handleChildClick}
          sx={{
            pl: 4,
            cursor: "pointer",
            backgroundColor:
              selectedChildId?.childId === child.id ? "#EEEEEE" : "white",
            "&:hover": { backgroundColor: "#f5f5f5" },

            padding: "5px 0 5px 36px",
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
            {child.name || getObjectTypeLabel(child.type)}
            <VisibilityToggle objectId={child.id} />
          </span>
        </ListItem>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className="group-list-item">
          {child.children?.map((subChild) =>
            subChild.type === "group" ? (
              <ChildGroupListItem
                key={subChild.id}
                groupId={child.id}
                child={subChild}
              />
            ) : (
              <ListItem
                key={subChild.id}
                component="li"
                onClick={(e) => {
                  e.stopPropagation();
                  selectChild(child.id, subChild.id);
                }}
                sx={{
                  pl: 6,
                  cursor: "pointer",
                  backgroundColor:
                    selectedChildId?.childId === subChild.id
                      ? "#EEEEEE"
                      : "white",
                  "&:hover": { backgroundColor: "#f5f5f5" },

                  padding: "5px 0 5px 57px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {subChild.type === "text" && <SvgText />}
                {subChild.type === "image" && <SvgImage />}
                {subChild.type === "figure" && <SvgImage />}
                <span className="layers-list-item">
                  {subChild.name || getObjectTypeLabel(subChild.type)}
                  <VisibilityToggle objectId={subChild.id} />
                </span>
              </ListItem>
            )
          )}
        </List>
      </Collapse>
    </>
  );
};

export default ChildGroupListItem;

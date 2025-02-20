import { useState } from "react";
import {
  ListItem,
  ListItemText,
  Collapse,
  List,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { BannerObject, BannerChild } from "../../types";
import { useChildProperties, getObjectTypeLabel } from "../../utils/hooks";
import ChildGroupListItem from "./ChildGroupListItem";

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

  const handleToggle = () => setOpen(!open);

  const handleChildClick = (
    groupId: number,
    child: BannerChild,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    selectChild(groupId, child.id);
  };

  return (
    <>
      <ListItem
        key={group.id}
        component="li"
        onClick={(e) => selectObject(group.id, e.ctrlKey || e.metaKey)}
        onDoubleClick={() => openNameDialog(group)}
        sx={{
          cursor: "pointer",
          backgroundColor: selectedObjectIds.includes(group.id)
            ? "lightgray"
            : "white",
          "&:hover": { backgroundColor: "lightblue" },
        }}
      >
        <ListItemText
          primary={group.name || "Група"}
          sx={{ fontWeight: "bold" }}
        />
        <IconButton size="small" edge="end" onClick={handleToggle}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          className="group-list-item"
          sx={{ borderLeft: "5px solid lightgray" }}
        >
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
                  pl: 4,
                  cursor: "pointer",
                  backgroundColor:
                    selectedChildId?.childId === child.id
                      ? "lightgray"
                      : "white",
                  "&:hover": { backgroundColor: "lightblue" },
                  border:
                    selectedChildId?.childId === child.id
                      ? "1px solid blue"
                      : "none",
                }}
              >
                <ListItemText
                  primary={child.name || getObjectTypeLabel(child.type)}
                />
              </ListItem>
            )
          )}
        </List>
      </Collapse>
    </>
  );
};

export default GroupListItem;

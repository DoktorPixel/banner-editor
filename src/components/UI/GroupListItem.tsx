import {
  ListItem,
  ListItemText,
  Collapse,
  List,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import {
  BannerObject,
  // BannerChild
} from "../../types";
import { useChildProperties } from "../../utils/hooks";

interface GroupListItemProps {
  group: BannerObject;
  selectedObjectIds: number[];
  selectObject: (id: number, ctrlKey: boolean) => void;
  openNameDialog: (object: BannerObject) => void;
  //   openChildDialog: (child: BannerChild) => void;
}

const GroupListItem: React.FC<GroupListItemProps> = ({
  group,
  selectedObjectIds,
  selectObject,
  openNameDialog,
  //   openChildDialog,
}) => {
  const [open, setOpen] = useState(false);
  const { selectChild, selectedChildId } = useChildProperties();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleChildClick = (
    groupId: number,
    childId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    selectChild(groupId, childId);
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
        <List component="div" disablePadding className="group-list-item">
          {group.children?.map((child) => (
            <ListItem
              key={child.id}
              component="li"
              onClick={(e) => handleChildClick(group.id, child.id, e)}
              //   onDoubleClick={() => openChildDialog(child)}
              sx={{
                pl: 4,
                cursor: "pointer",
                backgroundColor: selectedObjectIds.includes(child.id)
                  ? "lightgray"
                  : "white",
                "&:hover": { backgroundColor: "lightblue" },
                border:
                  selectedChildId?.groupId === group.id &&
                  selectedChildId?.childId === child.id
                    ? "1px solid blue"
                    : "none",
              }}
            >
              <ListItemText
                primary={child.name ? child.name.slice(0, 30) : "text"}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default GroupListItem;

import { useState } from "react";
import {
  ListItem,
  ListItemText,
  Collapse,
  List,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { BannerChild } from "../../types";
import { useChildProperties, getObjectTypeLabel } from "../../utils/hooks";

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

  const handleToggle = () => setOpen(!open);

  const handleChildClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    selectChild(groupId, child.id);
  };

  return (
    <>
      <ListItem
        component="li"
        onClick={handleChildClick}
        sx={{
          pl: 4,
          cursor: "pointer",
          backgroundColor:
            selectedChildId?.childId === child.id ? "lightgray" : "white",
          "&:hover": { backgroundColor: "lightblue" },
          border:
            selectedChildId?.childId === child.id ? "1px solid blue" : "none",
        }}
      >
        <ListItemText primary={child.name || getObjectTypeLabel(child.type)} />
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
                      ? "lightgray"
                      : "white",
                  "&:hover": { backgroundColor: "lightblue" },
                  border:
                    selectedChildId?.childId === subChild.id
                      ? "1px solid blue"
                      : "none",
                }}
              >
                <ListItemText
                  primary={subChild.name || getObjectTypeLabel(subChild.type)}
                />
              </ListItem>
            )
          )}
        </List>
      </Collapse>
    </>
  );
};

export default ChildGroupListItem;

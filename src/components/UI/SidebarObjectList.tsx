import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import GroupListItem from "./GroupListItem";
import { BannerObject } from "../../types";
import { getObjectTypeLabel } from "../../utils/hooks";

interface ObjectListProps {
  objects: BannerObject[];
  selectedObjectIds: number[];
  selectObject: (id: number, toggle?: boolean) => void;
  selectAllObjects: (id: number, toggle?: boolean) => void;
  openNameDialog: (object: BannerObject) => void;
}

const SidebarObjectList: React.FC<ObjectListProps> = ({
  objects,
  selectedObjectIds,
  selectObject,
  selectAllObjects,
  openNameDialog,
}) => {
  const groupedObjects = objects.reduce<Record<number, BannerObject[]>>(
    (acc, obj) => {
      if (obj.abstractGroupId != null) {
        if (!acc[obj.abstractGroupId]) acc[obj.abstractGroupId] = [];
        acc[obj.abstractGroupId].push(obj);
      }
      return acc;
    },
    {}
  );

  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <List sx={{ padding: "0px" }}>
      {objects.map((obj) => {
        if (
          obj.abstractGroupId != null &&
          groupedObjects[obj.abstractGroupId]
        ) {
          const group = groupedObjects[obj.abstractGroupId];
          delete groupedObjects[obj.abstractGroupId];

          return (
            <Box
              key={`group-${obj.abstractGroupId}`}
              sx={{ marginBottom: "5px" }}
            >
              <ListItem
                component="div"
                sx={{
                  backgroundColor: group.every((groupObj) =>
                    selectedObjectIds.includes(groupObj.id)
                  )
                    ? "#f0f0f0"
                    : "white",
                  "&:hover": { backgroundColor: "lightblue" },
                }}
                onClick={(e) =>
                  selectAllObjects(obj.id, e.ctrlKey || e.metaKey)
                }
              >
                <ListItemText primary="Абстрактна група" />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(obj.abstractGroupId!);
                  }}
                >
                  {openGroups[obj.abstractGroupId!] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
              </ListItem>
              <Collapse
                in={openGroups[obj.abstractGroupId]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {group.map((groupObj) =>
                    groupObj.type === "group" ? (
                      <GroupListItem
                        key={groupObj.id}
                        group={groupObj}
                        selectedObjectIds={selectedObjectIds}
                        selectObject={selectObject}
                        openNameDialog={openNameDialog}
                      />
                    ) : (
                      <ListItem
                        key={groupObj.id}
                        component="li"
                        onClick={(e) =>
                          selectObject(groupObj.id, e.ctrlKey || e.metaKey)
                        }
                        onDoubleClick={() => openNameDialog(groupObj)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: selectedObjectIds.includes(
                            groupObj.id
                          )
                            ? "#f0f0f0"
                            : "white",
                          "&:hover": { backgroundColor: "lightblue" },
                          pl: 4,
                        }}
                      >
                        <ListItemText
                          primary={
                            groupObj.name || getObjectTypeLabel(groupObj.type)
                          }
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </Collapse>
            </Box>
          );
        }

        if (obj.abstractGroupId == null) {
          return obj.type === "group" ? (
            <GroupListItem
              key={obj.id}
              group={obj}
              selectedObjectIds={selectedObjectIds}
              selectObject={selectObject}
              openNameDialog={openNameDialog}
            />
          ) : (
            <ListItem
              key={obj.id}
              component="li"
              onClick={(e) => selectObject(obj.id, e.ctrlKey || e.metaKey)}
              onDoubleClick={() => openNameDialog(obj)}
              sx={{
                cursor: "pointer",
                backgroundColor: selectedObjectIds.includes(obj.id)
                  ? "#f0f0f0"
                  : "white",
                "&:hover": { backgroundColor: "lightblue" },
              }}
            >
              <ListItemText
                primary={obj.name || getObjectTypeLabel(obj.type)}
                sx={{ marginLeft: "10px" }}
              />
            </ListItem>
          );
        }

        return null;
      })}
    </List>
  );
};

export default SidebarObjectList;

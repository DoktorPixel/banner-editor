import { List, ListItem, Collapse, IconButton, Box } from "@mui/material";
import { useState } from "react";
import GroupListItem from "./GroupListItem";
import { BannerObject } from "../../types";
import { useObjectTypeLabel } from "../../utils/hooks";
import { useBanner } from "../../context/BannerContext";
import { useObjectProperties } from "../../utils/hooks";
import NameDialog from "./dialogs/NameDialog";
import {
  SvgImage,
  SvgText,
  SvgVirtual,
  ArrowRight,
  ArrowDown,
} from "../../assets/icons";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { GroupVisibilityToggle } from "./button-groups/GroupVisibilityToggle";
import { useTranslation } from "react-i18next";

const SidebarObjectList: React.FC = () => {
  const { objects, selectedObjectIds, selectObject, selectAllObjects } =
    useBanner();
  const { updateObjectProperty } = useObjectProperties();
  const [nameDialogState, setNameDialogState] = useState({
    isNameDialogOpen: false,
    currentName: "",
    objectId: null as number | null,
  });
  const getObjectTypeLabel = useObjectTypeLabel();
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const { t } = useTranslation();
  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

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

  const openNameDialog = (object: BannerObject) => {
    setNameDialogState({
      isNameDialogOpen: true,
      currentName: object.name || "",
      objectId: object.id,
    });
  };

  const closeNameDialog = () => {
    setNameDialogState({
      isNameDialogOpen: false,
      currentName: "",
      objectId: null,
    });
  };

  const saveName = () => {
    if (nameDialogState.objectId !== null) {
      updateObjectProperty(
        nameDialogState.objectId,
        "name",
        nameDialogState.currentName
      );
    }
    closeNameDialog();
  };

  return (
    <List sx={{ padding: "0px", margin: "0 0 0 6px" }}>
      {objects.map((obj) => {
        if (
          obj.abstractGroupId != null &&
          groupedObjects[obj.abstractGroupId]
        ) {
          const group = groupedObjects[obj.abstractGroupId];
          delete groupedObjects[obj.abstractGroupId];

          return (
            <Box key={`group-${obj.abstractGroupId}`}>
              <ListItem
                component="div"
                sx={{
                  padding: "5px 0 5px 0px",
                  backgroundColor: group.every((groupObj) =>
                    selectedObjectIds.includes(groupObj.id)
                  )
                    ? "#f0f0f0"
                    : "white",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                onClick={(e) =>
                  selectAllObjects(obj.id, e.ctrlKey || e.metaKey)
                }
              >
                <IconButton
                  size="small"
                  edge="start"
                  sx={{ marginRight: "3px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(obj.abstractGroupId!);
                  }}
                >
                  {openGroups[obj.abstractGroupId!] ? (
                    <ArrowDown />
                  ) : (
                    <ArrowRight />
                  )}
                </IconButton>
                <SvgVirtual />
                <span className="layers-list-item">
                  {t("layersPanel.group")}
                </span>
                <GroupVisibilityToggle objectIds={group.map((o) => o.id)} />
              </ListItem>
              <Collapse
                in={openGroups[obj.abstractGroupId]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" sx={{ padding: "0 0 0 36px" }}>
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
                          "&:hover": { backgroundColor: "#f5f5f5" },
                          padding: "5px 0 5px 0px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {groupObj.type === "text" && <SvgText />}
                        {groupObj.type === "image" && <SvgImage />}
                        {groupObj.type === "figure" && <SvgImage />}
                        <span className="layers-list-item">
                          {groupObj.name?.substring(0, 12) ||
                            getObjectTypeLabel(groupObj.type)}
                          <VisibilityToggle objectId={groupObj.id} />
                        </span>
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
                "&:hover": { backgroundColor: "#f5f5f5" },
                padding: "5px 0 5px 0px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {obj.type === "text" && <SvgText />}
              {obj.type === "image" && <SvgImage />}
              {obj.type === "figure" && <SvgImage />}

              <span className="layers-list-item">
                {obj.name?.substring(0, 14) || getObjectTypeLabel(obj.type)}
                <VisibilityToggle objectId={obj.id} />
              </span>
            </ListItem>
          );
        }

        return null;
      })}

      <NameDialog
        open={nameDialogState.isNameDialogOpen}
        name={nameDialogState.currentName}
        onChange={(e) =>
          setNameDialogState((prev) => ({
            ...prev,
            currentName: e.target.value,
          }))
        }
        onClose={closeNameDialog}
        onSave={saveName}
      />
    </List>
  );
};

export default SidebarObjectList;

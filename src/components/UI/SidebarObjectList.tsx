import {
  List,
  ListItem,
  Collapse,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
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
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";

const SidebarObjectList: React.FC = () => {
  const {
    objects,
    selectedObjectIds,
    selectObject,
    selectAllObjects,
    clearChildSelection,
  } = useBanner();
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

  type DragData =
    | { kind: "root"; objectId: number }
    | { kind: "flex-child"; groupId: number; childId: number };

  const [groupChoice, setGroupChoice] = useState<{
    open: boolean;
    sourceId: number | null;
    targetId: number | null;
  }>({ open: false, sourceId: null, targetId: null });

  const {
    groupObjectsAsAbstract,
    groupObjectsAsFlex,
    addObjectToAbstractGroup,
    removeObjectFromAbstractGroup,
    addObjectsToFlexGroup,
    removeChildFromFlexGroup,
  } = useBanner();

  const handleChooseGroup = (type: "abstract" | "flex") => {
    if (groupChoice.sourceId && groupChoice.targetId) {
      const pair = [groupChoice.sourceId, groupChoice.targetId];
      if (type === "abstract") groupObjectsAsAbstract(pair);
      else groupObjectsAsFlex(pair);
    }
    setGroupChoice({ open: false, sourceId: null, targetId: null });
  };

  const DraggableRoot: React.FC<{ id: number; children: React.ReactNode }> = ({
    id,
    children,
  }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: `root-${id}`,
      data: { kind: "root", objectId: id } as DragData,
    });
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ touchAction: "none" }}
      >
        {children}
      </div>
    );
  };

  const DroppableRoot: React.FC<{ id: number; children: React.ReactNode }> = ({
    id,
    children,
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `root-${id}` });
    return (
      <div
        ref={setNodeRef}
        style={{ backgroundColor: isOver ? "#e8f0fe" : undefined }}
      >
        {children}
      </div>
    );
  };

  const DroppableAbstractHeader: React.FC<{
    groupId: number;
    children: React.ReactNode;
  }> = ({ groupId, children }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `abstract-${groupId}` });
    return (
      <div
        ref={setNodeRef}
        style={{ backgroundColor: isOver ? "#e8f0fe" : undefined }}
      >
        {children}
      </div>
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const data = active?.data?.current as DragData | undefined;
    if (!data) return;

    if (!over) {
      // Dropped outside any droppable
      if (data.kind === "flex-child") {
        removeChildFromFlexGroup(data.groupId, data.childId);
      } else if (data.kind === "root") {
        removeObjectFromAbstractGroup(data.objectId);
      }
      return;
    }

    const overId = String(over.id);

    // handle root to root
    if (data.kind === "root" && overId.startsWith("root-")) {
      const targetId = Number(overId.replace("root-", ""));
      if (targetId === data.objectId) return;
      setGroupChoice({ open: true, sourceId: data.objectId, targetId });
      return;
    }

    // handle drop onto abstract header (add to abstract group)
    if (data.kind === "root" && overId.startsWith("abstract-")) {
      const targetGroupId = Number(overId.replace("abstract-", ""));
      addObjectToAbstractGroup(data.objectId, targetGroupId);
      return;
    }

    // handle drop onto flex group header
    if (data.kind === "root" && overId.startsWith("flex-")) {
      const targetGroupId = Number(overId.replace("flex-", ""));
      addObjectsToFlexGroup(targetGroupId, [data.objectId]);
      return;
    }
  };

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
    <DndContext onDragEnd={onDragEnd}>
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
                <DroppableAbstractHeader groupId={obj.abstractGroupId!}>
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
                    onClick={(e) => {
                      selectAllObjects(obj.id, e.ctrlKey || e.metaKey);
                      clearChildSelection();
                    }}
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
                </DroppableAbstractHeader>
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
                        <DraggableRoot id={groupObj.id} key={groupObj.id}>
                          <DroppableRoot id={groupObj.id}>
                            <ListItem
                              component="li"
                              onClick={(e) => {
                                selectObject(
                                  groupObj.id,
                                  e.ctrlKey || e.metaKey
                                );
                                clearChildSelection();
                              }}
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
                          </DroppableRoot>
                        </DraggableRoot>
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
              <DraggableRoot id={obj.id} key={obj.id}>
                <DroppableRoot id={obj.id}>
                  <ListItem
                    component="li"
                    onClick={(e) => {
                      selectObject(obj.id, e.ctrlKey || e.metaKey);
                      clearChildSelection();
                    }}
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
                      {obj.name?.substring(0, 14) ||
                        getObjectTypeLabel(obj.type)}
                      <VisibilityToggle objectId={obj.id} />
                    </span>
                  </ListItem>
                </DroppableRoot>
              </DraggableRoot>
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

      <Dialog
        open={groupChoice.open}
        onClose={() =>
          setGroupChoice({ open: false, sourceId: null, targetId: null })
        }
      >
        <DialogTitle>
          {t("layersPanel.chooseGroupType") || "Choose group type"}
        </DialogTitle>
        <DialogContent>
          {t("layersPanel.chooseGroupTypeDescription") ||
            "Create an abstract selection group or a flex layout group?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleChooseGroup("abstract")}>
            {t("layersPanel.abstractGroup") || "Abstract"}
          </Button>
          <Button variant="contained" onClick={() => handleChooseGroup("flex")}>
            {t("layersPanel.flexGroup") || "Flex"}
          </Button>
        </DialogActions>
      </Dialog>
    </DndContext>
  );
};

export default SidebarObjectList;

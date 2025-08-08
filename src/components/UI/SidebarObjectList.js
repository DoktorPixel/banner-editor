import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { List, ListItem, Collapse, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import GroupListItem from "./GroupListItem";
import { useObjectTypeLabel } from "../../utils/hooks";
import { useBanner } from "../../context/BannerContext";
import { useObjectProperties } from "../../utils/hooks";
import NameDialog from "./dialogs/NameDialog";
import { SvgImage, SvgText, SvgVirtual, ArrowRight, ArrowDown, } from "../../assets/icons";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { GroupVisibilityToggle } from "./button-groups/GroupVisibilityToggle";
import { useTranslation } from "react-i18next";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
const SidebarObjectList = () => {
    const { objects, selectedObjectIds, selectObject, selectAllObjects, clearChildSelection, } = useBanner();
    const { updateObjectProperty } = useObjectProperties();
    const [nameDialogState, setNameDialogState] = useState({
        isNameDialogOpen: false,
        currentName: "",
        objectId: null,
    });
    const getObjectTypeLabel = useObjectTypeLabel();
    const [openGroups, setOpenGroups] = useState({});
    const { t } = useTranslation();
    const toggleGroup = (groupId) => {
        setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };
    const groupedObjects = objects.reduce((acc, obj) => {
        if (obj.abstractGroupId != null) {
            if (!acc[obj.abstractGroupId])
                acc[obj.abstractGroupId] = [];
            acc[obj.abstractGroupId].push(obj);
        }
        return acc;
    }, {});
    const [groupChoice, setGroupChoice] = useState({ open: false, sourceId: null, targetId: null });
    const { groupObjectsAsAbstract, groupObjectsAsFlex, addObjectToAbstractGroup, removeObjectFromAbstractGroup, addObjectsToFlexGroup, removeChildFromFlexGroup, } = useBanner();
    const handleChooseGroup = (type) => {
        if (groupChoice.sourceId && groupChoice.targetId) {
            const pair = [groupChoice.sourceId, groupChoice.targetId];
            if (type === "abstract")
                groupObjectsAsAbstract(pair);
            else
                groupObjectsAsFlex(pair);
        }
        setGroupChoice({ open: false, sourceId: null, targetId: null });
    };
    const DraggableRoot = ({ id, children }) => {
        const { attributes, listeners, setNodeRef } = useDraggable({ id: `root-${id}`, data: { kind: "root", objectId: id } });
        return (_jsx("div", { ref: setNodeRef, ...listeners, ...attributes, style: { touchAction: "none" }, children: children }));
    };
    const DroppableRoot = ({ id, children }) => {
        const { setNodeRef, isOver } = useDroppable({ id: `root-${id}` });
        return (_jsx("div", { ref: setNodeRef, style: { backgroundColor: isOver ? "#e8f0fe" : undefined }, children: children }));
    };
    const DroppableAbstractHeader = ({ groupId, children }) => {
        const { setNodeRef, isOver } = useDroppable({ id: `abstract-${groupId}` });
        return (_jsx("div", { ref: setNodeRef, style: { backgroundColor: isOver ? "#e8f0fe" : undefined }, children: children }));
    };
    const onDragEnd = (event) => {
        const { active, over } = event;
        const data = active?.data?.current;
        if (!data)
            return;
        if (!over) {
            // Dropped outside any droppable
            if (data.kind === "flex-child") {
                removeChildFromFlexGroup(data.groupId, data.childId);
            }
            else if (data.kind === "root") {
                removeObjectFromAbstractGroup(data.objectId);
            }
            return;
        }
        const overId = String(over.id);
        // handle root to root
        if (data.kind === "root" && overId.startsWith("root-")) {
            const targetId = Number(overId.replace("root-", ""));
            if (targetId === data.objectId)
                return;
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
    const openNameDialog = (object) => {
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
            updateObjectProperty(nameDialogState.objectId, "name", nameDialogState.currentName);
        }
        closeNameDialog();
    };
    return (_jsxs(DndContext, { onDragEnd: onDragEnd, children: [_jsxs(List, { sx: { padding: "0px", margin: "0 0 0 6px" }, children: [objects.map((obj) => {
                        if (obj.abstractGroupId != null &&
                            groupedObjects[obj.abstractGroupId]) {
                            const group = groupedObjects[obj.abstractGroupId];
                            delete groupedObjects[obj.abstractGroupId];
                            return (_jsxs(Box, { children: [_jsx(DroppableAbstractHeader, { groupId: obj.abstractGroupId, children: _jsxs(ListItem, { component: "div", sx: {
                                                padding: "5px 0 5px 0px",
                                                backgroundColor: group.every((groupObj) => selectedObjectIds.includes(groupObj.id))
                                                    ? "#f0f0f0"
                                                    : "white",
                                                "&:hover": { backgroundColor: "#f5f5f5" },
                                            }, onClick: (e) => {
                                                selectAllObjects(obj.id, e.ctrlKey || e.metaKey);
                                                clearChildSelection();
                                            }, children: [_jsx(IconButton, { size: "small", edge: "start", sx: { marginRight: "3px" }, onClick: (e) => {
                                                        e.stopPropagation();
                                                        toggleGroup(obj.abstractGroupId);
                                                    }, children: openGroups[obj.abstractGroupId] ? (_jsx(ArrowDown, {})) : (_jsx(ArrowRight, {})) }), _jsx(SvgVirtual, {}), _jsx("span", { className: "layers-list-item", children: t("layersPanel.group") }), _jsx(GroupVisibilityToggle, { objectIds: group.map((o) => o.id) })] }) }), _jsx(Collapse, { in: openGroups[obj.abstractGroupId], timeout: "auto", unmountOnExit: true, children: _jsx(List, { component: "div", sx: { padding: "0 0 0 36px" }, children: group.map((groupObj) => groupObj.type === "group" ? (_jsx(GroupListItem, { group: groupObj, selectedObjectIds: selectedObjectIds, selectObject: selectObject, openNameDialog: openNameDialog }, groupObj.id)) : (_jsx(DraggableRoot, { id: groupObj.id, children: _jsx(DroppableRoot, { id: groupObj.id, children: _jsxs(ListItem, { component: "li", onClick: (e) => {
                                                            selectObject(groupObj.id, e.ctrlKey || e.metaKey);
                                                            clearChildSelection();
                                                        }, onDoubleClick: () => openNameDialog(groupObj), sx: {
                                                            cursor: "pointer",
                                                            backgroundColor: selectedObjectIds.includes(groupObj.id)
                                                                ? "#f0f0f0"
                                                                : "white",
                                                            "&:hover": { backgroundColor: "#f5f5f5" },
                                                            padding: "5px 0 5px 0px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }, children: [groupObj.type === "text" && _jsx(SvgText, {}), groupObj.type === "image" && _jsx(SvgImage, {}), groupObj.type === "figure" && _jsx(SvgImage, {}), _jsxs("span", { className: "layers-list-item", children: [groupObj.name?.substring(0, 12) ||
                                                                        getObjectTypeLabel(groupObj.type), _jsx(VisibilityToggle, { objectId: groupObj.id })] })] }) }) }, groupObj.id))) }) })] }, `group-${obj.abstractGroupId}`));
                        }
                        if (obj.abstractGroupId == null) {
                            return obj.type === "group" ? (_jsx(GroupListItem, { group: obj, selectedObjectIds: selectedObjectIds, selectObject: selectObject, openNameDialog: openNameDialog }, obj.id)) : (_jsx(DraggableRoot, { id: obj.id, children: _jsx(DroppableRoot, { id: obj.id, children: _jsxs(ListItem, { component: "li", onClick: (e) => {
                                            selectObject(obj.id, e.ctrlKey || e.metaKey);
                                            clearChildSelection();
                                        }, onDoubleClick: () => openNameDialog(obj), sx: {
                                            cursor: "pointer",
                                            backgroundColor: selectedObjectIds.includes(obj.id)
                                                ? "#f0f0f0"
                                                : "white",
                                            "&:hover": { backgroundColor: "#f5f5f5" },
                                            padding: "5px 0 5px 0px",
                                            display: "flex",
                                            alignItems: "center",
                                        }, children: [obj.type === "text" && _jsx(SvgText, {}), obj.type === "image" && _jsx(SvgImage, {}), obj.type === "figure" && _jsx(SvgImage, {}), _jsxs("span", { className: "layers-list-item", children: [obj.name?.substring(0, 14) || getObjectTypeLabel(obj.type), _jsx(VisibilityToggle, { objectId: obj.id })] })] }) }) }, obj.id));
                        }
                        return null;
                    }), _jsx(NameDialog, { open: nameDialogState.isNameDialogOpen, name: nameDialogState.currentName, onChange: (e) => setNameDialogState((prev) => ({
                            ...prev,
                            currentName: e.target.value,
                        })), onClose: closeNameDialog, onSave: saveName })] }), _jsxs(Dialog, { open: groupChoice.open, onClose: () => setGroupChoice({ open: false, sourceId: null, targetId: null }), children: [_jsx(DialogTitle, { children: t("layersPanel.chooseGroupType") || "Choose group type" }), _jsx(DialogContent, { children: t("layersPanel.chooseGroupTypeDescription") || "Create an abstract selection group or a flex layout group?" }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => handleChooseGroup("abstract"), children: t("layersPanel.abstractGroup") || "Abstract" }), _jsx(Button, { variant: "contained", onClick: () => handleChooseGroup("flex"), children: t("layersPanel.flexGroup") || "Flex" })] })] })] }));
};
export default SidebarObjectList;

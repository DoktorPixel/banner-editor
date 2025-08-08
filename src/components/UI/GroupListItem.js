import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { ListItem, Collapse, List, IconButton } from "@mui/material";
import { useChildProperties, useObjectTypeLabel } from "../../utils/hooks";
import ChildGroupListItem from "./ChildGroupListItem";
import { SvgLayout, ArrowRight, ArrowDown, SvgLayoutOpen, SvgImage, SvgText, } from "../../assets/icons";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { useTranslation } from "react-i18next";
import { useDroppable, useDraggable } from "@dnd-kit/core";
const GroupListItem = ({ group, selectedObjectIds, selectObject, openNameDialog, }) => {
    const [open, setOpen] = useState(false);
    const { selectChild, selectedChildId } = useChildProperties();
    const { t } = useTranslation();
    const handleToggle = () => setOpen(!open);
    const getObjectTypeLabel = useObjectTypeLabel();
    const handleChildClick = (groupId, child, event) => {
        event.stopPropagation();
        selectChild(groupId, child.id);
    };
    const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `flex-${group.id}` });
    const { setNodeRef: setDragRef, attributes, listeners } = useDraggable({ id: `root-${group.id}`, data: { kind: "root", objectId: group.id } });
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: setDragRef, ...listeners, ...attributes, style: { touchAction: "none" }, children: _jsx("div", { ref: setDropRef, style: { backgroundColor: isOver ? "#e8f0fe" : undefined }, children: _jsxs(ListItem, { component: "li", onClick: (e) => selectObject(group.id, e.ctrlKey || e.metaKey), onDoubleClick: () => openNameDialog(group), sx: {
                            cursor: "pointer",
                            backgroundColor: selectedObjectIds.includes(group.id)
                                ? "#EEEEEE"
                                : "white",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                            padding: "5px 0 5px 0",
                            display: "flex",
                            alignItems: "center",
                        }, children: [_jsx(IconButton, { size: "small", edge: "start", sx: { marginRight: "3px" }, onClick: handleToggle, children: open ? _jsx(ArrowDown, {}) : _jsx(ArrowRight, {}) }), open ? _jsx(SvgLayoutOpen, {}) : _jsx(SvgLayout, {}), _jsxs("span", { className: "layers-list-item", children: [group.name?.substring(0, 10) || t("layersPanel.layout"), _jsx(VisibilityToggle, { objectId: group.id })] })] }, group.id) }) }), _jsx(Collapse, { in: open, timeout: "auto", unmountOnExit: true, children: _jsx(List, { component: "div", disablePadding: true, className: "group-list-item", children: group.children?.map((child) => child.type === "group" ? (_jsx(ChildGroupListItem, { groupId: group.id, child: child }, child.id)) : (_jsxs(ListItem, { component: "li", onClick: (e) => handleChildClick(group.id, child, e), sx: {
                            cursor: "pointer",
                            backgroundColor: selectedChildId?.childId === child.id
                                ? "lightgray"
                                : "white",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                            padding: "5px 0 5px 36px",
                        }, children: [child.type === "text" && _jsx(SvgText, {}), child.type === "image" && _jsx(SvgImage, {}), child.type === "figure" && _jsx(SvgImage, {}), _jsxs("span", { className: "layers-list-item", children: [child.name?.substring(0, 8) ||
                                        getObjectTypeLabel(child.type), _jsx(VisibilityToggle, { objectId: child.id })] })] }, child.id))) }) })] }));
};
export default GroupListItem;

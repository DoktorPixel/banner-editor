import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { ListItem, Collapse, List, IconButton } from "@mui/material";
import { SvgLayout, ArrowRight, ArrowDown, SvgLayoutOpen, SvgImage, SvgText, } from "../../assets/icons";
import { useChildProperties, useObjectTypeLabel } from "../../utils/hooks";
import { VisibilityToggle } from "./button-groups/VisibilityToggle";
import { useDraggable } from "@dnd-kit/core";
const ChildGroupListItem = ({ groupId, child, }) => {
    const [open, setOpen] = useState(false);
    const { selectChild, selectedChildId } = useChildProperties();
    const getObjectTypeLabel = useObjectTypeLabel();
    const handleToggle = () => setOpen(!open);
    const { attributes, listeners, setNodeRef } = useDraggable({ id: `flex-child-${groupId}-${child.id}`, data: { kind: "flex-child", groupId, childId: child.id } });
    const handleChildClick = (event) => {
        event.stopPropagation();
        selectChild(groupId, child.id);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: setNodeRef, ...listeners, ...attributes, style: { touchAction: "none" }, children: _jsxs(ListItem, { component: "li", onClick: handleChildClick, sx: {
                        pl: 4,
                        cursor: "pointer",
                        backgroundColor: selectedChildId?.childId === child.id ? "#EEEEEE" : "white",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        padding: "5px 0 5px 36px",
                        display: "flex",
                        alignItems: "center",
                    }, children: [_jsx(IconButton, { size: "small", edge: "start", sx: { marginRight: "3px" }, onClick: handleToggle, children: open ? _jsx(ArrowDown, {}) : _jsx(ArrowRight, {}) }), open ? _jsx(SvgLayoutOpen, {}) : _jsx(SvgLayout, {}), _jsxs("span", { className: "layers-list-item", children: [child.name || getObjectTypeLabel(child.type), _jsx(VisibilityToggle, { objectId: child.id })] })] }) }), _jsx(Collapse, { in: open, timeout: "auto", unmountOnExit: true, children: _jsx(List, { component: "div", disablePadding: true, className: "group-list-item", children: child.children?.map((subChild) => subChild.type === "group" ? (_jsx(ChildGroupListItem, { groupId: child.id, child: subChild }, subChild.id)) : (_jsxs(ListItem, { component: "li", onClick: (e) => {
                            e.stopPropagation();
                            selectChild(child.id, subChild.id);
                        }, sx: {
                            pl: 6,
                            cursor: "pointer",
                            backgroundColor: selectedChildId?.childId === subChild.id
                                ? "#EEEEEE"
                                : "white",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                            padding: "5px 0 5px 57px",
                            display: "flex",
                            alignItems: "center",
                        }, children: [subChild.type === "text" && _jsx(SvgText, {}), subChild.type === "image" && _jsx(SvgImage, {}), subChild.type === "figure" && _jsx(SvgImage, {}), _jsxs("span", { className: "layers-list-item", children: [subChild.name || getObjectTypeLabel(subChild.type), _jsx(VisibilityToggle, { objectId: subChild.id })] })] }, subChild.id))) }) })] }));
};
export default ChildGroupListItem;

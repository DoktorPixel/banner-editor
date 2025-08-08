import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../../styles/components/ContextMenu.scss";
import { Button } from "@mui/material";
import { stepForwardWithCollision, stepBackwardWithCollision, } from "../../utils/hooks";
import { useBanner } from "../../context/BannerContext";
import { useTranslation } from "react-i18next";
const ContextMenu = ({ x, y, object, onClose, updateObject, objects, }) => {
    const { selectedObjectIds, groupSelectedObjects, ungroupSelectedObject, updateMultipleObjects, } = useBanner();
    const bringToFront = () => {
        const maxZIndex = Math.max(...objects.map((obj) => obj.zIndex || 0));
        updateObject(object.id, { zIndex: maxZIndex + 1 });
        onClose();
    };
    const { t } = useTranslation();
    const sendToBack = () => {
        const minZIndex = Math.min(...objects.map((obj) => obj.zIndex || 0));
        const newZIndex = minZIndex - 1;
        updateObject(object.id, { zIndex: newZIndex });
        onClose();
    };
    const stepForward = () => {
        stepForwardWithCollision(object, objects, updateObject);
        onClose();
    };
    const stepBackward = () => {
        stepBackwardWithCollision(object, objects, updateObject);
        onClose();
    };
    const groupSelectedObjectsAbstract = () => {
        if (selectedObjectIds.length < 2)
            return;
        const newAbstractGroupId = Date.now();
        const updates = selectedObjectIds.reduce((acc, id) => {
            acc[id] = { abstractGroupId: newAbstractGroupId };
            return acc;
        }, {});
        updateMultipleObjects(updates);
    };
    const ungroupSelectedObjectsAbstract = () => {
        if (selectedObjectIds.length === 0)
            return;
        const updates = selectedObjectIds.reduce((acc, id) => {
            acc[id] = { abstractGroupId: null };
            return acc;
        }, {});
        updateMultipleObjects(updates);
    };
    return (_jsxs("div", { className: "context-menu", id: "context-menu", style: {
            top: y,
            left: x,
        }, children: [_jsx(Button, { onClick: stepForward, style: { padding: "2px 6px", fontSize: "12px" }, children: t("contextMenu.moveForward") }), _jsx(Button, { onClick: bringToFront, style: { padding: "2px 6px", fontSize: "12px" }, children: t("contextMenu.bringToFront") }), _jsx(Button, { onClick: stepBackward, style: { padding: "2px 6px", fontSize: "12px" }, children: t("contextMenu.moveBackward") }), _jsx(Button, { onClick: sendToBack, style: { padding: "2px 6px", fontSize: "12px" }, children: t("contextMenu.sendToBack") }), _jsx(Button, { onClick: groupSelectedObjects, disabled: selectedObjectIds.length < 2, style: {
                    padding: "2px 6px",
                    fontSize: "12px",
                    textAlign: "start",
                    minWidth: "10px",
                }, children: t("contextMenu.group") }), _jsx(Button, { onClick: ungroupSelectedObject, disabled: selectedObjectIds.length !== 1 ||
                    objects.find((obj) => obj.id === selectedObjectIds[0])?.type !==
                        "group", style: { padding: "2px 6px", fontSize: "12px" }, children: t("contextMenu.ungroup") }), _jsx(Button, { onClick: groupSelectedObjectsAbstract, disabled: selectedObjectIds.length < 2 ||
                    !objects.some((obj) => selectedObjectIds.includes(obj.id) &&
                        (obj.abstractGroupId === null ||
                            obj.abstractGroupId === undefined)), style: { padding: "2px 6px", fontSize: "12px" }, children: t("contextMenu.groupVirtual") }), _jsx(Button, { onClick: ungroupSelectedObjectsAbstract, disabled: selectedObjectIds.length < 2 ||
                    !objects.some((obj) => selectedObjectIds.includes(obj.id) && obj.abstractGroupId != null), style: { padding: "2px 6px", fontSize: "12px" }, children: t("contextMenu.ungroupVirtual") })] }));
};
export default ContextMenu;

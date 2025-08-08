import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useChildOrder, useChildProperties } from "../../../utils/hooks";
import { useTranslation } from "react-i18next";
export const ChildOrderControls = ({ object, }) => {
    const { selectedChildId } = useChildProperties();
    const { getGroupChildren, moveChildUp, moveChildDown } = useChildOrder();
    const { t } = useTranslation();
    const groupChildren = selectedChildId
        ? getGroupChildren(selectedChildId.groupId)
        : [];
    const currentIndex = groupChildren.findIndex((child) => child.id === object.id);
    const canMoveUp = currentIndex > 0;
    const canMoveDown = currentIndex >= 0 && currentIndex < groupChildren.length - 1;
    const handleMoveUp = () => {
        if (selectedChildId && canMoveUp) {
            moveChildUp(selectedChildId.groupId, object.id);
        }
    };
    const handleMoveDown = () => {
        if (selectedChildId && canMoveDown) {
            moveChildDown(selectedChildId.groupId, object.id);
        }
    };
    return (_jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
        }, children: [_jsx(Typography, { variant: "subtitle2", children: t("sidebar.order") }), _jsx(IconButton, { onClick: handleMoveUp, disabled: !canMoveUp, title: "Move Up", children: _jsx(ArrowUpwardIcon, {}) }), _jsx(IconButton, { onClick: handleMoveDown, disabled: !canMoveDown, title: "Move Down", children: _jsx(ArrowDownwardIcon, {}) })] }));
};
export default ChildOrderControls;

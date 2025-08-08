import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export const ResizeHandles = ({ objectId, selectedObjectId, handleResizeMouseDown, }) => {
    const directions = [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "middle-top",
        "middle-bottom",
        "middle-left",
        "middle-right",
    ];
    return (_jsx(_Fragment, { children: directions.map((direction) => (_jsx("div", { className: `resize-handle ${direction} ${selectedObjectId === objectId ? "selected" : ""}`, onMouseDown: (e) => handleResizeMouseDown(objectId, direction, e) }, direction))) }));
};

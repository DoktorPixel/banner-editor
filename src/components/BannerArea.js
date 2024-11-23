import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useBanner } from "../context/BannerContext";
const BannerArea = () => {
    const { objects, updateObject } = useBanner();
    const [draggingId, setDraggingId] = useState(null);
    const bannerRef = useRef(null);
    const handleMouseDown = (id, event) => {
        event.preventDefault();
        setDraggingId(id);
    };
    const handleMouseMove = (event) => {
        if (draggingId !== null && bannerRef.current) {
            const rect = bannerRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            updateObject(draggingId, { x, y });
        }
    };
    const handleMouseUp = () => {
        setDraggingId(null);
    };
    return (_jsx("div", { className: "banner-area", ref: bannerRef, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, children: objects.map((object) => (_jsx("div", { style: {
                position: "absolute",
                left: object.x,
                top: object.y,
                cursor: "move",
                width: object.width || "auto",
                height: object.height || "auto",
            }, onMouseDown: (e) => handleMouseDown(object.id, e), children: object.type === "text" ? (_jsx("p", { style: {
                    fontSize: object.fontSize,
                    color: object.color,
                    fontWeight: object.fontWeight,
                    fontStyle: object.fontStyle,
                    textTransform: object.textTransform,
                    textDecoration: object.textDecoration,
                    textAlign: object.textAlign,
                }, children: object.content })) : (_jsx("img", { src: object.src, alt: "img", style: {
                    width: object.width || 300,
                    height: object.height || 300,
                } })) }, object.id))) }));
};
export default BannerArea;

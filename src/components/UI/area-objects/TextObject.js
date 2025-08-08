import { jsx as _jsx } from "react/jsx-runtime";
import { computeOpacity, replaceDynamicText } from "../../../utils/hooks";
export const TextObject = ({ object, isHidden, keyValuePairs, }) => {
    return (_jsx("div", { id: `${object.id}`, "data-condition": JSON.stringify(object.condition), className: "text-field", style: {
            fontSize: object.fontSize,
            color: object.color,
            fontFamily: object.fontFamily || "Poppins, sans-serif",
            fontWeight: object.fontWeight,
            fontStyle: object.fontStyle,
            textTransform: object.textTransform,
            lineHeight: object.lineHeight,
            letterSpacing: object.letterSpacing,
            opacity: computeOpacity(object.opacity, isHidden),
            textDecoration: object.textDecoration,
            textAlign: object.textAlign,
            display: object.maxLines ? "-webkit-box" : "block",
            WebkitLineClamp: object.maxLines,
            WebkitBoxOrient: object.maxLines ? "vertical" : undefined,
            overflow: object.maxLines ? "hidden" : undefined,
            whiteSpace: object.autoWidth ? "nowrap" : "pre-wrap",
        }, children: replaceDynamicText(object.content ?? "", keyValuePairs) }));
};

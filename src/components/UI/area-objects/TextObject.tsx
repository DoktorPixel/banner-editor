import React from "react";
import { BannerObject, KeyValuePair } from "../../../types";
import { computeOpacity, replaceDynamicText } from "../../../utils/hooks";

interface Props {
  object: BannerObject;
  isHidden: boolean;
  keyValuePairs: KeyValuePair[];
}

export const TextObject: React.FC<Props> = ({
  object,
  isHidden,
  keyValuePairs,
}) => {
  return (
    <div
      id={`${object.id}`}
      data-condition={JSON.stringify(object.condition)}
      className="text-field"
      style={{
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
      }}
    >
      {replaceDynamicText(object.content ?? "", keyValuePairs)}
    </div>
  );
};

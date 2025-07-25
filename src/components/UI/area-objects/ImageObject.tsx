import React from "react";
import { BannerObject, KeyValuePair, DynamicImg } from "../../../types";
import { computeOpacity } from "../../../utils/hooks";
import { replaceDynamicVariablesForDynamicImg } from "../../../utils/hooks";

interface Props {
  object: BannerObject;
  isHidden: boolean;
  keyValuePairs: KeyValuePair[];
  dynamicImgs?: DynamicImg[];
  fallbackText?: string;
}

export const ImageObject: React.FC<Props> = ({
  object,
  isHidden,
  keyValuePairs,
  dynamicImgs,
  fallbackText,
}) => {
  return (
    <img
      id={`${object.id}`}
      data-condition={JSON.stringify(object.condition)}
      className="image-field"
      src={replaceDynamicVariablesForDynamicImg(
        object.src ?? "",
        keyValuePairs,
        dynamicImgs ?? [],
        object.object_id,
        object.logoName,
        fallbackText
      )}
      alt="img"
      style={{
        width: "100%",
        height: "100%",
        objectFit: object.objectFit,
        opacity: computeOpacity(object.opacity, isHidden),
      }}
    />
  );
};

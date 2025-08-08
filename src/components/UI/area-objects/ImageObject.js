import { jsx as _jsx } from "react/jsx-runtime";
import { computeOpacity } from "../../../utils/hooks";
import { replaceDynamicVariablesForDynamicImg } from "../../../utils/hooks";
export const ImageObject = ({ object, isHidden, keyValuePairs, dynamicImgs, fallbackText, }) => {
    return (_jsx("img", { id: `${object.id}`, "data-condition": JSON.stringify(object.condition), className: "image-field", src: replaceDynamicVariablesForDynamicImg(object.src ?? "", keyValuePairs, dynamicImgs ?? [], object.object_id, object.logoName, fallbackText), alt: "img", style: {
            width: "100%",
            height: "100%",
            objectFit: object.objectFit,
            opacity: computeOpacity(object.opacity, isHidden),
        } }));
};

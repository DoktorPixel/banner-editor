import { jsx as _jsx } from "react/jsx-runtime";
import { EyeClosed, EyeOpen } from "../../../assets/icons";
import { IconButton } from "@mui/material";
import { useConfig } from "../../../context/ConfigContext";
export const VisibilityToggle = ({ objectId, }) => {
    const { hiddenObjectIds, toggleHiddenObject } = useConfig();
    const isVisible = !hiddenObjectIds.includes(objectId);
    return (_jsx(IconButton, { onClick: () => toggleHiddenObject(objectId), size: "small", sx: {
            width: 24,
            height: 24,
            padding: 0,
            marginLeft: "10px",
        }, children: isVisible ? _jsx(EyeOpen, {}) : _jsx(EyeClosed, {}) }));
};

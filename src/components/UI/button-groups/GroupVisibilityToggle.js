import { jsx as _jsx } from "react/jsx-runtime";
import { EyeClosed, EyeOpen } from "../../../assets/icons";
import { IconButton } from "@mui/material";
import { useConfig } from "../../../context/ConfigContext";
export const GroupVisibilityToggle = ({ objectIds, }) => {
    const { hiddenObjectIds, toggleHiddenObject } = useConfig();
    const isGroupVisible = objectIds.some((id) => !hiddenObjectIds.includes(id));
    const handleToggleGroup = () => {
        const shouldHide = isGroupVisible;
        objectIds.forEach((id) => {
            const isCurrentlyHidden = hiddenObjectIds.includes(id);
            if (shouldHide && !isCurrentlyHidden)
                toggleHiddenObject(id);
            if (!shouldHide && isCurrentlyHidden)
                toggleHiddenObject(id);
        });
    };
    return (_jsx(IconButton, { onClick: handleToggleGroup, size: "small", sx: {
            width: 24,
            height: 24,
            padding: 0,
            marginLeft: "10px",
        }, children: isGroupVisible ? _jsx(EyeOpen, {}) : _jsx(EyeClosed, {}) }));
};

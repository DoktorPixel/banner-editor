import { EyeClosed, EyeOpen } from "../../../assets/icons";
import { IconButton } from "@mui/material";
import { useConfig } from "../../../context/ConfigContext";

interface GroupVisibilityToggleProps {
  objectIds: number[];
  show?: boolean;
}

export const GroupVisibilityToggle2: React.FC<GroupVisibilityToggleProps> = ({
  objectIds,
  show = false,
}) => {
  const { hiddenObjectIds, toggleHiddenObject } = useConfig();

  const isGroupVisible = objectIds.some((id) => !hiddenObjectIds.includes(id));

  if (!show && isGroupVisible) {
    return null;
  }

  const handleToggleGroup = () => {
    const shouldHide = isGroupVisible;
    objectIds.forEach((id) => {
      const isCurrentlyHidden = hiddenObjectIds.includes(id);
      if (shouldHide && !isCurrentlyHidden) toggleHiddenObject(id);
      if (!shouldHide && isCurrentlyHidden) toggleHiddenObject(id);
    });
  };

  return (
    <IconButton
      onClick={handleToggleGroup}
      size="small"
      sx={{
        width: 24,
        height: 24,
        padding: 0,
        marginLeft: "10px",
      }}
    >
      {isGroupVisible ? <EyeOpen /> : <EyeClosed />}
    </IconButton>
  );
};

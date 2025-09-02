import { EyeClosed, EyeOpen } from "../../../assets/icons";
import { IconButton } from "@mui/material";
import { useConfig } from "../../../context/ConfigContext";

interface VisibilityToggleProps {
  objectId: number;
  show?: boolean;
}

export const VisibilityToggle2: React.FC<VisibilityToggleProps> = ({
  objectId,
  show = false,
}) => {
  const { hiddenObjectIds, toggleHiddenObject } = useConfig();
  const isVisible = !hiddenObjectIds.includes(objectId);

  if (!show && isVisible) {
    return null;
  }

  return (
    <IconButton
      onClick={() => toggleHiddenObject(objectId)}
      size="small"
      sx={{
        width: 24,
        height: 24,
        padding: 0,
      }}
    >
      {isVisible ? <EyeOpen /> : <EyeClosed />}
    </IconButton>
  );
};

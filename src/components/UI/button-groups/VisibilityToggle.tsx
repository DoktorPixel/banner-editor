import { EyeClosed, EyeOpen } from "../../../assets/icons";
import { IconButton } from "@mui/material";
import { useConfig } from "../../../context/ConfigContext";

interface VisibilityToggleProps {
  objectId: number;
}

export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  objectId,
}) => {
  const { hiddenObjectIds, toggleHiddenObject } = useConfig();
  const isVisible = !hiddenObjectIds.includes(objectId);

  return (
    <IconButton
      onClick={() => toggleHiddenObject(objectId)}
      size="small"
      sx={{
        width: 24,
        height: 24,
        padding: 0,
        marginLeft: "10px",
      }}
    >
      {isVisible ? <EyeOpen /> : <EyeClosed />}
    </IconButton>
  );
};

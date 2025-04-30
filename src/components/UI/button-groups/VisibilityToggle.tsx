import { useState } from "react";
import { EyeClosed, EyeOpen } from "../../../assets/icons";
import { IconButton } from "@mui/material";

interface VisibilityToggleProps {
  initialVisible?: boolean;
  onToggle?: (visible: boolean) => void;
}

export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  initialVisible = true,
  onToggle,
}) => {
  const [visible, setVisible] = useState(initialVisible);

  const handleToggle = () => {
    const newState = !visible;
    setVisible(newState);
    onToggle?.(newState);
  };

  return (
    <IconButton
      onClick={handleToggle}
      size="small"
      sx={{
        width: 24,
        height: 24,
        padding: 0,
        marginLeft: "10px",
        // marginLeft: "auto"
      }}
    >
      {visible ? <EyeOpen /> : <EyeClosed />}
    </IconButton>
  );
};

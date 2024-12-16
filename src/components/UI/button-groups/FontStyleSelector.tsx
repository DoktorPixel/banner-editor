import { ButtonGroup, Button } from "@mui/material";
import { TextNormal, TextItalic } from "../../../assets/icons";

interface FontStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FontStyleSelector: React.FC<FontStyleSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="font-style">
      <ButtonGroup
        variant="contained"
        color="primary"
        size="small"
        sx={{ boxShadow: "none" }}
      >
        <Button
          onClick={() => onChange("normal")}
          variant={value === "normal" ? "contained" : "outlined"}
        >
          <TextNormal width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("italic")}
          variant={value === "italic" ? "contained" : "outlined"}
          sx={{ borderColor: "#1976d2" }}
        >
          <TextItalic width="24px" height="24px" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default FontStyleSelector;

import { ButtonGroup, Button, InputLabel } from "@mui/material";
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
      <InputLabel sx={{ mb: "5px", fontSize: "12px" }}>Font style</InputLabel>
      <ButtonGroup size="small" sx={{ boxShadow: "none" }}>
        <Button
          onClick={() => onChange("normal")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "normal" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "normal" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "normal" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextNormal width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("italic")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "italic" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "italic" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "italic" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextItalic width="24px" height="24px" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default FontStyleSelector;

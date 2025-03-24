import { ButtonGroup, Button, InputLabel } from "@mui/material";
import {
  TextAlignLeft,
  TextAlignRight,
  TextAlignCenter,
} from "../../../assets/icons";

interface TextAlignSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextAlignSelector: React.FC<TextAlignSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="text-align">
      <InputLabel sx={{ mb: "5px", fontSize: "12px" }}>Alignment</InputLabel>
      <ButtonGroup color="primary" size="small" sx={{ boxShadow: "none" }}>
        <Button
          onClick={() => onChange("left")}
          sx={{
            height: "30px",
            padding: "0 10px",
            backgroundColor: value === "left" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "left" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "left" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextAlignLeft width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("center")}
          sx={{
            height: "30px",
            padding: "0 10px",
            backgroundColor: value === "center" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "center" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "center" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextAlignCenter width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("right")}
          sx={{
            height: "30px",
            padding: "0 10px",
            backgroundColor: value === "right" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "right" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "right" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextAlignRight width="24px" height="24px" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TextAlignSelector;

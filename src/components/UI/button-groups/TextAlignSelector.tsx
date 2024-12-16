import { ButtonGroup, Button } from "@mui/material";
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
      {/* <span className="title">Вирівнювання тексту (Text Align)</span> */}
      <ButtonGroup
        variant="contained"
        color="primary"
        size="small"
        sx={{ boxShadow: "none" }}
      >
        <Button
          onClick={() => onChange("left")}
          variant={value === "left" ? "contained" : "outlined"}
        >
          <TextAlignLeft width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("center")}
          variant={value === "center" ? "contained" : "outlined"}
        >
          <TextAlignCenter width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("right")}
          variant={value === "right" ? "contained" : "outlined"}
          sx={{ borderColor: "#1976d2" }}
        >
          <TextAlignRight width="24px" height="24px" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TextAlignSelector;

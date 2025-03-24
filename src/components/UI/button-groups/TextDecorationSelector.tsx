import { ButtonGroup, Button, InputLabel } from "@mui/material";
import {
  TextLineThrough,
  TextOverline,
  TextDecorationNone,
  TextUnderline,
} from "../../../assets/icons";

interface TextDecorationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextDecorationSelector: React.FC<TextDecorationSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="text-decoration">
      <InputLabel sx={{ mb: "5px", fontSize: "12px" }}>
        Font decoration
      </InputLabel>
      <ButtonGroup color="primary" size="small" sx={{ boxShadow: "none" }}>
        <Button
          onClick={() => onChange("none")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "none" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "none" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "none" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextDecorationNone width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("underline")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "underline" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "underline" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "underline" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextUnderline width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("overline")}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "overline" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "overline" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "overline" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextOverline width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("line-through")}
          variant={value === "line-through" ? "contained" : "outlined"}
          sx={{
            height: "36px",
            padding: "0 10px",
            backgroundColor: value === "line-through" ? "white" : "#F1F1F1",
            border: "2px solid #F1F1F1",
            color: value === "line-through" ? "black" : "inherit",
            "&:hover": {
              backgroundColor: value === "line-through" ? "white" : "#E8E8E8",
            },
          }}
        >
          <TextLineThrough width="24px" height="24px" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TextDecorationSelector;

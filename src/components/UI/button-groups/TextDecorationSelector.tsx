import { ButtonGroup, Button } from "@mui/material";
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
      <ButtonGroup
        variant="contained"
        color="primary"
        size="small"
        sx={{ boxShadow: "none" }}
      >
        <Button
          onClick={() => onChange("none")}
          variant={value === "none" ? "contained" : "outlined"}
        >
          <TextDecorationNone width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("underline")}
          variant={value === "underline" ? "contained" : "outlined"}
        >
          <TextUnderline width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("overline")}
          variant={value === "overline" ? "contained" : "outlined"}
        >
          <TextOverline width="24px" height="24px" />
        </Button>
        <Button
          onClick={() => onChange("line-through")}
          variant={value === "line-through" ? "contained" : "outlined"}
          sx={{ borderColor: "#1976d2" }}
        >
          <TextLineThrough width="24px" height="24px" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TextDecorationSelector;

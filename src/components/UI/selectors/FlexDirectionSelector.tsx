import { ButtonGroup, Button, Tooltip } from "@mui/material";
import { ArrowDownward, ArrowForward } from "@mui/icons-material";

interface FlexDirectionSelectorProps {
  value: "row" | "column" | "row-reverse" | "column-reverse";
  onChange: (
    value: "row" | "column" | "row-reverse" | "column-reverse"
  ) => void;
}

export const FlexDirectionSelector: React.FC<FlexDirectionSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <ButtonGroup
      fullWidth
      variant="outlined"
      className="flex-direction-selector"
    >
      <Tooltip title="По рядках (row)">
        <Button
          onClick={() => onChange("row")}
          variant={value === "row" ? "contained" : "outlined"}
        >
          <ArrowForward />
        </Button>
      </Tooltip>

      <Tooltip title="По колонках (column)">
        <Button
          onClick={() => onChange("column")}
          variant={value === "column" ? "contained" : "outlined"}
        >
          <ArrowDownward />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};

import { ButtonGroup, Button, Tooltip } from "@mui/material";
import {
  ArrowDownward,
  // ArrowUpward,
  // ArrowBack,
  ArrowForward,
} from "@mui/icons-material";

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

      {/* <Tooltip title="По рядках зворотом (row-reverse)">
        <Button
          onClick={() => onChange("row-reverse")}
          variant={value === "row-reverse" ? "contained" : "outlined"}
        >
          <ArrowBack />
        </Button>
      </Tooltip> */}

      {/* <Tooltip title="По колонках зворотом (column-reverse)">
        <Button
          onClick={() => onChange("column-reverse")}
          variant={value === "column-reverse" ? "contained" : "outlined"}
        >
          <ArrowUpward />
        </Button>
      </Tooltip> */}
    </ButtonGroup>
  );
};

import { ButtonGroup, Button, Box } from "@mui/material";

interface AutoLayoutFormProps {
  justifyContent: "start" | "center" | "end" | "space-between";
  alignItems: "flex-start" | "center" | "flex-end";
  flexDirection: "row" | "column";
  onChange: (changes: { justifyContent?: string; alignItems?: string }) => void;
}

const rowAlignments = [
  { label: "Top-Left", justifyContent: "start", alignItems: "flex-start" },
  { label: "Top-Center", justifyContent: "center", alignItems: "flex-start" },
  { label: "Top-Right", justifyContent: "end", alignItems: "flex-start" },
  { label: "Left", justifyContent: "start", alignItems: "center" },
  { label: "Center", justifyContent: "center", alignItems: "center" },
  { label: "Right", justifyContent: "end", alignItems: "center" },
  { label: "Bottom-Left", justifyContent: "start", alignItems: "flex-end" },
  { label: "Bottom-Center", justifyContent: "center", alignItems: "flex-end" },
  { label: "Bottom-Right", justifyContent: "end", alignItems: "flex-end" },
];

const columnAlignments = [
  { label: "Left-Top", justifyContent: "start", alignItems: "flex-start" },
  { label: "Center-Top", justifyContent: "start", alignItems: "center" },
  { label: "Right-Top", justifyContent: "start", alignItems: "flex-end" },
  { label: "Left", justifyContent: "center", alignItems: "flex-start" },
  { label: "Center", justifyContent: "center", alignItems: "center" },
  { label: "Right", justifyContent: "center", alignItems: "flex-end" },
  { label: "Left-Bottom", justifyContent: "end", alignItems: "flex-start" },
  { label: "Center-Bottom", justifyContent: "end", alignItems: "center" },
  { label: "Right-Bottom", justifyContent: "end", alignItems: "flex-end" },
];

const spaceBetweenRow = [
  { label: "Top", justifyContent: "space-between", alignItems: "flex-start" },
  { label: "Middle", justifyContent: "space-between", alignItems: "center" },
  { label: "Bottom", justifyContent: "space-between", alignItems: "flex-end" },
];

const spaceBetweenColumn = [
  { label: "Left", justifyContent: "space-between", alignItems: "flex-start" },
  { label: "Center", justifyContent: "space-between", alignItems: "center" },
  { label: "Right", justifyContent: "space-between", alignItems: "flex-end" },
];

export const AutoLayoutForm: React.FC<AutoLayoutFormProps> = ({
  justifyContent,
  alignItems,
  flexDirection,
  onChange,
}) => {
  const isSpaceBetween = justifyContent === "space-between";
  const alignments = isSpaceBetween
    ? flexDirection === "row"
      ? spaceBetweenRow
      : spaceBetweenColumn
    : flexDirection === "row"
    ? rowAlignments
    : columnAlignments;

  const isActive = (item: (typeof alignments)[number]) =>
    item.justifyContent === justifyContent && item.alignItems === alignItems;

  return (
    <Box>
      <Box display="flex" flexDirection="column">
        {isSpaceBetween ? (
          <Box
            display="flex"
            flexDirection={flexDirection === "row" ? "column" : "row"}
          >
            {alignments.map((item) => (
              <Button
                key={item.label}
                variant={isActive(item) ? "contained" : "outlined"}
                style={{
                  fontSize: 9,
                  fontWeight: "700",
                  padding: 2,
                  maxWidth: 90,
                }}
                onClick={() => {
                  onChange({
                    justifyContent: item.justifyContent,
                    alignItems: item.alignItems,
                  });
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        ) : (
          [0, 1, 2].map((rowIndex) => (
            <ButtonGroup key={rowIndex} variant="outlined" fullWidth>
              {alignments.slice(rowIndex * 3, rowIndex * 3 + 3).map((item) => (
                <Button
                  key={item.label}
                  variant={isActive(item) ? "contained" : "outlined"}
                  style={{
                    fontSize: 9,
                    fontWeight: "700",
                    padding: 2,
                    maxWidth: 90,
                  }}
                  onClick={() => {
                    onChange({
                      justifyContent: item.justifyContent,
                      alignItems: item.alignItems,
                    });
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </ButtonGroup>
          ))
        )}
      </Box>
    </Box>
  );
};

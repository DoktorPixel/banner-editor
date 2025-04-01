import { ButtonGroup, Button, Box } from "@mui/material";
import { GroupLeft, GroupCenter, GroupRight } from "../../../assets/icons";

interface AutoLayoutFormProps {
  justifyContent: "start" | "center" | "end" | "space-between";
  alignItems: "flex-start" | "center" | "flex-end";
  flexDirection: "row" | "column";
  onChange: (changes: { justifyContent?: string; alignItems?: string }) => void;
}

const rowAlignments = [
  { label: <GroupLeft />, justifyContent: "start", alignItems: "flex-start" },
  {
    label: <GroupCenter />,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  { label: <GroupRight />, justifyContent: "end", alignItems: "flex-start" },
  { label: <GroupLeft />, justifyContent: "start", alignItems: "center" },
  { label: <GroupCenter />, justifyContent: "center", alignItems: "center" },
  { label: <GroupRight />, justifyContent: "end", alignItems: "center" },
  { label: <GroupLeft />, justifyContent: "start", alignItems: "flex-end" },
  { label: <GroupCenter />, justifyContent: "center", alignItems: "flex-end" },
  { label: <GroupRight />, justifyContent: "end", alignItems: "flex-end" },
];

const columnAlignments = [
  { label: <GroupLeft />, justifyContent: "start", alignItems: "flex-start" },
  { label: <GroupCenter />, justifyContent: "start", alignItems: "center" },
  { label: <GroupRight />, justifyContent: "start", alignItems: "flex-end" },
  { label: <GroupLeft />, justifyContent: "center", alignItems: "flex-start" },
  { label: <GroupCenter />, justifyContent: "center", alignItems: "center" },
  { label: <GroupRight />, justifyContent: "center", alignItems: "flex-end" },
  { label: <GroupLeft />, justifyContent: "end", alignItems: "flex-start" },
  { label: <GroupCenter />, justifyContent: "end", alignItems: "center" },
  { label: <GroupRight />, justifyContent: "end", alignItems: "flex-end" },
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
            {alignments.map((item, index) => (
              <Button
                key={index}
                sx={{
                  fontSize: 9,
                  maxWidth: 90,
                  // borderRadius: 0,
                  border: "2px solid #F1F1F1",
                  padding: "4px 6px",
                  color: "#000000",
                  fontWeight: "400",
                  // borderRadius: isActive(item) ? "14px" : "0px",
                  backgroundColor: isActive(item) ? "white" : "#F1F1F1",
                  "&:hover": {
                    backgroundColor: isActive(item) ? "#e3e3e3" : "#f5f5f5",
                  },
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
            <ButtonGroup key={rowIndex}>
              {alignments
                .slice(rowIndex * 3, rowIndex * 3 + 3)
                .map((item, index) => {
                  let borderRadiusStyles = {};

                  if (rowIndex === 0 && index === 0) {
                    borderRadiusStyles = { borderTopLeftRadius: "6px" };
                  } else if (rowIndex === 0 && index === 2) {
                    borderRadiusStyles = { borderTopRightRadius: "6px" };
                  } else if (rowIndex === 2 && index === 0) {
                    borderRadiusStyles = { borderBottomLeftRadius: "6px" };
                  } else if (rowIndex === 2 && index === 2) {
                    borderRadiusStyles = { borderBottomRightRadius: "6px" };
                  }

                  return (
                    <Button
                      key={index}
                      sx={{
                        maxWidth: 90,
                        border: "2px solid #F1F1F1",
                        padding: "7px 10px",
                        color: "#000000",
                        fontWeight: "400",
                        borderRadius: 0,
                        backgroundColor: isActive(item) ? "white" : "#F1F1F1",
                        "&:hover": {
                          backgroundColor: isActive(item)
                            ? "#e3e3e3"
                            : "#fcfafa",
                        },
                        ...borderRadiusStyles,
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
                  );
                })}
            </ButtonGroup>
          ))
        )}
      </Box>
    </Box>
  );
};

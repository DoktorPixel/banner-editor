import { ButtonGroup, Button, Box } from "@mui/material";
import {
  GroupLeft,
  GroupCenter,
  GroupRight,
  GroupRowLeft,
  GroupRowCenter,
  GroupRowRight,
  RowLeftBottom,
  RowCenterBottom,
  RowRightBottom,
} from "../../../assets/icons";

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
  { label: <GroupRowLeft />, justifyContent: "start", alignItems: "center" },
  { label: <GroupRowCenter />, justifyContent: "center", alignItems: "center" },
  { label: <GroupRowRight />, justifyContent: "end", alignItems: "center" },
  { label: <RowLeftBottom />, justifyContent: "start", alignItems: "flex-end" },
  {
    label: <RowCenterBottom />,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  { label: <RowRightBottom />, justifyContent: "end", alignItems: "flex-end" },
];

const columnAlignments = [
  { label: <GroupLeft />, justifyContent: "start", alignItems: "flex-start" },
  { label: <GroupCenter />, justifyContent: "start", alignItems: "center" },
  { label: <GroupRight />, justifyContent: "start", alignItems: "flex-end" },
  {
    label: <GroupRowLeft />,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  { label: <GroupRowCenter />, justifyContent: "center", alignItems: "center" },
  {
    label: <GroupRowRight />,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  { label: <RowLeftBottom />, justifyContent: "end", alignItems: "flex-start" },
  { label: <RowCenterBottom />, justifyContent: "end", alignItems: "center" },
  { label: <RowRightBottom />, justifyContent: "end", alignItems: "flex-end" },
];

const spaceBetweenRow = [
  {
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "26px" }}>
        <GroupLeft />
        <GroupCenter />
        <GroupRight />
      </div>
    ),
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  {
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <GroupRowLeft />
        <GroupRowCenter />
        <GroupRowRight />
      </div>
    ),
    justifyContent: "space-between",
    alignItems: "center",
  },
  {
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <RowLeftBottom />
        <RowCenterBottom />
        <RowRightBottom />
      </div>
    ),
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
];

const spaceBetweenColumn = [
  {
    label: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <GroupLeft />
        <GroupRowLeft />
        <RowLeftBottom />
      </div>
    ),
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  {
    label: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <GroupCenter />
        <GroupRowCenter />
        <RowCenterBottom />
      </div>
    ),
    justifyContent: "space-between",
    alignItems: "center",
  },
  {
    label: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <GroupRight />
        <GroupRowRight />
        <RowRightBottom />
      </div>
    ),
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
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
                  maxWidth: 118,
                  // borderRadius: 0,
                  border: "2px solid #F1F1F1",
                  padding: "7px 10px",
                  minWidth: "39px",
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

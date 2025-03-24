import { Button, FormControl, Typography } from "@mui/material";

interface ActionToggleProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
}

function ActionToggle<T extends string>({
  label,
  options,
  selected,
  onChange,
}: ActionToggleProps<T>) {
  return (
    <FormControl fullWidth sx={{ marginTop: "6px", marginBottom: "8px" }}>
      <Typography variant="caption" sx={{ color: "#00000099" }}>
        {label}
      </Typography>
      <div
        style={{
          display: "flex",
          backgroundColor: "#F1F1F1",
          padding: "3px",
          borderRadius: "5px",
        }}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              flex: 1,
              width: "100%",
              padding: "4px 6px",
              color: "#000000",
              fontWeight: "400",
              borderRadius: selected === option.value ? "4px" : "0px",
              backgroundColor: selected === option.value ? "white" : "#F1F1F1",
              "&:hover": {
                backgroundColor:
                  selected === option.value ? "#e3e3e3" : "#f5f5f5",
              },
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </FormControl>
  );
}

export default ActionToggle;

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "5px",
          padding: "6px 10px",
          fontWeight: "700",
        },
      },
    },
  },
});

export default theme;

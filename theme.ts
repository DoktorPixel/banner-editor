import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: "22px",
      fontWeight: 400,
      // color: "#333",
    },
    subtitle2: {
      fontSize: "16px",
      fontWeight: 400,
      // color: "#666",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          scrollbar-width: thin;
          scrollbar-color: #F1F1F1 transparent;
        }

        *::-webkit-scrollbar {
          width: 5px;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #F1F1F1;
          border-radius: 6px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: #CFCACA;
        }
      `,
    },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1F1F1",
          borderRadius: "5px",
          border: "none",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
        input: {
          padding: "6px ",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1F1F1",
          borderRadius: "5px",
          border: "none",
        },
        input: {
          padding: "6px ",
        },
      },
    },
  },
});

export default theme;

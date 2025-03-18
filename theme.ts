import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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
  },
});

export default theme;

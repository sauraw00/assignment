import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e88e5",
    },
    secondary: {
      main: "#00897b",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;


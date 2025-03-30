// lib/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f4e37", // Coffee brown
    },
    secondary: {
      main: "#d9a561", // Caramel gold
    },
    background: {
      default: "#f9f4f0", // Creamy base
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;

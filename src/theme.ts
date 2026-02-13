import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f766e",
      light: "#ccfbf1",
    },
    secondary: {
      main: "#0d9488",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
    background: {
      default: "#ffffff",
      paper: "#f8fafc",
    },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    h1: {
      fontSize: "1.75rem",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "0.95rem",
      fontWeight: 600,
    },
    body2: {
      fontSize: "0.9rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.65rem",
          height: "auto",
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
        },
        sizeSmall: {
          padding: "1px 4px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.8125rem",
          borderBottomColor: "#f1f5f9",
        },
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          textTransform: "uppercase" as const,
          letterSpacing: "0.04em",
          color: "#64748b",
          borderBottomColor: "#e2e8f0",
          borderBottomWidth: 2,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f8fafc",
          },
          "&:last-child td": {
            borderBottom: "none",
          },
        },
      },
    },
  },
});

export default theme;

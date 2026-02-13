import { Paper } from "@mui/material";
import { Link } from "react-router-dom";

export default function ArchitectureDiagram() {
  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: "background.paper",
        borderRadius: "10px",
        px: 4,
        py: 3,
        fontFamily: "monospace",
        fontSize: "0.8rem",
        lineHeight: 1.7,
        overflowX: "auto",
        my: 2,
        whiteSpace: "pre",
        color: "text.secondary",
        "& a": {
          color: "secondary.main",
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
        },
        "& strong": {
          color: "text.primary",
          fontWeight: 600,
        },
      }}
    >
      <Link to="/identification"><strong>identification</strong></Link>{"\n"}
      {"  └─ "}<strong>#taxon</strong>{"              ──references──▶  "}<Link to="/occurrence"><strong>occurrence</strong></Link>{"\n"}
      {"                                                └─ "}<strong>#location</strong>{"\n"}
      {"                                                └─ "}<strong>#imageEmbed</strong>
    </Paper>
  );
}

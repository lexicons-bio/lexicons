import { Card, CardActionArea, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  nsid: string;
  title: string;
  description: string;
  meta: string;
  to: string;
}

export default function LexiconCard({ nsid, title, description, meta, to }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "12px",
        transition: "border-color 0.15s, box-shadow 0.15s",
        "&:hover": {
          borderColor: "secondary.main",
          boxShadow: "0 2px 12px rgba(15, 118, 110, 0.08)",
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={to}
        sx={{ p: 3, display: "block", textDecoration: "none", color: "inherit" }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            color: "secondary.main",
            mb: 0.75,
          }}
        >
          {nsid}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.75 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", lineHeight: 1.5, mb: 1.5 }}>
          {description}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
          {meta}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

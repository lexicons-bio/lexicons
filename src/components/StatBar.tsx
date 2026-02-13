import { Box, Paper, Typography } from "@mui/material";

interface Stat {
  value: string | number;
  label: string;
}

export default function StatBar({ stats }: { stats: Stat[] }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
      {stats.map(({ value, label }) => (
        <Paper
          key={label}
          variant="outlined"
          sx={{
            px: 2.5,
            py: 1.75,
            minWidth: 120,
            borderColor: "divider",
            bgcolor: "background.paper",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "text.disabled",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mt: 0.25,
            }}
          >
            {label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

import { Chip } from "@mui/material";

type Status = "mapped" | "missing" | "extension" | "gbif-req" | "gbif-rec";

const statusStyles: Record<Status, { bgcolor: string; color: string }> = {
  mapped: { bgcolor: "#dcfce7", color: "#166534" },
  missing: { bgcolor: "#fef2f2", color: "#991b1b" },
  extension: { bgcolor: "#eff6ff", color: "#1e40af" },
  "gbif-req": { bgcolor: "#fef3c7", color: "#92400e" },
  "gbif-rec": { bgcolor: "#f1f5f9", color: "#475569" },
};

const statusLabels: Record<Status, string> = {
  mapped: "mapped",
  missing: "missing",
  extension: "extension",
  "gbif-req": "gbif req",
  "gbif-rec": "gbif rec",
};

export default function StatusBadge({ status }: { status: Status }) {
  const style = statusStyles[status];
  return (
    <Chip
      label={statusLabels[status]}
      size="small"
      sx={{
        bgcolor: style.bgcolor,
        color: style.color,
        fontSize: status.startsWith("gbif") ? "0.6rem" : "0.65rem",
        borderRadius: "10px",
      }}
    />
  );
}

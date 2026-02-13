import { useParams, Navigate } from "react-router-dom";
import { Box, Typography, Divider, Link as MuiLink } from "@mui/material";
import StatBar from "../components/StatBar";
import FieldTable from "../components/FieldTable";
import DwcAlignmentTable from "../components/DwcAlignmentTable";
import { MODELS, ATPROTO_FIELDS, getFlatProperties, getDefProperties } from "../data/lexicons";
import { dwcTerms } from "../data/dwcTerms";
import { computeModelStats } from "../data/stats";

export default function LexiconPage() {
  const { slug } = useParams<{ slug: string }>();
  const model = MODELS.find((m) => m.slug === slug);

  if (!model) return <Navigate to="/" replace />;

  const lexProps = getFlatProperties(model.lexicon);
  const stats = computeModelStats(dwcTerms, lexProps, model.classes);
  const lexId = model.lexicon.id;
  const fieldCount = Object.keys(lexProps).filter(
    (f) => !ATPROTO_FIELDS.has(f)
  ).length;

  const defs = model.lexicon.defs;

  // Build TOC links
  const tocItems = Object.entries(defs)
    .filter(([, defBody]) => {
      const { properties } = getDefProperties(defBody);
      return Object.keys(properties).length > 0;
    })
    .map(([defName]) => defName);

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.85rem",
            color: "secondary.main",
            mb: 0.5,
          }}
        >
          {lexId}
        </Typography>
        <Typography variant="h1" sx={{ mb: 1 }}>
          {model.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {model.description}
        </Typography>
      </Box>

      <StatBar
        stats={[
          { value: fieldCount, label: "Fields" },
          { value: `${stats.pct.toFixed(0)}%`, label: "DwC Coverage" },
          { value: stats.mapped, label: "Mapped" },
          { value: stats.missing, label: "Missing" },
        ]}
      />

      <Typography variant="h2" sx={{ mb: 1 }}>
        Lexicon Reference
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Definitions:{" "}
        {tocItems.map((name) => (
          <MuiLink
            key={name}
            href={`#${name}`}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontSize: "0.8rem",
              mr: 2,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            #{name}
          </MuiLink>
        ))}
      </Typography>

      {Object.entries(defs).map(([defName, defBody]) => (
        <FieldTable
          key={defName}
          defName={defName}
          defBody={defBody}
          lexiconId={lexId}
          dwcTerms={dwcTerms}
        />
      ))}

      <Divider sx={{ my: 5 }} />

      <Typography variant="h2" sx={{ mb: 1 }}>
        Darwin Core Alignment
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Cross-reference against{" "}
        <MuiLink
          href="https://dwc.tdwg.org/terms/"
          target="_blank"
          rel="noopener"
          sx={{ color: "primary.main" }}
        >
          Darwin Core
        </MuiLink>{" "}
        terms. Green = mapped, red = not yet implemented.
      </Typography>

      <DwcAlignmentTable
        classes={model.classes}
        dwcTerms={dwcTerms}
        lexProps={lexProps}
      />
    </>
  );
}

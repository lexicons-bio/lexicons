import { Box, Typography, Divider, Link as MuiLink } from "@mui/material";
import StatBar from "../components/StatBar";
import LexiconCard from "../components/LexiconCard";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import { MODELS, ATPROTO_FIELDS, getFlatProperties } from "../data/lexicons";
import { dwcTerms } from "../data/dwcTerms";
import { computeGlobalStats, computeModelStats } from "../data/stats";

export default function Overview() {
  const modelProps = MODELS.map((m) => getFlatProperties(m.lexicon));
  const allClasses = MODELS.flatMap((m) => m.classes);
  const globalStats = computeGlobalStats(dwcTerms, modelProps, allClasses);

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 1 }}>
          lexicons.bio
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          AT Protocol lexicons for decentralized biodiversity observation data, aligned with{" "}
          <MuiLink href="https://dwc.tdwg.org/" target="_blank" rel="noopener" sx={{ color: "primary.main" }}>
            Darwin Core
          </MuiLink>{" "}
          and{" "}
          <MuiLink href="https://www.gbif.org/" target="_blank" rel="noopener" sx={{ color: "primary.main" }}>
            GBIF
          </MuiLink>{" "}
          standards.
        </Typography>
      </Box>

      <StatBar
        stats={[
          { value: MODELS.length, label: "Lexicons" },
          { value: globalStats.totalFields, label: "Fields" },
          { value: `${globalStats.pct.toFixed(0)}%`, label: "DwC Coverage" },
          { value: globalStats.mapped, label: "Terms Mapped" },
        ]}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 2,
          my: 3,
        }}
      >
        {MODELS.map((model, idx) => {
          const props = modelProps[idx];
          const ms = computeModelStats(dwcTerms, props, model.classes);
          const fieldCount = Object.keys(props).filter(
            (f) => !ATPROTO_FIELDS.has(f)
          ).length;
          return (
            <LexiconCard
              key={model.slug}
              nsid={`bio.lexicons.${model.slug}`}
              title={model.name}
              description={model.description}
              meta={`${fieldCount} fields · ${ms.pct.toFixed(0)}% DwC coverage`}
              to={`/${model.slug}`}
            />
          );
        })}
      </Box>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h2" sx={{ mb: 1 }}>
        Architecture
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Records use AT Protocol's <Code>strongRef</Code> (URI + CID) to create
        immutable links. The occurrence record sits at the center, with
        identifications referencing it.
      </Typography>

      <ArchitectureDiagram />

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Taxonomy lives in identification records, not occurrences — this enables
        community consensus identification where multiple users can propose IDs
        for the same observation.
      </Typography>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h2" sx={{ mb: 1 }}>
        Usage
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        These lexicons follow the{" "}
        <MuiLink
          href="https://atproto.com/specs/lexicon"
          target="_blank"
          rel="noopener"
          sx={{ color: "primary.main" }}
        >
          AT Protocol Lexicon
        </MuiLink>{" "}
        schema format. Records are stored in users' personal data servers (PDS)
        under the appropriate collection, referenced by NSID.
      </Typography>

      <Typography variant="h3" sx={{ mt: 3.5, mb: 1 }}>
        Record keys
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        All records use <Code>tid</Code> (timestamp-based identifier) as their
        record key, per the{" "}
        <MuiLink
          href="https://atproto.com/specs/record-key"
          target="_blank"
          rel="noopener"
          sx={{ color: "primary.main" }}
        >
          AT Protocol record key spec
        </MuiLink>
        .
      </Typography>

      <Typography variant="h3" sx={{ mt: 3.5, mb: 1 }}>
        Cross-references
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Records reference each other using{" "}
        <Code>com.atproto.repo.strongRef</Code>, which contains both a URI and
        CID. The CID ensures you're referencing a specific version of the target
        record.
      </Typography>
    </>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="code"
      sx={{
        fontFamily: "monospace",
        fontSize: "0.85em",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: "4px",
        px: 0.75,
        py: 0.25,
      }}
    >
      {children}
    </Box>
  );
}

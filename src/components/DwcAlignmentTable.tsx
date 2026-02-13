import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link as MuiLink,
  Box,
} from "@mui/material";
import StatusBadge from "./StatusBadge";
import type { DwcTerm } from "../data/dwcTerms";
import type { LexiconProperty } from "../data/lexicons";
import {
  FIELD_TO_DWC,
  ATPROTO_FIELDS,
  GBIF_REQUIRED,
  GBIF_RECOMMENDED,
  typeLabel,
} from "../data/lexicons";

interface Props {
  classes: string[];
  dwcTerms: Record<string, DwcTerm>;
  lexProps: Record<string, LexiconProperty & { required?: boolean }>;
}

export default function DwcAlignmentTable({ classes, dwcTerms, lexProps }: Props) {
  // Build mapping: DwC name -> (lexicon field name, prop)
  const lexByDwc: Record<string, { fieldName: string; prop: LexiconProperty & { required?: boolean } }> = {};
  const mappedLexFields = new Set<string>();

  for (const [fieldName, prop] of Object.entries(lexProps)) {
    if (ATPROTO_FIELDS.has(fieldName)) continue;
    const dwcName = FIELD_TO_DWC[fieldName] ?? fieldName;
    if (dwcName in dwcTerms) {
      lexByDwc[dwcName] = { fieldName, prop };
      mappedLexFields.add(fieldName);
    }
  }

  const extFields = Object.entries(lexProps).filter(
    ([name]) => !mappedLexFields.has(name) && !ATPROTO_FIELDS.has(name)
  );

  return (
    <>
      {classes.map((cls) => {
        const clsTerms = Object.values(dwcTerms)
          .filter((t) => t.class === cls)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (clsTerms.length === 0) return null;

        const mappedCount = clsTerms.filter((t) => t.name in lexByDwc).length;

        return (
          <Box key={cls}>
            <Typography variant="h3" sx={{ mt: 3.5, mb: 1 }}>
              {cls}{" "}
              <Typography component="span" sx={{ color: "text.disabled", fontWeight: 400 }}>
                ({mappedCount}/{clsTerms.length})
              </Typography>
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>DwC Term</TableCell>
                    <TableCell>Definition</TableCell>
                    <TableCell>Lexicon Field</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clsTerms.map((term) => {
                    const match = lexByDwc[term.name];
                    return (
                      <TableRow key={term.name}>
                        <TableCell>
                          <MuiLink
                            href={term.term_iri}
                            target="_blank"
                            rel="noopener"
                            sx={{ color: "primary.main", textDecoration: "none", fontSize: "0.8rem", "&:hover": { textDecoration: "underline" } }}
                          >
                            {term.name}
                          </MuiLink>
                          {GBIF_REQUIRED.has(term.name) && (
                            <StatusBadge status="gbif-req" />
                          )}
                          {GBIF_RECOMMENDED.has(term.name) && (
                            <StatusBadge status="gbif-rec" />
                          )}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {term.definition}
                        </TableCell>
                        <TableCell>
                          {match && (
                            <>
                              <Typography component="span" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                                {match.fieldName}
                              </Typography>
                              {match.prop.required && (
                                <Typography component="span" sx={{ color: "#dc2626", fontWeight: 600, ml: 0.25 }}>
                                  *
                                </Typography>
                              )}
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          {match && (
                            <Typography component="span" sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#7c3aed" }}>
                              {typeLabel(match.prop)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={match ? "mapped" : "missing"} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}

      {extFields.length > 0 && (
        <Box>
          <Typography variant="h3" sx={{ mt: 3.5, mb: 1 }}>
            Lexicon-only{" "}
            <Typography component="span" sx={{ color: "text.disabled", fontWeight: 400 }}>
              ({extFields.length} fields)
            </Typography>
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>DwC Term</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Lexicon Field</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {extFields
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([fieldName, prop]) => (
                    <TableRow key={fieldName}>
                      <TableCell />
                      <TableCell sx={{ color: "text.secondary" }}>
                        {prop.description ?? ""}
                      </TableCell>
                      <TableCell>
                        <Typography component="span" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                          {fieldName}
                        </Typography>
                        {prop.required && (
                          <Typography component="span" sx={{ color: "#dc2626", fontWeight: 600, ml: 0.25 }}>
                            *
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography component="span" sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#7c3aed" }}>
                          {typeLabel(prop)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="extension" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import type { DwcTerm } from "../data/dwcTerms";
import type { LexiconDef, LexiconProperty } from "../data/lexicons";
import {
  getDefProperties,
  typeLabel,
  constraintsLabel,
  FIELD_TO_DWC,
  ATPROTO_FIELDS,
} from "../data/lexicons";

interface Props {
  defName: string;
  defBody: LexiconDef;
  lexiconId: string;
  dwcTerms: Record<string, DwcTerm>;
}

export default function FieldTable({ defName, defBody, lexiconId, dwcTerms }: Props) {
  const { properties, required } = getDefProperties(defBody);
  if (Object.keys(properties).length === 0) return null;

  const desc =
    defBody.description ?? defBody.record?.description ?? "";
  const label = defName === "main" ? lexiconId.split(".").pop()! : defName;

  return (
    <>
      <Typography
        variant="h3"
        id={defName}
        sx={{ mt: 3.5, mb: 1 }}
      >
        #{defName}
        {defName === "main" && (
          <Typography component="span" sx={{ color: "text.disabled", fontWeight: 400, ml: 1 }}>
            ({label})
          </Typography>
        )}
      </Typography>

      {desc && (
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {desc}
        </Typography>
      )}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Field</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Constraints</TableCell>
              <TableCell>DwC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(properties).map(([fieldName, prop]) => (
              <FieldRow
                key={fieldName}
                fieldName={fieldName}
                prop={prop}
                isRequired={required.has(fieldName)}
                dwcTerms={dwcTerms}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function FieldRow({
  fieldName,
  prop,
  isRequired,
  dwcTerms,
}: {
  fieldName: string;
  prop: LexiconProperty;
  isRequired: boolean;
  dwcTerms: Record<string, DwcTerm>;
}) {
  const dwcName = FIELD_TO_DWC[fieldName] ?? fieldName;
  const dwcTerm = !ATPROTO_FIELDS.has(fieldName) ? dwcTerms[dwcName] : undefined;
  const constraints = constraintsLabel(prop);

  return (
    <TableRow>
      <TableCell>
        <Typography component="span" sx={{ fontFamily: "monospace", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          {fieldName}
        </Typography>
        {isRequired && (
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
      <TableCell sx={{ color: "text.secondary" }}>
        {prop.description ?? ""}
      </TableCell>
      <TableCell>
        {constraints && (
          <Typography component="span" sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
            {constraints}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {dwcTerm && (
          <MuiLink
            href={dwcTerm.term_iri}
            target="_blank"
            rel="noopener"
            sx={{ color: "primary.main", textDecoration: "none", fontSize: "0.8rem", "&:hover": { textDecoration: "underline" } }}
          >
            dwc:{dwcTerm.name}
          </MuiLink>
        )}
      </TableCell>
    </TableRow>
  );
}

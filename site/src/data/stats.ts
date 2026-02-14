import type { DwcTerm } from "./dwcTerms";
import type { LexiconProperty } from "./lexicons";
import { FIELD_TO_DWC, ATPROTO_FIELDS } from "./lexicons";

export interface ModelStats {
  mapped: number;
  total: number;
  missing: number;
  pct: number;
}

export interface GlobalStats extends ModelStats {
  totalFields: number;
}

export function computeModelStats(
  dwcTerms: Record<string, DwcTerm>,
  lexProps: Record<string, LexiconProperty>,
  classes: string[]
): ModelStats {
  const classSet = new Set(classes);
  const lexByDwc = new Set<string>();

  for (const fieldName of Object.keys(lexProps)) {
    if (ATPROTO_FIELDS.has(fieldName)) continue;
    const dwcName = FIELD_TO_DWC[fieldName] ?? fieldName;
    if (dwcName in dwcTerms) {
      lexByDwc.add(dwcName);
    }
  }

  const relevant = Object.values(dwcTerms).filter((t) =>
    classSet.has(t.class)
  );
  const mapped = relevant.filter((t) => lexByDwc.has(t.name)).length;
  const total = relevant.length;
  const pct = total > 0 ? (mapped / total) * 100 : 0;

  return { mapped, total, missing: total - mapped, pct };
}

export function computeGlobalStats(
  dwcTerms: Record<string, DwcTerm>,
  modelPropsList: Record<string, LexiconProperty>[],
  allClasses: string[]
): GlobalStats {
  const classSet = new Set(allClasses);
  const allProps: Record<string, LexiconProperty> = {};
  for (const props of modelPropsList) {
    Object.assign(allProps, props);
  }

  const relevant = Object.values(dwcTerms).filter((t) =>
    classSet.has(t.class)
  );
  const mappedNames = new Set<string>();
  for (const fieldName of Object.keys(allProps)) {
    if (ATPROTO_FIELDS.has(fieldName)) continue;
    const dwcName = FIELD_TO_DWC[fieldName] ?? fieldName;
    if (dwcName in dwcTerms) {
      mappedNames.add(dwcName);
    }
  }

  const mapped = relevant.filter((t) => mappedNames.has(t.name)).length;
  const total = relevant.length;
  const totalFields = modelPropsList.reduce(
    (sum, props) =>
      sum +
      Object.keys(props).filter((f) => !ATPROTO_FIELDS.has(f)).length,
    0
  );

  return {
    mapped,
    total,
    missing: total - mapped,
    pct: total > 0 ? (mapped / total) * 100 : 0,
    totalFields,
  };
}

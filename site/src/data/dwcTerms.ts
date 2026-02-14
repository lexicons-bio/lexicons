import dwcData from "./dwc-terms.json";

export interface DwcTerm {
  name: string;
  label: string;
  definition: string;
  term_iri: string;
  class: string;
}

export const dwcTerms = dwcData as Record<string, DwcTerm>;

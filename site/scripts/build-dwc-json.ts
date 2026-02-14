/**
 * Converts the Darwin Core term_versions.csv into a JSON file
 * that the React app can import at build time.
 *
 * Run: npx tsx scripts/build-dwc-json.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(SITE_ROOT, "..");
const CSV_PATH = resolve(REPO_ROOT, "schemas/dwc/term_versions.csv");
const OUT_PATH = resolve(SITE_ROOT, "src/data/dwc-terms.json");

interface DwcTerm {
  name: string;
  label: string;
  definition: string;
  term_iri: string;
  class: string;
}

function extractClass(organizedIn: string): string {
  if (!organizedIn) return "Record-level";
  const last = organizedIn.replace(/\/+$/, "").split("/").pop()!;
  if (last === "1.1" || last === "terms") return "Record-level";
  return last;
}

function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.split("\n");
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

const raw = readFileSync(CSV_PATH, "utf-8");
const rows = parseCSV(raw);

const terms: Record<string, DwcTerm> = {};

for (const row of rows) {
  if (row["status"] !== "recommended") continue;
  if ((row["rdf_type"] ?? "").includes("Class")) continue;
  if ((row["organized_in"] ?? "").includes("UseWithIRI")) continue;

  const name = row["term_localName"];
  if (!name || name in terms) continue;

  terms[name] = {
    name,
    label: row["label"] ?? "",
    definition: row["definition"] ?? "",
    term_iri: row["term_iri"] ?? "",
    class: extractClass(row["organized_in"] ?? ""),
  };
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(terms, null, 2));
console.log(`Wrote ${Object.keys(terms).length} DwC terms to ${OUT_PATH}`);

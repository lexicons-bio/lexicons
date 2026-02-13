# lexicons.bio

AT Protocol lexicons for decentralized biodiversity observation data, aligned with [Darwin Core](https://dwc.tdwg.org/) and [GBIF](https://www.gbif.org/) standards.

These lexicons define the record types used by [Observ.ing](https://observ.ing), a decentralized biodiversity observation platform built on the [AT Protocol](https://atproto.com/). They enable anyone to build interoperable apps for recording, identifying, and discussing wildlife observations — with data stored in users' personal data repositories.

## Lexicons

| NSID | Description |
|------|-------------|
| [`org.rwell.test.occurrence`](#occurrence) | A biodiversity observation — organism at a place and time |
| [`org.rwell.test.identification`](#identification) | A taxonomic determination for an observation |

## Architecture

All records use AT Protocol's `strongRef` (URI + CID) to create immutable links between records. The occurrence record sits at the center, with other record types referencing it:

```
┌──────────────┐    ┌─────────────────────────────┐
│identification │───▶│        occurrence            │
│  #taxon       │    │  #location  #imageEmbed      │
└──────────────┘    └─────────────────────────────┘
```

**Key design decisions:**
- Taxonomy lives in identification records, not occurrences — this enables community consensus identification
- The `#taxon` object is defined in the identification lexicon and reused by interaction via cross-reference
- `knownValues` (open sets) are preferred over `enum` (closed sets) for forward compatibility, per the [AT Protocol style guide](https://atproto.com/guides/lexicon-style-guide)

---

## Occurrence

**NSID:** `org.rwell.test.occurrence`

An existence of an organism at a particular place at a particular time ([dwc:Occurrence](https://dwc.tdwg.org/terms/#occurrence)). This is the core record type — every observation starts here.

### Example

```json
{
  "basisOfRecord": "HUMAN_OBSERVATION",
  "occurrenceStatus": "PRESENT",
  "eventDate": "2024-01-15T10:30:00Z",
  "location": {
    "decimalLatitude": "37.7749",
    "decimalLongitude": "-122.4194",
    "coordinateUncertaintyInMeters": 10,
    "geodeticDatum": "WGS84",
    "country": "United States",
    "countryCode": "US",
    "stateProvince": "California",
    "locality": "Golden Gate Park"
  },
  "notes": "Multiple individuals blooming along the trail",
  "individualCount": 5,
  "lifeStage": "ADULT",
  "blobs": [
    {
      "image": { "$type": "blob", "ref": { "$link": "bafyrei..." }, "mimeType": "image/jpeg", "size": 204800 },
      "alt": "Orange California Poppy flower"
    }
  ],
  "license": "CC-BY-4.0",
  "createdAt": "2024-01-15T10:35:00Z"
}
```

### Record Fields

| Field | Type | Required | Description | Darwin Core |
|-------|------|----------|-------------|-------------|
| `eventDate` | `datetime` | **yes** | When the observation occurred | dwc:eventDate |
| `location` | [`#location`](#location-object) | **yes** | Geographic coordinates and place names | — |
| `createdAt` | `datetime` | **yes** | Record creation timestamp | — |
| `basisOfRecord` | `string` | no | Nature of the record. Default: `HUMAN_OBSERVATION` | dwc:basisOfRecord |
| `occurrenceStatus` | `string` | no | Presence or absence. Default: `PRESENT` | dwc:occurrenceStatus |
| `individualCount` | `integer` | no | Number of individuals observed (min: 1) | dwc:individualCount |
| `sex` | `string` | no | Sex of the organism | dwc:sex |
| `lifeStage` | `string` | no | Age class or life stage | dwc:lifeStage |
| `verbatimLocality` | `string` | no | Original textual locality description | dwc:verbatimLocality |
| `notes` | `string` | no | Notes about the observation (max: 3000) | dwc:occurrenceRemarks |
| `blobs` | [`#imageEmbed[]`](#image-embed-object) | no | Up to 10 images | dwc:associatedMedia |
| `license` | `string` | no | SPDX license identifier | dcterms:license |

**`basisOfRecord` known values:** `HUMAN_OBSERVATION`, `MACHINE_OBSERVATION`, `OBSERVATION`

**`occurrenceStatus` known values:** `PRESENT`, `ABSENT`

**`sex` known values:** `MALE`, `FEMALE`, `HERMAPHRODITE`

**`lifeStage` known values:** `ADULT`, `JUVENILE`, `LARVA`, `PUPA`, `EGG`, `EMBRYO`, `NYMPH`, `SEEDLING`, `SUBADULT`

### Location Object

`#location` — geographic coordinates following Darwin Core standards.

| Field | Type | Required | Description | Darwin Core |
|-------|------|----------|-------------|-------------|
| `decimalLatitude` | `string` | **yes** | Latitude in decimal degrees | dwc:decimalLatitude |
| `decimalLongitude` | `string` | **yes** | Longitude in decimal degrees | dwc:decimalLongitude |
| `coordinateUncertaintyInMeters` | `integer` | no | Uncertainty radius | dwc:coordinateUncertaintyInMeters |
| `geodeticDatum` | `string` | no | Spatial reference system. Default: `WGS84` | dwc:geodeticDatum |
| `continent` | `string` | no | Continent name | dwc:continent |
| `country` | `string` | no | Country name | dwc:country |
| `countryCode` | `string` | no | ISO 3166-1 alpha-2 | dwc:countryCode |
| `stateProvince` | `string` | no | State or province | dwc:stateProvince |
| `county` | `string` | no | County | dwc:county |
| `municipality` | `string` | no | Municipality | dwc:municipality |
| `locality` | `string` | no | Specific place description | dwc:locality |
| `waterBody` | `string` | no | Water body name | dwc:waterBody |
| `minimumElevationInMeters` | `integer` | no | Lower elevation bound | dwc:minimumElevationInMeters |
| `maximumElevationInMeters` | `integer` | no | Upper elevation bound | dwc:maximumElevationInMeters |
| `minimumDepthInMeters` | `integer` | no | Lower depth bound | dwc:minimumDepthInMeters |
| `maximumDepthInMeters` | `integer` | no | Upper depth bound | dwc:maximumDepthInMeters |

### Image Embed Object

`#imageEmbed` — an image attached to an observation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | `blob` | **yes** | Image blob (JPEG, PNG, or WebP, max 10MB) |
| `alt` | `string` | **yes** | Accessibility description (max: 1000) |
| `aspectRatio` | `#aspectRatio` | no | Width and height for layout |

---

## Identification

**NSID:** `org.rwell.test.identification`

A taxonomic determination for an observation ([dwc:Identification](https://dwc.tdwg.org/list/#identification)). Multiple users can submit identifications for the same observation, enabling community consensus — similar to iNaturalist's community ID system but fully decentralized.

The identification contains an embedded `#taxon` object following the [Darwin Core Taxon class](https://dwc.tdwg.org/list/#taxon).

### Example

```json
{
  "subject": {
    "uri": "at://did:plc:abc.../org.rwell.test.occurrence/3k...",
    "cid": "bafyrei..."
  },
  "taxon": {
    "scientificName": "Eschscholzia californica",
    "scientificNameAuthorship": "Cham.",
    "taxonRank": "species",
    "vernacularName": "California Poppy",
    "kingdom": "Plantae",
    "phylum": "Tracheophyta",
    "class": "Magnoliopsida",
    "order": "Ranunculales",
    "family": "Papaveraceae",
    "genus": "Eschscholzia"
  },
  "comment": "Distinctive orange petals and feathery leaves",
  "isAgreement": false,
  "confidence": "high",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

### Record Fields

| Field | Type | Required | Description | Darwin Core |
|-------|------|----------|-------------|-------------|
| `subject` | `com.atproto.repo.strongRef` | **yes** | Reference to the occurrence being identified | — |
| `taxon` | [`#taxon`](#taxon-object) | **yes** | The taxonomic determination | dwc:Taxon |
| `createdAt` | `datetime` | **yes** | When the identification was made | dwc:dateIdentified |
| `subjectIndex` | `integer` | no | Index when multiple organisms in one observation (0-99) | — |
| `comment` | `string` | no | Reasoning for this identification (max: 3000) | dwc:identificationRemarks |
| `isAgreement` | `boolean` | no | Agrees with current community ID. Default: `false` | — |
| `identificationQualifier` | `string` | no | Qualifier like "cf." or "aff." (max: 16) | dwc:identificationQualifier |
| `confidence` | `string` | no | Confidence level. Default: `medium` | — |

**`confidence` known values:** `low`, `medium`, `high`

**`identificationQualifier` known values:** `cf.`, `aff.`

### Taxon Object

`#taxon` — taxonomic information following the [Darwin Core Taxon class](https://dwc.tdwg.org/list/#taxon). This object is also referenced by the interaction lexicon.

| Field | Type | Required | Description | Darwin Core |
|-------|------|----------|-------------|-------------|
| `scientificName` | `string` | **yes** | Full scientific name (max: 256) | dwc:scientificName |
| `scientificNameAuthorship` | `string` | no | Authorship citation (max: 256) | dwc:scientificNameAuthorship |
| `taxonRank` | `string` | no | Taxonomic rank. Default: `species` (max: 32) | dwc:taxonRank |
| `vernacularName` | `string` | no | Common name (max: 256) | dwc:vernacularName |
| `kingdom` | `string` | no | Kingdom (max: 64) | dwc:kingdom |
| `phylum` | `string` | no | Phylum (max: 64) | dwc:phylum |
| `class` | `string` | no | Class (max: 64) | dwc:class |
| `order` | `string` | no | Order (max: 64) | dwc:order |
| `family` | `string` | no | Family (max: 64) | dwc:family |
| `genus` | `string` | no | Genus (max: 64) | dwc:genus |

**`taxonRank` known values:** `kingdom`, `phylum`, `class`, `order`, `family`, `genus`, `species`, `subspecies`, `variety`, `form`

---

## Darwin Core Alignment

These lexicons are designed for interoperability with [Darwin Core](https://dwc.tdwg.org/) (DwC) and [GBIF](https://www.gbif.org/). Key mappings:

| Concept | Our Approach | DwC/GBIF Equivalent |
|---------|-------------|---------------------|
| Observation | `occurrence` record | dwc:Occurrence |
| Species ID | `identification` record with `#taxon` | dwc:Identification + dwc:Taxon |
| Observer | AT Protocol DID (repo owner) | dwc:recordedBy |
| Identifier | AT Protocol DID (record creator) | dwc:identifiedBy |
| Record ID | AT Protocol URI (`at://did/collection/rkey`) | dwc:occurrenceID |
| Location | `#location` nested object | dwc:decimalLatitude, dwc:decimalLongitude, etc. |
| Media | `#imageEmbed` array | dwc:associatedMedia |

For the complete field-by-field Darwin Core mapping, see [docs/darwin-core.md](docs/darwin-core.md).

## Usage

These lexicons follow the [AT Protocol Lexicon](https://atproto.com/specs/lexicon) schema format. To use them in your own AT Protocol application:

1. **Reference by NSID** — Use the namespace identifier (e.g., `org.rwell.test.occurrence`) to read/write records
2. **Store in user repos** — Records are stored in users' personal data servers (PDS) under the appropriate collection
3. **Build an appview** — Aggregate records from across the network via the AT Protocol firehose

### Record Keys

All records use `tid` (timestamp-based identifier) as their record key, following the [AT Protocol record key specification](https://atproto.com/specs/record-key).

### Cross-References

Records reference each other using `com.atproto.repo.strongRef`, which contains both a URI and a CID (content identifier). This creates immutable links — the CID ensures you're referencing a specific version of the target record.

## Links

- [Observ.ing](https://observ.ing) — The biodiversity observation platform using these lexicons
- [AT Protocol](https://atproto.com/) — The decentralized social protocol
- [AT Protocol Lexicon Spec](https://atproto.com/specs/lexicon) — How lexicons work
- [Darwin Core Standard](https://dwc.tdwg.org/) — Biodiversity data standard
- [GBIF](https://www.gbif.org/) — Global Biodiversity Information Facility

## License

The lexicon schemas in this repository are licensed under [CC0 1.0 Universal](LICENSE).
